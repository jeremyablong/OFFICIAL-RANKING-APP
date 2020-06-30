const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '1027409',
  key: '63c7fd036f7febaf4035',
  secret: '9f929540de1a20657a6a',
  cluster: 'us3',
  encrypted: true
});

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
				reciever: reciever,
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
						reciever: reciever, 
						sender: false
					}, notifications: {
						user: lowerSender,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						id: uuidv4(),
						data: "sent you a new private message!"
					}}}, (err, doc) => {
						if (err) {
							console.log(err);
						} else {
							res.json({
								message: "Successfully updated both users!",
								doc
							});
						}
					})
				}
			})
	});
});

module.exports = router;