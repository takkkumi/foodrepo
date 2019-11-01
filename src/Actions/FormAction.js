export const FormResetState = (initialState, formData, setValue) => {
    if (formData) {
        return Object.keys(formData).forEach(key => setValue(key, initialState[key]))

    }
}

export const FormFetchData = (initialState, formData, APIdata) => {
    Object.keys(formData).forEach(key => {
        if (typeof formData[key] === "undefined" || formData[key] === null) {
            delete formData[key]
        }
    });
    const formSubmit = {
        ...initialState,
        ...APIdata,
        ...formData
    }
    return formSubmit
}


export const FormIsError = errors => {
    return Object.keys(errors).length > 0
}