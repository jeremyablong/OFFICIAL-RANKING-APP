const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");

mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
	router.post("/", (req, res) => {
		// deconstruct response body

		const { username, notificationID } = req.body;

		const collection = db.collection("users");

		console.log("req.body", req.body);

		let removed = null;

		collection.findOne({ username }).then((user) => {
			console.log("user removeNotification.js :", user);
			for (let i = 0; i < user.notifications.length; i++) {

				let notification = user.notifications[i];

				if (notification.id === notificationID) {
					console.log("MATCH.");
					user.notifications.splice(i, 1);

					removed = notification;
				}
			}
			collection.save(user);
			console.log("AFTER :", user);
			res.json({
				message: "Successfully removed notification!",
				removed
			})
		}).catch((err) => {
			console.log("ERR :", err);
		})
	});
});

module.exports = router;