import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

const db = firebase.firestore()
const now = firebase.firestore.FieldValue.serverTimestamp()

export const LoginUser = async () => {
	const provider = new firebase.auth.GoogleAuthProvider()
	let Login = await firebase.auth().signInWithPopup(provider)
	const isNewUser = Login.additionalUserInfo.isNewUser
	const user = Login.user


	try {
		if (isNewUser) {
			await db
				.collection("user")
				.doc(String(user.uid))
				.set({
					userUid: user.uid,
					name: user.displayName,
					email: user.email,
					userPhoto: user.photoURL,
					createdAt: now,
					lastLogin: now,
					isLogin: true
				})
		} else {
			db.collection("user")
				.doc(String(user.uid))
				.update({
					lastLogin: now,
					isLogin: true
				})
		}
	} catch (error) {
		console.log(error)
	}
}
export const LogoutUser = async (user) => {
	try {
		db.collection("user")
			.doc(String(user.userUid))
			.update({
				lastLogin: now,
				isLogin: false
			})
		firebase.auth().signOut();
	} catch (error) {
		console.log(error)
	}
}