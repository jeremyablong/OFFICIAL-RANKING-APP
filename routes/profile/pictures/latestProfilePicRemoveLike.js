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

			const { username, exists, poster, id } = req.body;

			const collection = db.collection("users");

			console.log("request.body latestProfilePicRemoveLike.js :", req.body);

			collection.find({ username: poster }).forEach((element, index) => {
				element.profilePic.forEach((item, index) => {
					if (item.id === id) {
						item.likes.forEach((like, index) => {
							if (like.posterUsername === username) {
								console.log("like : ", like, index);
								// then slice from the index to 1
								item.likes.splice(index, 1);
								item.reactions[like.reaction] = item.reactions[like.reaction] - 1;
							}
						});
					}
				});
				collection.save(element);
				res.json({
					message: "Successfully modified data and removed like..."
				})
			});
	});
});

module.exports = router;

