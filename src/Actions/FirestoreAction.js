import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export const FirebaseRegister = async (
	data,
	collectionName,
	docId,
	SubcollectionName,
	subcollectionDocId
) => {
	const db = firebase.firestore();

	try {
		SubcollectionName
			? await db
					.collection(collectionName)
					.doc(docId.length && docId)
					.collection(SubcollectionName)
					.doc(subcollectionDocId.length && subcollectionDocId)
					.set({
						...data,
						id: subcollectionDocId
					})
			: await db
					.collection(collectionName)
					.doc(docId.length && docId)
					.set(data);
	} catch (error) {
		console.log(error);
	}
};
export const batchSetter = (
	data,
	collectionName,
	docId,
	query,
	batch,
	SubcollectionName,
	subcollectionDocId
) => {
	const db = firebase.firestore();
	try {
		switch (query) {
			case "set":
				SubcollectionName
					? batch.set(
							db
								.collection(collectionName)
								.doc(docId.length && docId)
								.collection(SubcollectionName)
								.doc(subcollectionDocId.length && subcollectionDocId),
							data
					  )
					: batch.set(
							db.collection(docId.length && collectionName).doc(docId),
							data
					  );
				break;

			default:
				break;
		}
	} catch (error) {
		console.log(error);
	}
};
