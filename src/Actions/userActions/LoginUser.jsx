import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

const LoginUser = async () => {
	const provider = new firebase.auth.GoogleAuthProvider()
	let Login = await firebase.auth().signInWithPopup(provider)
	const isNewUser = Login.additionalUserInfo.isNewUser
	const user = Login.user

	const db = firebase.firestore()
	const now = firebase.firestore.FieldValue.serverTimestamp()
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
					lastLogin: now
				})
		} else {
			db.collection("user")
				.doc(String(user.uid))
				.update({
					lastLogin: now
				})
		}
	} catch (error) {
		console.log(error)
	}
}

export default LoginUser
