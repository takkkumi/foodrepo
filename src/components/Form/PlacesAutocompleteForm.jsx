// import React, { useState } from "react"
// import { Search } from "semantic-ui-react"
// import _ from "lodash"
// import { googleMapAPIkey } from "../../config/googleMapAPI"
// /* global google */
// const PlacesAutocompleteForm = ({ latlng }) => {
// 	const initialState = {
// 		isLoading: false,
// 		results: [],
// 		value: "",
// 		radialCenter: latlng ? latlng : null
// 	}
// 	const [place, setPlace] = useState(initialState)
// 	const handleResultSelect = (e, { result }) => {
// 		setPlace({ ...place, ...{ value: result.title } })
// 	}
// 	const options = {
// 		types: ["(cities)"]
// 	}
// 	// eslint-disable-next-line no-undef

// 	const autocomplete = new google.maps.places.Autocomplete(
// 		document.getElementById("autocomplete"),
// 		options
// 	)
// 	const handleScriptLoad = () => {
// 		autocomplete.setFields(["address_components", "formatted_address"])
// 		autocomplete.addListener("place_changed", this.handlePlaceSelect)
// 	}
// 	const handlePlaceSelect = () => {
// 		// Extract City From Address Object
// 		const addressObject = autocomplete.getPlace()
// 		const address = addressObject.address_components

// 		// Check if address is valid
// 		if (address) {
// 			// Set State
// 			setPlace({
// 				...place,
// 				...{
// 					results: address[0].long_name,
// 					query: addressObject.formatted_address
// 				}
// 			})
// 		}
// 	}

// 	//     setTimeout(() => {
// 	//  	if (place.value.length < 1) return setPlace(initialState)

// 	//  	const re = new RegExp(_.escapeRegExp(place.value), 'i')
// 	//  	const isMatch = (result) => re.test(result.title)

// 	//  	setPlace(...place,...{
// 	//  	  isLoading: false,
// 	//  	  results: _.filter(source, isMatch),
// 	//  	})
// 	//    }, 300)

// 	return (
// 		<div>
// 			<Search
// 				loading={place.isLoading}
// 				onResultSelect={handlePlaceSelect}
// 				results={place.results}
// 				value={place.value}
// 			></Search>
// 		</div>
// 	)
// }

// export default PlacesAutocompleteForm
