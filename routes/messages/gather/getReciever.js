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

			const { id } = req.body;

			const collection = db.collection("users");

			console.log("req.body", req.body);

			collection.findOne({ "messages.id": id }).then((user) => {
				console.log("TODAYYYY :", user.messages[0]);

				if (user) {
					res.json({
						message: "FOUND user!",
						reciever: user.messages[0].reciever,
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