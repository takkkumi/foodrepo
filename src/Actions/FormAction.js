import _ from "lodash";

export const FormResetState = (initialState, formData, setValue) => {
	if (formData) {
		return Object.keys(formData).forEach(key =>
			setValue(key, initialState[key])
		);
	}
};

export const FormFetchData = (initialState, formData, APIdata) => {
	const mergeData = {
		...initialState,
		...formData,
		...APIdata
	};
	const reFormattedData = _.forEach(mergeData, (value, key) => {
		if (!value) {
			delete mergeData[key];
		}
	});
	return reFormattedData;
};

export const FormIsError = errors => {
	return Object.keys(errors).length > 0;
};
