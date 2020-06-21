import { INTRO_SCREEN } from "../../actions/types.js";


export default (state = {}, action) => {
	switch (action.type) {
		case INTRO_SCREEN: 
			return {
				...state,
				intro: action.payload
			}
		default: 
			return state;
	}
}
