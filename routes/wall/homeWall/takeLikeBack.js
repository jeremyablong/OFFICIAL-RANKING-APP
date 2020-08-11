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

		const { username, post } = req.body;

		console.log("req.bodyyyy :", req.body);
 
		collection.findOne({ username: post.author }).then((user) => {

			console.log("BEFORE :", user);

			if (user) {

				if (user.wall) {

					for (var i = 0; i < user.wall.length; i++) {

						let wallPosting = user.wall[i];

						if (wallPosting.id === post.id) {

							console.log("wallPosting", wallPosting);

							for (var x = 0; x < wallPosting.likes.length; x++) {

								let like = wallPosting.likes[x];

								if (like.username === username) {

									wallPosting.likes.splice(x, 1);

									wallPosting.reactions[like.reaction] = wallPosting.reactions[like.reaction] - 1;

									collection.save(user);

									res.json({
										message: "Unliked post!",
										post
									})
								}

								console.log("like :", like);
							}

							// wallPosting.reactions[element.reaction] = post.reactions[element.reaction] - 1;

							console.log("wallPosting AFTERRRRRR :", wallPosting);
						}

					}
				}

				// for (var i = 0; i < post.likes.length; i++) {

				// 	let element = post.likes[i];

				// 	console.log("ElementTTTTTT :", element, i);

				// 	if (element.username === username) {

						// post.likes.splice(i, 1);

						// post.reactions[element.reaction] = post.reactions[element.reaction] - 1;

				// 		collection.save(user);

						// res.json({
						// 	message: "Unliked post!",
						// 	post
						// })

				// 		console.log("POST:", post);
				// 	}
				// }
			}

			console.log("AFTER :", user);
		}).catch((err) => {
			console.log(err);
		})
	});
});

module.exports = router;