import { combineReducers } from "redux";
import auth from "./auth/auth.js";
import intro from "./intro/index.js";
import location from "./location/getLocation.js";
import mode from "./dark_mode/mode.js";

export default combineReducers({
	auth,
	intro,
	location,
	mode
});