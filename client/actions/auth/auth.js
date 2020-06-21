import { AUTH } from "../types.js";

export const authenticated = (item) => {
	return {
		type: "AUTH",
		payload: item
	}
}
