import React, { useState, useEffect, useContext } from "react"
import _ from "lodash"
import GoogleMapReact from "google-map-react"
import { googleMapAPIkey } from "../../config/googleMapAPI"
import { Icon, Segment } from "semantic-ui-react"
import { FoodReportContext } from "./FoodReportForm"

const Marker = () => <Icon name="marker" size="big" color="red" />
const GoogleMapSearchForm = () => {
	const FoodReportFormValue = useContext(FoodReportContext)
	const [marker, setMarker] = useState({
		center: [null, null],
		zoom: 15,
		draggable: true
	})

	const onCircleInteraction = (childKey, childProps, mouse) => {
		setMarker({
			...marker,
			...{
				draggable: false,
				lat: mouse.lat,
				lng: mouse.lng
			}
		})
	}
	const where = FoodReportFormValue.initialFoodRepoState.placeLatLng
	const here = FoodReportFormValue.adhocFormStore.herePlaceLatLng
	const setWhere = marker => {
		FoodReportFormValue.setInitialFoodRepoState({
			...FoodReportFormValue.initialFoodRepoState,
			...{
				placeLatLng: { lat: marker.lat, lng: marker.lng }
			}
		})
	}
	const setHere = marker => {
		FoodReportFormValue.setAdhocFormStore({
			...FoodReportFormValue.adhocFormStore,
			...{
				herePlaceLatLng: { lat: marker.lat, lng: marker.lng }
			}
		})
	}
	useEffect(() => {
		if (!_.isNil(_.get(where, `lat`))) {
			setMarker({
				...marker,
				...{
					center: where,
					lat: where.lat,
					lng: where.lng
				}
			})
		} else if (!_.isNil(_.get(here, `lat`))) {
			setMarker({
				...marker,
				...{
					center: here,
					lat: here.lat,
					lng: here.lng
				}
			})
			setHere(marker)
			setWhere(marker)
			console.log("hereState")
		} else {
			try {
				navigator.geolocation.getCurrentPosition(position => {
					setMarker({
						...marker,
						...{
							center: [position.coords.latitude, position.coords.longitude],
							lat: position.coords.latitude,
							lng: position.coords.longitude,
							draggable: false
						}
					})
					setHere(marker)
					setWhere(marker)
					setMarker({ ...marker, ...{ draggable: true } })
				})
			} catch (error) {
				console.log(error)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [where])

	return (
		<Segment
			attached="bottom"
			style={{ padding: 0, height: "50vh", width: "100%" }}
		>
			<GoogleMapReact
				bootstrapURLKeys={{ key: googleMapAPIkey }}
				center={marker.center}
				zoom={marker.zoom}
				onChange={({ center, zoom }) => {
					setMarker({ ...marker, ...{ center: center, zoom: zoom } })
				}}
				onChildMouseDown={(childKey, childProps, mouse) =>
					onCircleInteraction(childKey, childProps, mouse)
				}
				onChildMouseUp={() => {
					setMarker({ ...marker, ...{ draggable: true } })
					setWhere(marker)
				}}
				onChildMouseMove={(childKey, childProps, mouse) =>
					onCircleInteraction(childKey, childProps, mouse)
				}
				draggable={marker.draggable}
			>
				<Marker lat={marker.lat} lng={marker.lng} />
			</GoogleMapReact>
		</Segment>
	)
}

export default GoogleMapSearchForm
