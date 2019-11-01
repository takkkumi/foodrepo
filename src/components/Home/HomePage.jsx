import React, { useContext } from "react"
import { Container, Label } from "semantic-ui-react"
import FoodReportForm from "../Form/FoodReportForm"
import { UserContext } from "../../App"

const HomePage = () => {
	const auth = useContext(UserContext)
	return (
		<Container>
			{auth.isLogin ? <FoodReportForm /> : <Label>Hello</Label>}
		</Container>
	)
}

export default HomePage
