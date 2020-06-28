const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");

mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
	router.post("/", (req, res) => {

			const { username, index } = req.body;

			const collection = db.collection("users");

			console.log("req.body", req.body);

			const picturesArr = [];

			collection.findOne({ username }).then((user) => {

				const arr = user.profilePic;

				console.log("ARRR :", arr);
				
				for (var i = 0; i < arr.length; i++) {
					const el = arr[i];
					picturesArr.push(el);
				}

				console.log("picturesArr :", picturesArr);
				const reversed = picturesArr.reverse();
				if (user) {
					res.json({
						message: "We correctly indexed your picture and retrieved the results...!",
						pictures: reversed[index]
					})
				} else {
					res.json({
						message: "User could NOT be found..."
					})
				}
			}).catch((err) => {
				console.log("ERRRRRRR :", err);
				res.json({
					message: "User profile doesn't exist or an error occurred...",
					user: {}
				})
			})
	});
});

module.exports = router;