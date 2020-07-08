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

		const wallArray = [];

		collection.find({}).toArray((err, users) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Error occurred...",
					err
				})
			}
			for (var i = 0; i < users.length; i++) {
				let wall = users[i].wall;
				if (wall) {
					for (let x = 0; x < wall.length; x++) {
						let post = wall[x];
						wallArray.push(post);
					}
				}
			}
			console.log("USA :", users);
			res.json({
				message: "Successfully gather all wall postings...",
				wall: wallArray
			});
		})
	});
});

module.exports = router;