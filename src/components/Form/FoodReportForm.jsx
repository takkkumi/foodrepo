import React, { useState, useEffect, useContext, createContext } from "react";
import _ from "lodash";
import { Form, Button, Dropdown, Rating, Checkbox } from "semantic-ui-react";
import useForm, { FormContext } from "react-hook-form";
import { UserContext } from "../../App";
import {
  FormResetState,
  FormFetchData,
  FormIsError,
  FirebaseRegister
} from "../../Actions/FormAction";
import { toast } from "react-toastify";
import GoogleMapSearchForm from "./GoogleMapSearchForm";
import firebase from "firebase/app";
import "firebase/firestore";
import FoodrepoPhotoPage from "../Photo/FoodrepoPhotoPage";
import { uploadProfileImage } from "../../Actions/PhotoAction";
// import PlacesAutocompleteForm from "./PlacesAutocompleteForm"
export const FoodReportContext = createContext();
const FoodReportForm = () => {
  const auth = useContext(UserContext);
  const user = auth.storeUser;
  const [options] = useState([
    { key: 1, text: "カレー", value: "curry" },
    { key: 2, text: "中華料理", value: "chinese" },
    { key: 3, text: "洋風料理", value: "europian" },
    { key: 4, text: "和食", value: "japanese" },
    { key: 5, text: "ラーメン", value: "ramen" },
    { key: 6, text: "居酒屋", value: "tevern" }
  ]);
  const handleUploadImages = async (foodRepoId, image) => {
    try {
      await uploadProfileImage(image, `${user.userUid}/foodrepo/${foodRepoId}`);

      toast.success("プロフィール画像を更新しました");
    } catch (error) {
      console.log(error);
      toast.error("画像をアップロード出来ませんでした");
    }
  };
  const methods = useForm();
  const [isRating, setIsRating] = useState(false);
  const [isGoogleMapOpen, setIsGoogleMapOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [result, setResult] = useState(null)
  // const [childFunction, setChildFunction] = useState({})
  const resetState = data => {
    FormResetState(initialFoodRepoState, data, methods.setValue);
    setIsGoogleMapOpen(false);
    setInitialFoodRepoState({
      ...initialFoodRepoState,
      ...{ placeLatLng: null }
    });
    setIsSubmitting(true);
  };
  const [initialFoodRepoState, setInitialFoodRepoState] = useState({
    author: "",
    title: "",
    place: "",
    placeLatLng: null,
    rating: null,
    tag: [],
    MainImageURL: "",
    images: [],
    description: "",
    text: "",
    herePlaceLatLng: null
  });
  const onChange = async (e, { name, value }) => {
    e.preventDefault();

    methods.setValue(name, value);
    await methods.triggerValidation({ name });
  };
  const onSubmit = data => {
    const geoPoint = new firebase.firestore.GeoPoint(
      initialFoodRepoState.placeLatLng.lat,
      initialFoodRepoState.placeLatLng.lng
    );
    const now = firebase.firestore.FieldValue.serverTimestamp();
    const APIdata = {
      placeLatLng: geoPoint,
      updatedAt: now,
      createdAt: initialFoodRepoState.createdAt || now
    };

    const formSubmit = FormFetchData(initialFoodRepoState, data, APIdata);
    delete formSubmit.herePlaceLatLng;

    console.log(initialFoodRepoState, data, formSubmit);
    resetState(data);
    FirebaseRegister("foodrepo", formSubmit, null, true);
    toast.success(`『${formSubmit.title}』を更新しました`);
  };

  useEffect(() => {
    methods.register(
      { name: "title" },
      {
        required: "タイトルを入力してください",
        maxLength: { value: 30, message: "タイトルは30文字以内にしてください" },
        minLength: { value: 2, message: "タイトルは2文字以上にしてください" }
      }
    );
    methods.register(
      { name: "tag" },
      {
        validate: {
          maxLength: value =>
            (value ? value && value.length < 5 : true) ||
            "登録できるタグは４つまでです"
        }
      }
    );
    methods.register(
      { name: "place" },
      {
        maxLength: { value: 20, message: "20文字以内にしてください" }
      }
    );
    methods.register(
      { name: "text" },
      {
        required: "本文を入力してください",
        maxLength: { value: 1800, message: "本文は1800文字以内にしてください" }
      }
    );
    if (user) {
      setInitialFoodRepoState({
        ...initialFoodRepoState,
        ...{ author: user.userUid }
      });
    }
    setIsSubmitting(false);
    console.log(initialFoodRepoState);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isSubmitting, auth.isLogin]);
  return (
    <FoodReportContext.Provider
      value={{
        initialFoodRepoState,
        setInitialFoodRepoState,
        isSubmitting,
        setIsSubmitting
      }}
    >
      <FormContext {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <Form.Field>
            <label>タイトル</label>
            {methods.errors.title && (
              <span>{methods.errors.title.message}</span>
            )}
            <Form.Input
              placeholder={"タイトル"}
              name="title"
              value={methods.watch("title") || ""}
              onChange={onChange}
              error={methods.errors.title ? true : false}
            />
          </Form.Field>
          <Form.Group widths="equal">
            <Form.Field>
              <label>場所</label>
              {methods.errors.place && (
                <span>{methods.errors.place.message}</span>
              )}
              <Form.Input
                placeholder={"どこで？"}
                name="place"
                value={methods.watch("place") || ""}
                onChange={onChange}
                error={methods.errors.place ? true : false}
              />
            </Form.Field>
            <Form.Field>
              　
              <label>
                <Checkbox
                  label="レーティングを有効にする"
                  onChange={(e, { checked }) => {
                    setIsRating(checked);
                    !checked &&
                      setInitialFoodRepoState({
                        ...initialFoodRepoState,
                        rating: null
                      });
                  }}
                />
              </label>
              {isRating && (
                <Rating
                  icon="heart"
                  size="massive"
                  disabled={!isRating}
                  value={initialFoodRepoState.rating}
                  maxRating={5}
                  onRate={(e, { rating }) =>
                    setInitialFoodRepoState({
                      ...initialFoodRepoState,
                      rating: rating
                    })
                  }
                />
              )}
            </Form.Field>
          </Form.Group>
          <Button
            content={
              !isGoogleMapOpen
                ? initialFoodRepoState.placeLatLng
                  ? "位置情報を表示する"
                  : "現在地を所得する"
                : "位置情報を非表示にする"
            }
            onClick={() => {
              setIsGoogleMapOpen(!isGoogleMapOpen);
            }}
          />
          {isGoogleMapOpen && initialFoodRepoState.herePlaceLatLng && (
            <Button
              content="位置情報を現在地に設定する"
              onClick={() => {
                setInitialFoodRepoState({
                  ...initialFoodRepoState,
                  ...{ placeLatLng: initialFoodRepoState.herePlaceLatLng }
                });
              }}
            />
          )}
          {initialFoodRepoState.placeLatLng && (
            <Button
              content="位置情報を削除する"
              negative
              onClick={() => {
                setInitialFoodRepoState({
                  ...initialFoodRepoState,
                  ...{ placeLatLng: null }
                });
                setIsGoogleMapOpen(false);
              }}
            />
          )}
          {/* <PlacesAutocompleteForm /> */}
          {isGoogleMapOpen && <GoogleMapSearchForm />}

          <Form.Field>
            <label>ジャンル</label>
            {methods.errors.tag && (
              <label>{_.get(methods, "errors.tag.message")}</label>
            )}
            <Dropdown
              name="tag"
              selection
              multiple
              placeholder="tag"
              options={options}
              compact
              value={methods.watch("tag") || []}
              onChange={onChange}
              error={methods.errors.tag ? true : false}
            />
          </Form.Field>
          <FoodrepoPhotoPage />
          <Form.Field>
            <label>本文</label>
            {methods.errors.description && (
              <span>{methods.errors.description.message}</span>
            )}
            <Form.TextArea
              placeholder={"本文"}
              name="text"
              value={methods.watch("text") || ""}
              onChange={onChange}
              error={methods.errors.place ? true : false}
            />
          </Form.Field>

          <Button type="submit" disabled={FormIsError(methods.errors)}>
            Push
          </Button>
          <Button
            negative
            type="reset"
            onClick={() => {
              resetState(initialFoodRepoState, methods.getValues());
              methods.clearError();
            }}
          >
            Reset
          </Button>
        </Form>
      </FormContext>
    </FoodReportContext.Provider>
  );
};

export default FoodReportForm;
