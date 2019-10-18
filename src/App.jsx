import React, { useState, useEffect, createContext } from "react"
import { Grid, Container } from "semantic-ui-react"

import HomePage from "./components/Home/HomePage"
import SideBar from "./components/SideBar/SideBar"

import firebase from "./config/firebase-config"
import Navbar from "./components/Header/Navbar"
export const UserContext = createContext()
const App = () => {
	const [user, setUser] = useState(null)
	const [isLogin, setIsLogin] = useState(false)
	useEffect(() => {
		firebase.auth().onAuthStateChanged(currentUser => {
			if (currentUser) {
				setUser(currentUser)
				setIsLogin(true)
			} else {
				setUser(null)
				setIsLogin(false)
			}
		})
	}, [isLogin, user])

	return (
		<UserContext.Provider value={{ user, isLogin }}>
			<Container>
				<Grid>
					<Grid.Row>
						<Navbar />
					</Grid.Row>

					<Grid.Row>
						<Grid.Column width={3}>
							<SideBar />
						</Grid.Column>
						<Grid.Column width={13}>
							<HomePage />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
		</UserContext.Provider>
	)
}

export default App
