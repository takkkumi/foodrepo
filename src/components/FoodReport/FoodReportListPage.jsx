import React, { useState, useEffect } from "react"
import firebase from "firebase/app"
import "firebase/firestore"
import { FoodReportListItem } from "./FoodReportListItem"
import { Card, Modal } from "semantic-ui-react"
import { FoodReportItemDetail } from "./FoodReportItemDetail"
export const FoodReportListPage = () => {
  const [docs, setDocs] = useState(null)
  const [query, setQuery] = useState({
    collection: "eventSearch",
    option: null
  })
  const [controllModal, setControllModal] = useState(null)
  useEffect(() => {
    const f = async () => {
      const getData = await firebase
        .firestore()
        .collection(query.collection)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get()
      setDocs(getData.docs)
      const modalArray = getData.docs.map(doc => ({ [doc.id]: false }))
      setControllModal(modalArray.reduce((obj, data) => ({ ...obj, ...data })))
    }
    f()

    return setDocs(null)
  }, [query])

  return (
    <Card.Group>
      {docs &&
        controllModal &&
        docs.map(searchDoc => (
          <Modal
            trigger={
              <FoodReportListItem
                props={searchDoc.data()}
                setControllModal={setControllModal}
                controllModal={controllModal}
                id={searchDoc.id}
              />
            }
            open={controllModal[searchDoc.id]}
            onClose={() =>
              setControllModal({
                ...controllModal,
                ...{ [searchDoc.id]: false }
              })
            }
            key={searchDoc.id}
          >
            <Modal.Content>
              <FoodReportItemDetail id={searchDoc.id} authorRef={searchDoc.data().authorRef} />
            </Modal.Content>
          </Modal>
        ))}
    </Card.Group>
  )
}
