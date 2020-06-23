const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");

mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
	router.post("/", (req, res) => {

			const { username } = req.body;

			const collection = db.collection("users");

			console.log("req.body", req.body);

			collection.findOne({ username }).then((user) => {
				console.log(user);
				if (user) {
					res.json({
						message: "FOUND user!",
						user
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