import { INTRO_SCREEN } from "../types.js";

export const registerIntroSeen = (item) => {
	return {
		type: "INTRO_SCREEN",
		payload: item
	}
}
