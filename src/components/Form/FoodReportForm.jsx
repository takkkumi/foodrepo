import React, { useState, useEffect, useContext } from "react"
import { Form, Button, Dropdown } from "semantic-ui-react"
import useForm from "react-hook-form"
import { UserContext } from "../../App"
import {
	FormResetState,
	FormFetchData,
	FormIsError
} from "../../Actions/FormAction"
import { toast } from "react-toastify"

const FoodReportForm = () => {
	const auth = useContext(UserContext)
	const user = auth.storeUser
	const [options] = useState([
		{ key: 1, text: "カレー", value: "curry" },
		{ key: 2, text: "中華料理", value: "chinese" },
		{ key: 3, text: "洋風料理", value: "europian" },
		{ key: 4, text: "和食", value: "japanese" },
		{ key: 5, text: "ラーメン", value: "ramen" },
		{ key: 6, text: "居酒屋", value: "tevern" }
	])
	const {
		register,
		setValue,
		handleSubmit,
		errors,
		triggerValidation,
		getValues,
		clearError,
		watch
	} = useForm()

	const [isSubmitting, setIsSubmitting] = useState(false)
	const resetState = data => {
		FormResetState(initialFoodRepoState, data, setValue)
		setIsSubmitting(true)
	}
	const [initialFoodRepoState, setInitialFoodRepoState] = useState({
		author: "",
		title: "",
		place: "",
		placeLatLng: "",
		tag: [],
		FoodrepoImageURL: "",
		description: "",
		createdAt: null,
		updatedAt: null
	})
	const onChange = async (e, { name, value }) => {
		e.preventDefault()

		setValue(name, value)
		await triggerValidation({ name })
	}
	const onSubmit = data => {
		const formSubmit = FormFetchData(initialFoodRepoState, data)

		console.log(initialFoodRepoState, data, formSubmit)
		resetState(data)
		toast.success(`『${formSubmit.title}』を更新しました`)
	}

	useEffect(() => {
		register(
			{ name: "title" },
			{
				required: "タイトルを入力してください",
				maxLength: { value: 30, message: "タイトルは30文字以内にしてください" },
				minLength: { value: 2, message: "タイトルは2文字以上にしてください" }
			}
		)
		register(
			{ name: "tag" },
			{
				validate: {
					maxLength: value =>
						(value ? value && value.length < 5 : true) ||
						"登録できるタグは４つまでです"
				}
			}
		)
		register(
			{ name: "place" },
			{
				maxLength: { value: 20, message: "20文字以内にしてください" }
			}
		)
		register(
			{ name: "description" },
			{
				required: "本文を入力してください",
				maxLength: { value: 2000, message: "本文は2000文字以内にしてください" }
			}
		)
		if (user) {
			setInitialFoodRepoState({
				...initialFoodRepoState,
				...{ author: user.userUid }
			})
		}
		setIsSubmitting(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, isSubmitting, auth.isLogin])
	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Form.Field>
				<label>タイトル</label>
				{errors.title && <span>{errors.title.message}</span>}
				<Form.Input
					placeholder={"タイトル"}
					name="title"
					value={watch("title") || ""}
					onChange={onChange}
					error={errors.title ? true : false}
				/>
			</Form.Field>
			<Form.Field>
				<label>場所</label>
				{errors.place && <span>{errors.place.message}</span>}
				<Form.Input
					placeholder={"どこで？"}
					name="place"
					value={watch("place") || ""}
					onChange={onChange}
					error={errors.place ? true : false}
				/>
			</Form.Field>

			<Form.Field>
				<label>ジャンル</label>
				{errors.tag && <label>{errors.tag && errors.tag.message}</label>}
				<Dropdown
					name="tag"
					selection
					multiple
					placeholder="tag"
					options={options}
					compact
					value={watch("tag") || []}
					onChange={onChange}
					error={errors.tag ? true : false}
				/>
			</Form.Field>
			<Form.Field>
				<label>本文</label>
				{errors.description && <span>{errors.description.message}</span>}
				<Form.TextArea
					placeholder={"本文"}
					name="description"
					value={watch("description") || ""}
					onChange={onChange}
					error={errors.place ? true : false}
				/>
			</Form.Field>
			<Button type="submit" disabled={FormIsError(errors)}>
				Push
			</Button>
			<Button
				negative
				type="reset"
				onClick={() => {
					resetState(initialFoodRepoState, getValues())
					clearError()
				}}
			>
				Reset
			</Button>
		</Form>
	)
}

export default FoodReportForm
