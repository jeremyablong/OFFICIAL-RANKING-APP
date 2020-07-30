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
        // deconstruct response body
		const { username, post, text } = req.body;

		console.log("post", post);

		const collection = db.collection("users");

		collection.findOne({ username }).then((user) => {
			
			const id = uuidv4();

			if (user) {

				if (!user.wall) {
					user["wall"] = [{
						author: username,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						id,
						text,
						reactions: [],
						likes: [],
						replies: [],
						shareable: false,
						original: post
					}]
				} else {
					user.wall.push({
						author: username,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						id,
						text,
						reactions: [],
						likes: [],
						replies: [],
						shareable: false,
						original: post
					})
				}

				collection.save(user);

				res.json({
					message: "Successfully shared this post...",
					original: post
				})

				console.log("oooo :", user);
			} else {
				res.json({
					message: "Could NOT find user."
				})
			}
		}).catch((err) => {
			console.log(err);
			res.json({
				err
			})
		})
    });
});

module.exports = router;