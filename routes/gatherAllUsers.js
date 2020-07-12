const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");

mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
	router.get("/", (req, res) => {

		const collection = db.collection("users");

		collection.find({}).toArray((err, users) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Error occurred...",
					err
				})
			}
			res.send(users);
		})
	});
});

module.exports = router;