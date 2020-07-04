import { GEO_LOCATION, LOCATION_BACKGROUND } from "../../actions/types.js";


export default (state = {}, action) => {
	switch (action.type) {
		case GEO_LOCATION: 
			return {
				...state,
				location: action.payload
			}
		case LOCATION_BACKGROUND:
			return {
				...state,
				background: action.payload
			}
		default: 
			return state;
	}
}
