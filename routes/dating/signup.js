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
			if (!user.dating) {
				user["dating"] = {
					preference,
					pronoun,
					age
				}
			} else {
				user.dating = {
					preference,
					pronoun,
					age
				}
			}

			collection.save(user);

			res.json({
				message: "Successfully signed up for dating!",
				completed: true
			})
		}).catch((err) => {
			console.log(err);
		})
	});
});

module.exports = router;