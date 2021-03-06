import React, { useState, useEffect, useContext, createContext } from "react"

import {
	Form,
	Button,
	Dropdown,
	Rating,
	Checkbox,
	Label
} from "semantic-ui-react"
import useForm, { FormContext } from "react-hook-form"
import { UserContext } from "../../App"
import {
	FormResetState,
	FormFetchData,
	FormIsError
} from "../../Actions/FormAction"
import { toast } from "react-toastify"
import GoogleMapSearchForm from "./GoogleMapSearchForm"
import firebase from "firebase/app"
import "firebase/firestore"
import FoodrepoPhotoPage from "../Photo/FoodrepoPhotoPage"
import { uploadImage } from "../../Actions/PhotoAction"
import { FirebaseRegister, batchSetter } from "../../Actions/FirestoreAction"


// import PlacesAutocompleteForm from "./PlacesAutocompleteForm"s
export const FoodReportContext = createContext()
const FoodReportForm = () => {
	const auth = useContext(UserContext)
	const user = auth?.storeUser?.data ?? null
	const [options] = useState([
		{ key: 1, text: "カレー", value: "カレー" },
		{ key: 2, text: "中華料理", value: "中華料理" },
		{ key: 3, text: "洋風料理", value: "洋風料理" },
		{ key: 4, text: "和食", value: "和食" },
		{ key: 5, text: "ラーメン", value: "ラーメン" },
		{ key: 6, text: "居酒屋", value: "居酒屋" }
	])

	const methods = useForm()
	const now = firebase.firestore.FieldValue.serverTimestamp()

	const [isSubmitting, setIsSubmitting] = useState(false)
	const defaultInitialFoodRepoState = {
		title: "",
		place: "",
		placeLatLng: null,
		rating: null,
		tag: [],
		mainImage: null,
		image: {},
		description: "",
		text: ""
	}
	const defaultAdhocForStore = {
		herePlaceLatLng: null,
		cacheRating: null,
		mainImage: null,
		images: [],
		isRating: false,
		isGoogleMapOpen: false,
		isLoading: false
	}
	const [initialFoodRepoState, setInitialFoodRepoState] = useState(
		defaultInitialFoodRepoState
	)
	const [adhocFormStore, setAdhocFormStore] = useState(defaultAdhocForStore)

	const resetState = data => {
		FormResetState(initialFoodRepoState, data, methods.setValue)

		setInitialFoodRepoState(defaultInitialFoodRepoState)
		setAdhocFormStore(defaultAdhocForStore)
		setIsSubmitting(true)
	}
	const handleUploadImage = async (foodRepoId, image) => {
		try {
			const uploadedImage = await uploadImage(
				image,
				`${user.userUid}/foodrepo/${foodRepoId}`
			)
			const uploadedImageURL = await uploadedImage.ref.getDownloadURL()
			const uploadedImageRef = uploadedImage.ref
			const uploadedImageName = uploadedImage.ref.name

			return {
				url: uploadedImageURL,
				path: uploadedImageRef.fullPath,
				name: uploadedImageName,
				createdAt: now
			}
		} catch (error) {
			console.log(error)
			toast.error("画像をアップロード出来ませんでした")
		}
	}
	const onChange = async (e, { name, value }) => {
		e.preventDefault()
		methods.setValue(name, value)
		await methods.triggerValidation({ name })
	}
	const onSubmit = async data => {
		setAdhocFormStore({ ...adhocFormStore, isLoading: true })
		const foodrepo = "foodrepo"
		const collection = firebase.firestore().collection(foodrepo)
		const foodRepoDocId = initialFoodRepoState.id || collection.doc().id
		let batch = firebase.firestore().batch()
		const APIdata = {
			updatedAt: now,
			createdAt: initialFoodRepoState.createdAt || now,
			id: foodRepoDocId
		}
		if (initialFoodRepoState.placeLatLng) {
			const geoPoint = new firebase.firestore.GeoPoint(
				initialFoodRepoState.placeLatLng.lat,
				initialFoodRepoState.placeLatLng.lng
			)
			APIdata.placeLatLng = geoPoint
		}

		let Images

		if (adhocFormStore.mainImage) {
			const mainImage = await handleUploadImage(
				foodRepoDocId,
				adhocFormStore.mainImage
			)
			APIdata.mainImage = mainImage
			Images = [mainImage]

			await Promise.all(
				adhocFormStore.images.filter(image => image !== adhocFormStore.mainImage).map(
					async image => {
						const uploadImage = await handleUploadImage(foodRepoDocId, image)

						Images.push(uploadImage)
					}
				)
			)
		}
		initialFoodRepoState.image = Images?.reduce(
			(a, b) => ({
				...a,
				[b.name]: b
			}),
			{}
		) ?? null
		const formSubmit = FormFetchData(initialFoodRepoState, data, APIdata)

		await FirebaseRegister(formSubmit, foodrepo, foodRepoDocId)

		// Images &&
		//   Images.forEach(image => {
		//     image.createdAt = now;
		//     batchSetter(
		//       image,
		//       foodrepo,
		//       foodRepoDocId,
		//       "set",
		//       batch,
		//       "photo",
		//       image.name
		//     );
		//   });

		const searchField = {
			authorRef: auth?.storeUser?.ref ?? null,
			place: data.place ?? null,
			rating: data.rating ?? null,
			tag: data.tag ?? [],
			title: data.title,
			mainImageURL: APIdata?.mainImage?.url ?? null,
			createdAt: APIdata.createdAt,
			createdAtDate: new Date().toLocaleDateString(),
			textSlice: data.text.slice(0, 180),
			textHasMore: data.text.length > 180
		}
		batchSetter(searchField, "eventSearch", foodRepoDocId, "set", batch)
		console.log(searchField)
		await batch.commit()

		resetState(initialFoodRepoState, methods.getValues())
		console.log(formSubmit)
		toast.success(`『${formSubmit.title}』を更新しました`)
		setAdhocFormStore({
			...adhocFormStore,
			isLoading: false,
			mainImage: null,
			images: []
		})
	}

	useEffect(() => {
		methods.register(
			{ name: "title" },
			{
				required: "タイトルを入力してください",
				maxLength: { value: 30, message: "タイトルは30文字以内にしてください" },
				minLength: { value: 2, message: "タイトルは2文字以上にしてください" }
			}
		)
		methods.register(
			{ name: "tag" },
			{
				validate: {
					maxLength: value =>
						(value ? value && value.length < 5 : true) ||
						"登録できるタグは４つまでです"
				}
			}
		)
		methods.register(
			{ name: "place" },
			{
				maxLength: { value: 20, message: "20文字以内にしてください" }
			}
		)
		methods.register(
			{ name: "text" },
			{
				required: "本文を入力してください",
				maxLength: { value: 1800, message: "本文は1800文字以内にしてください" }
			}
		)
		methods.register({ name: "rating" })
		if (user) {
			setInitialFoodRepoState({
				...initialFoodRepoState,
				...{ authorRef: auth?.storeUser?.ref ?? null }
			})
		}
		setIsSubmitting(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, isSubmitting])
	return (
		<FoodReportContext.Provider
			value={{
				initialFoodRepoState,
				setInitialFoodRepoState,
				isSubmitting,
				setIsSubmitting,
				adhocFormStore,
				setAdhocFormStore
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
										setAdhocFormStore({ ...adhocFormStore, isRating: checked })

										methods.setValue(
											"rating",
											checked ? adhocFormStore.cacheRating : null
										)
									}}
								/>
							</label>
							{adhocFormStore.isRating && (
								<Rating
									name="rating"
									icon="heart"
									size="massive"
									value={methods.watch("rating") || 3}
									maxRating={5}
									defaultRating={adhocFormStore.cacheRating}
									onRate={(e, { rating }) => {
										onChange(e, { name: "rating", value: rating })
										setAdhocFormStore({
											...adhocFormStore,
											cacheRating: rating
										})
									}}
								/>
							)}
						</Form.Field>
					</Form.Group>

					<Label
						content={
							!adhocFormStore.isGoogleMapOpen
								? initialFoodRepoState.placeLatLng
									? "位置情報を表示する"
									: "現在地を所得する"
								: "位置情報を非表示にする"
						}
						onClick={() => {
							setAdhocFormStore({
								...adhocFormStore,
								isGoogleMapOpen: !adhocFormStore.isGoogleMapOpen
							})
						}}
						as="a"
					/>
					{adhocFormStore.isGoogleMapOpen && adhocFormStore.herePlaceLatLng && (
						<Label
							content="位置情報を現在地に設定する"
							onClick={() => {
								setInitialFoodRepoState({
									...initialFoodRepoState,
									...{ placeLatLng: adhocFormStore.herePlaceLatLng }
								})
							}}
							as="a"
						/>
					)}
					{initialFoodRepoState.placeLatLng && (
						<Button
							content="位置情報を削除する"
							basic
							compact
							size="small"
							negative
							onClick={() => {
								setInitialFoodRepoState({
									...initialFoodRepoState,
									...{ placeLatLng: null }
								})
								setAdhocFormStore({
									...adhocFormStore,
									isGoogleMapOpen: false
								})
							}}
						/>
					)}
					{/* <PlacesAutocompleteForm /> */}
					{adhocFormStore.isGoogleMapOpen && <GoogleMapSearchForm />}

					<Form.Field>
						<label>ジャンル</label>
						{methods.errors.tag && (
							<label>{methods.errors?.tag?.message}</label>
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
						{methods.errors.text && <span>{methods.errors.text.message}</span>}
						<Form.TextArea
							placeholder={"本文"}
							name="text"
							value={methods.watch("text") || ""}
							onChange={onChange}
							error={methods.errors.text ? true : false}
						/>
					</Form.Field>

					<Button
						type="submit"
						disabled={FormIsError(methods.errors) || adhocFormStore.isLoading}
						loading={adhocFormStore.isLoading}
					>
						Push
                    </Button>
					<Button
						negative
						type="reset"
						onClick={() => {
							resetState(initialFoodRepoState, methods.getValues())
							methods.clearError()
						}}
					>
						Reset
                    </Button>
					{/* <Button onClick={() => httpsRequest(methods.watch("text"))} /> */}
				</Form>
			</FormContext>
		</FoodReportContext.Provider >
	)
}

export default FoodReportForm
