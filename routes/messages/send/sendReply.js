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
			

			// sender and reciever are emails from logged in user and the user being messaged - deconstruct
			const { sender, reciever, message, messageID } = req.body;

			const collection = db.collection("users");

			console.log("req.body", req.body);

			const generatedID = uuidv4();

			collection.findOneAndUpdate({ "messages.id": messageID, username: sender }, { $push: { "messages.$.replies": {
				message,
				date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
				author: sender,
				id: messageID,
				sender: true
			}}}, (err, doc) => {
				if (err) {
					console.log(err);
				} else {
					collection.findOneAndUpdate({ "messages.id": messageID, username: reciever }, { $push: { "messages.$.replies": {
						message,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						author: sender,
						id: messageID,
						sender: false 
					}}}, (err, doc) => {
						if (err) {
							console.log(err);
						} else {
							res.json({
								messageCase: "Successfully updated both users!",
								doc,
								message,
								date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
								author: sender,
								id: messageID
							})
						}
					})
				}
			})
	});
});

module.exports = router;