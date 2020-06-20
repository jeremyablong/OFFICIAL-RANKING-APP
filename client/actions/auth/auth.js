import { AUTH } from "../types.js";

export const registerIntroSeen = (item) => {
	return {
		type: "AUTH",
		payload: item
	}
}
