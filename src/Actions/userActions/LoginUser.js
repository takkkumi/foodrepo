import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

<<<<<<< HEAD
const db = firebase.firestore()
const now = firebase.firestore.FieldValue.serverTimestamp()

export const LoginUser = async () => {
	const provider = new firebase.auth.GoogleAuthProvider()
	let Login = await firebase.auth().signInWithPopup(provider)
	const isNewUser = Login.additionalUserInfo.isNewUser
	const user = Login.user


=======
const LoginUser = async () => {
	const provider = new firebase.auth.GoogleAuthProvider();
	let Login = await firebase.auth().signInWithPopup(provider);
	const isNewUser = Login.additionalUserInfo.isNewUser;
	const user = Login.user;

	const db = firebase.firestore();
	const now = firebase.firestore.FieldValue.serverTimestamp();
>>>>>>> master
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
<<<<<<< HEAD
					lastLogin: now,
					isLogin: true
				})
=======
					lastLogin: now
				});
>>>>>>> master
		} else {
			db.collection("user")
				.doc(String(user.uid))
				.update({
<<<<<<< HEAD
					lastLogin: now,
					isLogin: true
				})
=======
					lastLogin: now
				});
>>>>>>> master
		}
	} catch (error) {
		console.log(error);
	}
<<<<<<< HEAD
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
=======
};

export default LoginUser;
>>>>>>> master
