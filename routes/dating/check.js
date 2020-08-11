const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");

mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
	router.post("/", (req, res) => {

		const collection = db.collection("users");

		const { username, preference, pronoun, age } = req.body;

		collection.findOne({ username }).then((user) => {
			console.log("UUUUUUU :", user);
			if (user.dating) {
				res.json({
					message: "User HAS already registered...",
					registered: true
				})
			} else {
				res.json({
					message: "Could NOT verify that user has signed up to date yet...",
					registered: false
				})
			}
		}).catch((err) => {
			console.log(err);
		})
	});
});

module.exports = router;