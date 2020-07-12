import { MODE } from "../../actions/types.js";


export default (state = {}, action) => {
	switch (action.type) {
		case MODE: 
			return {
				...state,
				dark_mode: action.payload
			}
		default: 
			return state;
	}
}
