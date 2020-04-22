

export const FormResetState = (initialState, formData, setValue) => {
	if (formData) {
		return Object.keys(formData).forEach(key =>
			setValue(key, initialState[key])
		)
	}
}

export const FormFetchData = (initialState, formData, APIdata) => {
	const mergeData = {
		...initialState,
		...formData,
		...APIdata
	}
	const reFormattedData = {}
	for (let key in mergeData) {
		if (mergeData[key]) {
			reFormattedData[key] = mergeData[key]
		}
	}
	return reFormattedData
}

export const FormIsError = errors => {
	return Object.keys(errors).length > 0
}
