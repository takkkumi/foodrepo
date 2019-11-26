const googleConfig = require("./serviceaccount.json");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const _ = require("lodash");
const {
  tokenize,
  tokenizeArray
} = require("./tokenize");
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);

adminConfig.credential = admin.credential.cert(googleConfig);
admin.initializeApp(adminConfig);

const asiafunctions = functions.region("asia-northeast1");

exports.fullTextSearch = asiafunctions.firestore
  .document("foodrepo/{foodrepoID}")
  .onWrite(async (event, context) => {
    let updatedEvent = event.after.data();

    const language = require("@google-cloud/language");
    const client = new language.LanguageServiceClient();

    const document = {
      content: updatedEvent.text,
      type: "PLAIN_TEXT"
    };

    const [result] = await client.analyzeEntities({
      document
    });

    const entities = result.entities;

    let searchTag;
    if (entities.length) {
      const filter = 1 / (entities.length * 3);
      const filteredEntitiies1 = _.filter(entities, (o) => {
        return (o.type === "DATE")

      });
      const filteredEntitiies2 = _.filter(entities, (o) => {
        return o.salience > filter

      });
      const filteredEntitiies = [filteredEntitiies1, ...filteredEntitiies2]
      console.log("entites", entities);
      console.log("filter", filter);
      console.log("filteredEntitiies", filteredEntitiies);
      searchTag = _.map(filteredEntitiies, "name");
    }

    const fullTextSearch = _.chain(searchTag)
      .flattenDeep()
      .compact()
      .uniq()
      .value();
    const fullTextSearchArray = _.chain([
        fullTextSearch.map(a => tokenizeArray(a)),
        updatedEvent.tag
      ])
      .flattenDeep()
      .compact()
      .uniq()
      .value();

    const fullTextSearchNgram = _.chain([
        fullTextSearch.map(a => tokenize(a)),
        updatedEvent.tag
      ])
      .flattenDeep()
      .uniq()
      .value();
    let fullTextSearchObject = {};
    fullTextSearchNgram.map(
      token =>
      (fullTextSearchObject = {
        ...fullTextSearchObject,
        [token]: true
      })
    );

    console.log(Buffer.byteLength(fullTextSearchArray.join("")));
    await admin
      .firestore()
      .collection("eventSearch")
      .doc(updatedEvent.id)
      .update({
        fullTextSearchArray: fullTextSearchArray,
        fullTextSearchObject: fullTextSearchObject
      });
  });