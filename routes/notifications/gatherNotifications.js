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

		const { username } = req.body;

		const collection = db.collection("users");

		console.log("req.body", req.body);

		collection.findOne({ username }).then((user) => {
			if (user) {
				console.log("Logged in user... :", user);
				res.json({
					message: "You have notifications!",
					notifications: user.notifications
				})
			} else {
				res.json({
					message: "Could not locate user..."
				})
			}
		}).catch((err) => {
			console.log(err);
		})
	});
});

module.exports = router;