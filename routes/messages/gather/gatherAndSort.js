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

			let messageArray = [];

			const collection = db.collection("users");

			console.log("req.body", req.body);

			collection.findOne({ username }).then((user) => {
				console.log("USAAAAA :", user.messages.reverse());
					
				 const reversed = user.messages.sort((left, right) => {
				    return moment.utc(left.date).diff(moment.utc(right.date));
				});

				 console.log("REV :", reversed);

				if (user) {
					res.json({
						message: "FOUND user!",
						messages: reversed,
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