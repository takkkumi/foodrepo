import React, { useEffect, useState } from "react"
import firebase from "firebase/app"
import "firebase/firestore"
import { Segment, Container, Header, Image, Feed, Divider } from "semantic-ui-react"
import { japDate } from "../../util/Date"
export const FoodReportItemDetail = ({ id, authorRef }) => {
  const [docs, setDocs] = useState(null)
  const [user, setUser] = useState(null)
  const query = {
    collection: "foodrepo",
    option: null
  }
  useEffect(() => {
    const f = async () => {
      const getData = await firebase
        .firestore()
        .collection(query.collection)
        .doc(id)
        .get()
      setDocs(getData.data())
    }
    f()
    const f2 = async () => {
      const getAuthor = await authorRef?.get()
      setUser(getAuthor.data())
    }
    f2()
  }, [id, authorRef, query.collection])
  return (
    <Container>
      <Segment basic textAlign='center' vertical >

        <Header as="h1" floated="left" style={{ whiteSpace: "pre-line" }}  >
          {docs?.title}
        </Header>  <Header floated="right">
          <Feed size="large">
            <Feed.Event>
              <Feed.Label image={user?.userPhoto} />
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>
                    {" "}
                    {user?.name ?? "Unknown user"}
                  </Feed.User>
                  <Feed.Date>
                    {docs?.createdAt?.toDate &&
                      japDate(docs.createdAt.toDate(), "yo年MMMdo日HH時mm分")}
                    更新
                  </Feed.Date>
                </Feed.Summary>
              </Feed.Content>
            </Feed.Event>
          </Feed>
        </Header>

      </Segment>
      <Segment vertical> <Divider /></Segment>
      <Segment vertical>

      </Segment>
    </Container>)
}