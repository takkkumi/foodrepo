import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { FoodReportListItem } from "./FoodReportListItem";
import { Card } from "semantic-ui-react";
export const FoodReportListPage = () => {
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    const f = async () => {
      const getData= await firebase
        .firestore()
        .collection("eventSearch")
        .orderBy("createdAt","desc")
        .limit(10)
        .get()
        setDocs(getData.docs)
       ;
    };
    f();
docs&&console.log(docs[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (

      <Card.Group>
       {docs&&docs.map(searchDoc => 
        
        <FoodReportListItem props={searchDoc.data()} key={searchDoc.id} /> 
      )} 
  </Card.Group>
  
  );
};
