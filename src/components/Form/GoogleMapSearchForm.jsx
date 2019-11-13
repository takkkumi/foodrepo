import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import GoogleMapReact from "google-map-react";
import { googleMapAPIkey } from "../../config/googleMapAPI";
import { Icon, Segment } from "semantic-ui-react";
import { FoodReportContext } from "./FoodReportForm";

const Marker = () => <Icon name="marker" size="big" color="red" />;
const GoogleMapSearchForm = () => {
  const FoodReportFormValue = useContext(FoodReportContext);
  const [marker, setMarker] = useState({
    center: [null, null],
    zoom: 15,
    draggable: true
  });

  const onCircleInteraction = (childKey, childProps, mouse) => {
    setMarker({
      ...marker,
      ...{
        draggable: false,
        lat: mouse.lat,
        lng: mouse.lng
      }
    });
  };
  const initialFoodRepoState = FoodReportFormValue.initialFoodRepoState;

  useEffect(() => {
    if (_.get(FoodReportFormValue, `initialFoodRepoState.placeLatLng.lat`)) {
      setMarker({
        ...marker,
        ...{
          center: initialFoodRepoState.placeLatLng,
          lat: initialFoodRepoState.placeLatLng.lat,
          lng: initialFoodRepoState.placeLatLng.lng
        }
      });
    } else if (
      _.get(FoodReportFormValue, `initialFoodRepoState.herePlaceLatLng.lat`)
    ) {
      setMarker({
        ...marker,
        ...{
          center: initialFoodRepoState.herePlaceLatLng,
          lat: initialFoodRepoState.herePlaceLatLng.lat,
          lng: initialFoodRepoState.herePlaceLatLng.lng
        }
      });
      FoodReportFormValue.setInitialFoodRepoState({
        ...initialFoodRepoState,
        ...{
          placeLatLng: { lat: marker.lat, lng: marker.lng },
          herePlaceLatLng: { lat: marker.lat, lng: marker.lng }
        }
      });
      console.log("hereState");
    } else {
      navigator.geolocation.getCurrentPosition(position => {
        setMarker({
          ...marker,
          ...{
            center: [position.coords.latitude, position.coords.longitude],
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            draggable: false
          }
        });
        FoodReportFormValue.setInitialFoodRepoState({
          ...initialFoodRepoState,
          ...{
            placeLatLng: { lat: marker.lat, lng: marker.lng },
            herePlaceLatLng: { lat: marker.lat, lng: marker.lng }
          }
        });
        setMarker({ ...marker, ...{ draggable: true } });
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFoodRepoState]);

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
          setMarker({ ...marker, ...{ center: center, zoom: zoom } });
        }}
        onChildMouseDown={(childKey, childProps, mouse) =>
          onCircleInteraction(childKey, childProps, mouse)
        }
        onChildMouseUp={() => {
          setMarker({ ...marker, ...{ draggable: true } });
          FoodReportFormValue.setInitialFoodRepoState({
            ...initialFoodRepoState,
            ...{ placeLatLng: { lat: marker.lat, lng: marker.lng } }
          });
          FoodReportFormValue.setIsSubmitting(true);
        }}
        onChildMouseMove={(childKey, childProps, mouse) =>
          onCircleInteraction(childKey, childProps, mouse)
        }
        draggable={marker.draggable}
      >
        <Marker lat={marker.lat} lng={marker.lng} />
      </GoogleMapReact>
    </Segment>
  );
};

export default GoogleMapSearchForm;
