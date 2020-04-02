import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { FoodReportListItem } from "./FoodReportListItem";
import { Card, Modal } from "semantic-ui-react";
export const FoodReportListPage = () => {
  const [docs, setDocs] = useState(null);
 const [query,setQuery] = useState({
   collection: "eventSearch",
   option:null
 })
  useEffect(() => {
    const f = async () => {
      const getData= await firebase
        .firestore()
        .collection(query.collection)
        .orderBy("createdAt","desc")
        .limit(10)
        .get()
        setDocs(getData.docs)
       ;
    };
    f();
return setDocs(null)
    
  }, [query]);
  return (

      <Card.Group>
       {docs&&docs.map(searchDoc => 
        <Modal trigger={ <FoodReportListItem props={searchDoc.data()} key={searchDoc.id} /> }>
          a
        </Modal>
       
      )} 
  </Card.Group>
  
  );
};
