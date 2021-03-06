const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	fullName: {
		type: String
	},
	phoneNumber: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String
	},
	birthdate: {
		type: String
	},
	location: {
		type: String
	},
	username: {
		type: String
	},
	hometown: {
		type: String
	},
	id: {
		type: String
	},
	profilePic: {
		type: Array
	},
	profilePicReactions: {
		type: Object
	},
	base64MUGSHOT: {
		type: String
	}
});

module.exports = User = mongoose.model("user", UserSchema);