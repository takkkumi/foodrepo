import React, { useContext } from "react"
import { Header, Image, Menu, Container, Dropdown } from "semantic-ui-react"
import { UserContext } from "../../App"
import firebase from "firebase/app"
import "firebase/auth"

const Navbar = () => {
	const auth = useContext(UserContext)
	const user = auth.user
	const googleLogin = () => {
		const provider = new firebase.auth.GoogleAuthProvider()
		firebase.auth().signInWithPopup(provider)
	}
	const SignOut = () => {
		firebase.auth().signOut()
	}
	return (
		<Container>
			<Header as="h2" color="orange">
				{user ? (
					<>
						Hello {user.displayName}{" "}
						<Image size="mini" src={user.photoURL} verticalAlign="top" />
					</>
				) : (
					"Hello"
				)}

				<Menu fluid tabular>
					<Menu.Menu position="right">
						<Menu.Item>ok</Menu.Item>
					</Menu.Menu>

					<Menu.Menu position="right">
						<Dropdown text="Setting" item simple>
							<Dropdown.Menu>
								{!auth.isLogin ? (
									<Dropdown.Item onClick={() => googleLogin()}>
										LogIn
									</Dropdown.Item>
								) : (
									<Dropdown.Item onClick={() => SignOut()}>
										LogOut
									</Dropdown.Item>
								)}
							</Dropdown.Menu>
						</Dropdown>
					</Menu.Menu>
				</Menu>
			</Header>
		</Container>
	)
}

export default Navbar
