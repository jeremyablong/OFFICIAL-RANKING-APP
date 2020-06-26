const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");
const moment = require("moment");

mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
	router.post("/", (req, res) => {

			const { username } = req.body;

			const collection = db.collection("users");

			console.log("req.body", req.body);

			let replies = [];

			collection.findOne({ username }, { profilePictureReplies: true }).then((user) => {
				if (user) {
					console.log("user found... :", user);
					if (user.profilePictureReplies) {
						for (var i = 0; i < user.profilePictureReplies.length; i++) {
							replies.push(user.profilePictureReplies[i]);
						}
					}

					res.json({
						message: "Here is your users profile picture comments...",
						user,
						replies: replies.reverse()
					})
				} else {
					res.json({
						message: "User could NOT be found..."
					})
				}
			}).catch((err) => {
				console.log("ERRRRRRR :", err);
			})
	});
});

module.exports = router;