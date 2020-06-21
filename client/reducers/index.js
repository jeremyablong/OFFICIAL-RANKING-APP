import { combineReducers } from "redux";
import auth from "./auth/auth.js";
import intro from "./intro/index.js";
import location from "./location/getLocation.js";

export default combineReducers({
	auth,
	intro,
	location
});