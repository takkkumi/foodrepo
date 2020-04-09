import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
export const FoodReportItemDetail = ({ id }) => {
  const [docs, setDocs] = useState(null);
  const query = {
    collection: "foodrepo",
    option: null
  };
  useEffect(() => {
    const f = async () => {
      const getData = await firebase
        .firestore()
        .collection(query.collection)
        .doc(id)
        .get();
      setDocs(getData.data());
    };
    f();
  }, [id, query.collection]);
  return <div>{docs && docs.text}}</div>;
};
