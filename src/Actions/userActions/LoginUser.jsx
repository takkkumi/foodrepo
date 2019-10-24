import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

const LoginUser = async () => {
	const provider = new firebase.auth.GoogleAuthProvider()
	let Login = await firebase.auth().signInWithPopup(provider)
	const isNewUser = Login.additionalUserInfo.isNewUser
	const user = Login.user
	console.log(user)
	const db = firebase.firestore()

	await db
		.collection("user")
		.doc(String(user.uid))
		.set(
			{
				userUid: user.uid,
				name: user.displayName,
				email: user.email,
				userPhoto: user.photoURL
			},
			{ merge: true }
		)
	if (isNewUser) {
		db.collection("user")
			.doc(String(user.uid))
			.update({
				createdAt: firebase.firestore.FieldValue.serverTimestamp(),
				lastLogin: firebase.firestore.FieldValue.serverTimestamp()
			})
	} else {
		db.collection("user")
			.doc(String(user.uid))
			.update({
				lastLogin: firebase.firestore.FieldValue.serverTimestamp()
			})
	}
}

export default LoginUser
