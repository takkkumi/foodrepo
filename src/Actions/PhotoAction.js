import cuid from "cuid"
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"

export const uploadProfileImage = async (file, path) => {
	const imageName = cuid()

	try {
		const uploadref = firebase.storage().ref(`${path}/${imageName}`)
		const uploadFile = await uploadref.put(file)
		console.log(uploadFile)
		return
	} catch (error) {
		console.log(error)
	}
}
