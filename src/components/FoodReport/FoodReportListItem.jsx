import React from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import { Card } from "semantic-ui-react";

const mockRef = firebase
  .firestore()
  .collection("foodrepo")
  .doc("V31yyTSvpSC6KJhDmoAb")
  .get();

export const FoodReportListItem = () => {
  return <Card></Card>;
};
