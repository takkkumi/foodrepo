import React, {
  useState,
  useEffect,
  Fragment,
  useContext,
  useRef
} from "react";
import _ from "lodash";
import {
  Segment,
  Header,
  Divider,
  Grid,
  Button,
  Image,
  Card
} from "semantic-ui-react";

import DropzoneInpiut from "./DropzoneInput";

import { FoodReportContext } from "../Form/FoodReportForm";
import { UserContext } from "../../App";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

// import CropperInput from "./CropperInput"

const FoodrepoPhotoPage = () => {
  const formValue = useContext(FoodReportContext);
  const auth = useContext(UserContext);
  const initialState = formValue.initialFoodRepoState;
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(null);
  const images = formValue.initialFoodRepoState.images;
  const setImages = image =>
    formValue.setInitialFoodRepoState({ ...initialState, images: image });
  const cropper = useRef();
  const cropImage = () => {
    if (typeof cropper.current.getCroppedCanvas() === "undefined") {
      return;
    }
    cropper.current.getCroppedCanvas().toBlob(blob => {
      setImage(blob);
    }, "image/jpeg");
  };
  const handleSetImages = image => {
    setImages([...images, image]);
    handleCancelCrops();
    console.log(images);
  };

  const handleCancelCrops = async () => {
    setFiles([]);
    setImage();
  };
  const handleDeleteImages = image => {
    setImages(_.without(images, image));
  };
  // const handleSetMainPhoto = async photo => {
  // 	try {
  // 		await setMainPhoto(photo)
  // 		toastr.success("Success", "メイン画像を変更しました")
  // 	} catch (error) {
  // 		toastr.error("Oops", error.message)
  // 	}
  // }
  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);
  return (
    <Segment>
      <Header dividing size="large" content="Your Photos" />
      {images.length < 4 && (
        <Grid>
          <Grid.Column width={4}>
            <Header color="teal" sub content="Step 1 - Add Photo" />
            <DropzoneInpiut setFiles={setFiles} />
          </Grid.Column>
          <Grid.Column width={1} />

          <Grid.Column width={4}>
            <Header sub color="teal" content="Step 2 - Resize image" />
            {files.length > 0 && (
              <Cropper
                ref={cropper}
                src={files[0].preview}
                style={{ height: 300, width: "100%" }}
                preview=".img-preview"
                aspectRatio={1}
                viewMode={1}
                dragMode="move"
                guides={false}
                scalable={true}
                cropBoxMovable={true}
                cropBoxResizable={true}
                crop={cropImage}
              />
            )}
          </Grid.Column>
          <Grid.Column width={1} />
          <Grid.Column width={4}>
            <Header sub color="teal" content="Step 3 - Preview & Upload" />
            {files.length > 0 && (
              <Fragment>
                <div
                  className="img-preview"
                  style={{
                    minHeight: "200px",
                    minWidth: "200px",
                    overflow: "hidden"
                  }}
                />
                <Button.Group>
                  <Button
                    onClick={() => {
                      handleSetImages(image);
                      console.log(files);
                    }}
                    style={{ width: "100px" }}
                    positive
                    icon="check"
                  />
                  <Button
                    onClick={handleCancelCrops}
                    style={{ width: "100px" }}
                    icon="close"
                  />
                </Button.Group>
              </Fragment>
            )}
          </Grid.Column>
        </Grid>
      )}
      <Divider />

      {images.length > 0 && (
        <Card.Group itemsPerRow={4}>
          {images.map((image, key) => (
            <Card key={key}>
              <Image src={URL.createObjectURL(image)} wrapped ui={false} />
              <Card.Content extra>
                <div className="ui two buttons">
                  <Button basic color="green">
                    Main
                  </Button>
                  <Button
                    basic
                    icon="trash"
                    color="red"
                    onClick={() => handleDeleteImages(image)}
                  />
                </div>
              </Card.Content>
            </Card>
          ))}{" "}
        </Card.Group>
      )}
      {/* <UserPhotos
				photos={photos}
				profile={profile}
				deletePhoto={handleDeletePhoto}
				setMainPhoto={handleSetMainPhoto}
			/> */}
    </Segment>
  );
};

export default FoodrepoPhotoPage;
