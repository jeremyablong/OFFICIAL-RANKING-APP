import { GEO_LOCATION } from "../../actions/types.js";


export default (state = {}, action) => {
	switch (action.type) {
		case GEO_LOCATION: 
			return {
				...state,
				location: action.payload
			}
		default: 
			return state;
	}
}
