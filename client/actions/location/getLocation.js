import { GEO_LOCATION } from "../types.js";

export const latLngLocation = (item) => {
	return {
		type: "GEO_LOCATION",
		payload: item
	}
}
