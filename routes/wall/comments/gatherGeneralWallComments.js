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

		const { username, id } = req.body;

		collection.findOne({ username }).then((user) => {
			console.log("USA :", user);
			for (var i = 0; i < user.wall.length; i++) {
				let element = user.wall[i];
				if (element.id === id) {
					console.log("ELEMENT :", element);

					const reversed = element.replies.reverse();
					
					res.json({
						message: "Gathered comments!",
						replies: reversed
					});
				}
			}
		}).catch((err) => {
			console.log(err);
		})
	});
});

module.exports = router;