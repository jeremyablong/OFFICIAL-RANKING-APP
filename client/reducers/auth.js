import { AUTH } from "../actions/types.js";


export default (state = {}, action) => {
	switch (action.type) {
		case AUTH: 
			return {
				...state,
				authenticated: action.payload
			}
		default: 
			return state;
	}
}
