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

			const { username, comment } = req.body;

			const generatedID = uuidv4();

			const bufferImage = new Buffer(avatar.replace(/^data:image\/\w+;base64,/, ""),'base64');

			const collection = db.collection("users");

			console.log("req.body", req.body);

			collection.findOneAndUpdate({ username }, { $push: { "profilePic.replies": {
				comment,
				poster: username,
				date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
				id: uuidv4()
			}}}, (err, doc) => {
				if (err) {
					console.log(err);
				} else {
					console.log(doc);
					res.json({
						message: "Successfully posted new comment!",
						doc
					})
				}
			});
	});
});

module.exports = router;