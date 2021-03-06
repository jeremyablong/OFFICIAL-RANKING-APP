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

			let count = 0;

			collection.find({}).forEach((item) => {
				if (item.username === lowerSender) {
					console.log("sender match... :", item);
					if (item.messages) {
						item.messages.push({
							id: generatedID,
							message,
							date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
							author: sender,
							reciever: reciever,
							sender: true
						});
					} else {
						item["messages"] = [{
							id: generatedID,
							message,
							date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
							author: sender,
							reciever: reciever,
							sender: true
						}];
					}
					collection.save(item);
					count++;
					return;
				} else if (item.username === lowerReciever) {
					console.log("reciever match... :", item);
					if (item.notifications) {
						item.notifications.push({
							user: lowerSender,
							date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
							id: uuidv4(),
							data: "sent you a new private message!",
							route: "message-individual"
						});
					} else {
						item["notifications"] = [{
							user: lowerSender,
							date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
							id: uuidv4(),
							data: "sent you a new private message!",
							route: "message-individual"
						}]
					}
					if (item.messages) {
						item.messages.push({
							id: generatedID,
							message,
							date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
							author: sender, 
							reciever: reciever, 
							sender: false
						});
					} else {
						item["messages"] = [{
							id: generatedID,
							message,
							date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
							author: sender, 
							reciever: reciever, 
							sender: false
						}];
					}
					collection.save(item);
					count++;
					return;
				}

				if (count === 2) {
					res.json({
						message: "Successfully updated both users!"
					});
				}
			})

			
	});
});

module.exports = router;