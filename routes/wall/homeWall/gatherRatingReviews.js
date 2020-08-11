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

		const { username } = req.body;

		let compliments = [];
		let total = 0;
		let count = 0;
		let credit = 86.3636364;

		collection.findOne({ username }).then((user) => {
			if (user) {
				console.log("USERRRRRRRRR ------------- :", user);
				if (user.wall) {
					for (var i = 0; i < user.wall.length; i++) {
						let rankings = user.wall[i].rankings;
						for (var i = 0; i < rankings.length; i++) {
							let individual = rankings[i];
							console.log("individual", individual);
							compliments.push(individual.compliments);

							count++;

							total += individual.overall;
						}
					}
				}

				console.log("compliments :", compliments);
				console.log("total :", (total / count) * credit);
				res.json({
					ranking: (total / count) * credit,
					message: "Successfully calculated score!",
					compliments
				})
			} else {
				console.log("could NOT locate user.")
				res.json({
					message: "User could NOT be found."
				})
			}
		}).catch((err) => {
			console.log(err);
		})
	});
});

module.exports = router;