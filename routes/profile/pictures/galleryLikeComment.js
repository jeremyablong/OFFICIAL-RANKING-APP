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

			const { username, id } = req.body;

			const collection = db.collection("users");

			console.log("request.body", req.body);

			collection.find({ "profilePic.replies.id": id }).forEach((element) => {
				element.profilePic.forEach((element, index) => {
					element.replies.forEach((element, index) => {
						if (element.id === id) {
							// console.log("ELLLL :", element);
							element.likes = [{
								id: id,
								likedBy: username,
								date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a")
							}];

							console.log("ELLLL :", element);
						}
					});
				});
				collection.save(element);
			});
	});
});

module.exports = router;