import _ from 'lodash'
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
export const FormResetState = (initialState, formData, setValue) => {
    if (formData) {
        return Object.keys(formData).forEach(key => setValue(key, initialState[key]))

    }
}

export const FormFetchData = (initialState, formData, APIdata) => {
    _.forEach(formData, (value, key) => {
        if (_.isNil(value)) {
            delete formData[key]
        }
    });
    const reFormattedData = {
        ...initialState,
        ...formData,
        ...APIdata,
    }
    return reFormattedData
}


export const FormIsError = errors => {
    return Object.keys(errors).length > 0
}

export const FirebaseRegister = async (collection, fetchedData, id, isNew) => {


    const db = firebase.firestore()

    try {
        if (isNew) {
            id ? await db
                .collection(collection)
                .doc(id).set({
                    ...fetchedData,
                    id: id
                }) :
                await db
                .collection(collection)
                .add(fetchedData).then(doc => {
                    db.collection(collection).doc(doc.id).update({
                        id: doc.id
                    })
                })
        } else {

        }
    } catch (error) {
        console.log(error)
    }
}