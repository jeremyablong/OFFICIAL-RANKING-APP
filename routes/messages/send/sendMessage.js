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
			const { sender, reciever, message } = req.body;

			const collection = db.collection("users");

			console.log("req.body", req.body);

			const generatedID = uuidv4();

			const lowerSender = sender.toLowerCase();
			const lowerReciever = reciever.toLowerCase();

			collection.findOneAndUpdate({ username: lowerSender }, { $push: { messages: {
				id: generatedID,
				message,
				date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
				author: sender,
				sender: true
			}}}, (err, doc) => {
				if (err) {
					console.log(err);
				} else {
					collection.findOneAndUpdate({ username: lowerReciever }, { $push: { messages: {
						id: generatedID,
						message,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						author: sender,
						sender: false
					}}}, (err, doc) => {
						if (err) {
							console.log(err);
						} else {
							res.json({
								message: "Successfully updated both users!",
								doc
							})
						}
					})
				}
			})
	});
});

module.exports = router;