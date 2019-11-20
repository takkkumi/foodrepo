import React from "react";
import _ from "lodash";

import { Card, Image } from "semantic-ui-react";

export const FoodReportListItem = ({ props }) => {
  return (
    <Card color="red" fluid>
      <Card.Content>
        {_.get(props, "title") || ""}
        <Image
          floated="right"
          size="mini"
          src={_.get(props, "mainImageURL")}
        />
      </Card.Content>
    </Card>
  );
};
