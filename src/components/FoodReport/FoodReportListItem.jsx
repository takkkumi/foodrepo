import React, { useEffect, useState } from "react";

import { Card, Image, Feed, Header, Label } from "semantic-ui-react";
import { getProps } from "../../util/CustomLodash";
import { japDate } from "../../util/Date";

export const FoodReportListItem = ({ props }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const f = async () => {
      const getAuthor = await props.authorRef.get();
      setUser(getAuthor.data());
    };

    getProps(props, "authorRef.get") && f();
  }, [props]);
  return (
    <Card color="red" fluid  >  
      <Card.Content>
        {" "}
        <Header floated="left" style={{ whiteSpace: "pre-line" }}>
          <Card.Header>{getProps(props, "title", "")} </Card.Header>
          <Card.Meta style={{ fontSize: "0.7em" }}>
            {getProps(props, "place")}
            {getProps(props, "tag") &&
              props.tag.map((element, key) => (
                <Label key={key}>{element}</Label>
              ))}
          </Card.Meta>
        </Header>
        <Header floated="right">
          <Feed size="large">
            <Feed.Event>
              <Feed.Label image={getProps(user, "userPhoto")} />
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>
                    {" "}
                    {getProps(user, "name", "unknownUser")}
                  </Feed.User>
                  <Feed.Date>
                    {getProps(props, "createdAt.toDate") &&
                      japDate(props.createdAt.toDate(), "yo年MMMdo日HH時mm分")}
                    更新
                  </Feed.Date>
                </Feed.Summary>
              </Feed.Content>
            </Feed.Event>
          </Feed>
        </Header>
      </Card.Content>

      <Card.Content>
        <Feed>
          <Feed.Event>
            <Feed.Content>
              {getProps(props, "mainImageURL") && (
                <Image
                  floated="left"
                  size="tiny"
                  src={getProps(props, "mainImageURL")}
                />
              )}
              <Feed.Summary>
                {getProps(props, "textSlice")}
                {getProps(props, "textHasMore") && "..."}
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        </Feed>
      </Card.Content>
    </Card>
  );
};
