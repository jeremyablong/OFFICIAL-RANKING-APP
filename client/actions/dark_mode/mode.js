import { MODE } from "../types.js";

export const enableDarkMode = (statement) => {
	return {
		type: "MODE",
		payload: statement
	}
}
