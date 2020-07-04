import { GEO_LOCATION, LOCATION_BACKGROUND } from "../types.js";

export const latLngLocation = (item) => {
	return {
		type: "GEO_LOCATION",
		payload: item
	}
}
export const locationBackground = (location) => {
	return {
		type: "LOCATION_BACKGROUND",
		payload: location
	}
}