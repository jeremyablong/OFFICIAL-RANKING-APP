const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");


mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
	router.post("/", (req, res) => {
			

			// deconstruct username + reaction response
			const { username, reaction, user, id } = req.body;

			const collection = db.collection("users");

			console.log("req.body", req.body);

			const generatedID = uuidv4();

			collection.findOneAndUpdate({ "profilePic.id": id }, { $inc: { [`profilePic.$.reactions.${reaction}`]: 1 }}, (err, doc) => {
				if (err) {
					console.log(err);
				} else {
					console.log("doc !:", doc);
					collection.findOneAndUpdate({ "profilePic.id": id }, { $push: { "profilePic.$.likes": { 
						posterUsername: user,
						reaction,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						id: uuidv4()
					}}}, (err, doc) => {
						if (err) {
							console.log(err);
						} else {
							res.json({
								message: "Successfully created and updated reaction object with appropriate likes in DB!",
								doc
							})
						}
					})
				}
			})
	});
});

module.exports = router;
