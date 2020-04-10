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

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { toast } from "react-toastify";

// import CropperInput from "./CropperInput"

const FoodrepoPhotoPage = prop => {
	const contextValue = useContext(FoodReportContext);
	const formValue = prop.length ? prop : contextValue;

	const adhocFormStore = formValue.adhocFormStore;
	const [files, setFiles] = useState([]);
	const [image, setImage] = useState(null);
	const images = adhocFormStore.images;
	const mainImage = adhocFormStore.mainImage;
	const setImages = image =>
		formValue.setAdhocFormStore({ ...adhocFormStore, images: image });
	const setMainImage = image => {
		formValue.setAdhocFormStore({ ...adhocFormStore, mainImage: image });
		toast.success("メイン画像を変更しました");
	};
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
		if (!images.length) {
			formValue.setAdhocFormStore({
				...adhocFormStore,
				...{ mainImage: image, images: [...images, image] }
			});
		} else {
			setImages([...images, image]);
		}
		handleCancelCrops();
	};

<<<<<<< HEAD
  const handleCancelCrops = async () => {
    setFiles([]);
    setImage();
  };
  const handleDeleteImages = image => {
    if (images.length > 1) {
      formValue.setAdhocFormStore({
        ...adhocFormStore,
        images: _.without(images, image),
        mainImage: _.without(images, image)[0]
      });
    } else {
      formValue.setAdhocFormStore({
        ...adhocFormStore,
        images: [],
        mainImage: null
      });
    }
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
      {images.length < 5 && (
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
        <Grid
          columns={2}
          stackable
          textAlign="center"
          style={{ backgroundColor: "grey" }}
        >
          <Grid.Row verticalAlign="middle">
            <Grid.Column>
              {mainImage && (
                <Card color="green" centered>
                  <Image
                    src={URL.createObjectURL(mainImage)}
                    wrapped
                    ui={false}
                  />
                  <Card.Content textAlign="center">
                    <Header color="green">Main Photo</Header>
                    <Card.Meta>{`この画像が一覧に表示されます。`}</Card.Meta>
                  </Card.Content>
                  <Card.Content extra>
                    <Button
                      fluid
                      basic
                      color="red"
                      content="Delete Main Photo"
                      onClick={() => handleDeleteImages(mainImage)}
                    />
                  </Card.Content>
                </Card>
              )}
            </Grid.Column>
            <Grid.Column>
              <Card.Group itemsPerRow={2}>
                {_.without(images, mainImage).map((image, key) => (
                  <Card key={key}>
                    <Image
                      src={URL.createObjectURL(image)}
                      wrapped
                      ui={false}
                    />
                    <Card.Content extra>
                      <div className="ui two buttons">
                        <Button
                          basic
                          color="green"
                          onClick={() => setMainImage(image)}
                        >
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
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </Segment>
  );
=======
	const handleCancelCrops = async () => {
		setFiles([]);
		setImage();
	};
	const handleDeleteImages = image => {
		if (images.length > 1) {
			formValue.setAdhocFormStore({
				...adhocFormStore,
				images: _.without(images, image),
				mainImage: _.without(images, image)[0]
			});
		} else {
			formValue.setAdhocFormStore({
				...adhocFormStore,
				images: [],
				mainImage: null
			});
		}
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [files]);
	return (
		<Segment>
			<Header dividing size="large" content="Your Photos" />
			{images.length < 5 && (
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
				<Grid
					columns={2}
					stackable
					textAlign="center"
					style={{ backgroundColor: "grey" }}
				>
					<Grid.Row verticalAlign="middle">
						<Grid.Column>
							{mainImage && (
								<Card color="green" centered>
									<Image
										src={URL.createObjectURL(mainImage)}
										wrapped
										ui={false}
									/>
									<Card.Content textAlign="center">
										<Header color="green">Main Photo</Header>
										<Card.Meta>{`この画像が一覧に表示されます。`}</Card.Meta>
									</Card.Content>
									<Card.Content extra>
										<Button
											fluid
											basic
											color="red"
											content="Delete Main Photo"
											onClick={() => handleDeleteImages(mainImage)}
										/>
									</Card.Content>
								</Card>
							)}
						</Grid.Column>
						<Grid.Column>
							<Card.Group itemsPerRow={2}>
								{_.without(images, mainImage).map((image, key) => (
									<Card key={key}>
										<Image
											src={URL.createObjectURL(image)}
											wrapped
											ui={false}
										/>
										<Card.Content extra>
											<div className="ui two buttons">
												<Button
													basic
													color="green"
													onClick={() => setMainImage(image)}
												>
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
						</Grid.Column>
					</Grid.Row>
				</Grid>
			)}
		</Segment>
	);
>>>>>>> master
};

export default FoodrepoPhotoPage;
