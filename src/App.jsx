import React from "react"
import { Grid, Divider } from "semantic-ui-react"
import Header from "./components/Header/Header"
import HomePage from "./components/Home/HomePage"
import SideBar from "./components/SideBar/SideBar"

function App() {
	return (
		<Grid>
			<Grid.Row>
				<Header />
			</Grid.Row>

			<Divider />
			<Grid.Row>
				<Grid.Column width={3}>
					<SideBar />
				</Grid.Column>
				<Grid.Column width={13}>
					<HomePage />
				</Grid.Column>
			</Grid.Row>
		</Grid>
	)
}

export default App
