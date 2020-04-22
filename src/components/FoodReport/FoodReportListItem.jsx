import React, { useEffect, useState } from "react"

import { Card, Image, Feed, Header, Label } from "semantic-ui-react"
import { japDate } from "../../util/Date"

export const FoodReportListItem = ({
  props,
  setControllModal,
  id,
  controllModal
}) => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const f = async () => {
      const getAuthor = await props?.authorRef?.get()
      setUser(getAuthor.data())
    }

    f()
  }, [props])
  return (
    <Card color="red" fluid>
      <Card.Content>
        {" "}
        <Header floated="left" style={{ whiteSpace: "pre-line" }}>
          <Card.Header
            as="a"
            onClick={() =>
              setControllModal({ ...controllModal, ...{ [id]: true } })
            }
          >
            {props?.title ?? ""}{" "}
          </Card.Header>
          <Card.Meta style={{ fontSize: "0.7em" }}>
            {props?.place}
            {
              props?.tag?.map((element, key) => (
                <Label key={key}>{element}</Label>
              ))}
          </Card.Meta>
        </Header>
        <Header floated="right">
          <Feed size="large">
            <Feed.Event>
              <Feed.Label image={user?.userPhoto} />
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>
                    {" "}
                    {user?.name ?? "unknownUser"}
                  </Feed.User>
                  <Feed.Date>
                    {props?.createdAt?.toDate &&
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

              <Image
                floated="left"
                size="tiny"
                src={props?.mainImageURL}
              />

              <Feed.Summary
                onClick={() =>
                  setControllModal({ ...controllModal, ...{ [id]: true } })
                }
              >
                {props.textSlice}
                {props.textHasMore && "..."}
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        </Feed>
      </Card.Content>
    </Card>
  )
}
