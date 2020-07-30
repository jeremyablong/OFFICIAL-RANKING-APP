const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");

mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
	router.post("/", (req, res) => {

			const { id } = req.body;

			const collection = db.collection("users");

			console.log("req.body", req.body);

			const finalMessage = [];

			collection.findOne({ "messages.id": id }).then((user) => {
				console.log(user);
				if (user) {
					for (var i = 0; i < user.messages.length; i++) {
						let element = user.messages[i];
						if (element.replies) {
							for (var i = 0; i < element.replies.length; i++) {
								const message = element.replies[i];
								console.log("message :", message);
								if (message.id === id) {
									finalMessage.push(message);
								}
							}
							return;
						}
					}
					res.json({
						message: "Sorted array of messages, success!",
						messages: finalMessage
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