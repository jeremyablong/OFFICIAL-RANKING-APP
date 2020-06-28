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

			const { username, id } = req.body;

			const collection = db.collection("users");

			// console.log("req.body", req.body);

			let replies = [];

			collection.findOne({ "profilePic.id": id }).then((user) => {
				if (user) {
					console.log("user found... :", user);
					
					const last = user.profilePic[user.profilePic.length - 1].replies;

					res.json({
						message: "Here is your users profile picture comments...",
						user,
						replies: last.reverse()
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