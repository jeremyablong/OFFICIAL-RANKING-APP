const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');

mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
	router.post("/", (req, res) => {

		const collection = db.collection("users");

		const { reaction, poster, id, username } = req.body;
 
		collection.findOne({ username: poster }).then((user) => {
			for (let i = 0; i < user.wall.length; i++) {
				let wallPosting = user.wall[i];
				if (wallPosting.id === id) {
					if (!wallPosting.reactions[reaction]) {
						wallPosting.reactions[reaction] = 1;
					} else {
						wallPosting.reactions[reaction] + 1;
 					}
					wallPosting.likes.push({
						username,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						id: uuidv4(),
						reaction
					});

					collection.save(user);

					res.json({
						message: "You've successfully liked this user's post!",
						reaction
					})
					console.log(wallPosting);
				}
			}
		}).catch((err) => {
			console.log(err);
		})
	});
});

module.exports = router;