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

			const { username, recipient } = req.body;

			const collection = db.collection("users");

			console.log("req.body", req.body);

			let count = 0;

			const generated = uuidv4();

			collection.find({ $or: [ { username: username }, { username: recipient } ] }).toArray((err, data) => {
				if (err) {
					console.log(err);
				}
				for (var i = 0; i < data.length; i++) {
					let user = data[i];
					if (user.username === username) {
						console.log("------ this is author user ---- :", user);
						if (!user.friends) {
							user["friends"] = [{
								recipient,
								author: username,
								date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
								id: generated,
								status: "pending"
							}];
							collection.save(user);
							count++;
							console.log("special update one: ", user);
						} else {
							user.friends.push({
								recipient,
								author: username,
								date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
								id: generated,
								status: "pending"
							});
							collection.save(user);
							count++;
							console.log("special update two: ", user);
						}
					}
					if (user.username === recipient) {
						console.log("------ this is recipient user ---- :", user);
						if (!user.friends) {
							user["friends"] = [{
								recipient,
								author: username,
								date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
								id: generated,
								status: "pending"
							}];
							if (user.notifications) {
								user.notifications.push({
									user: username,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
									id: generated,
									data: "sent you a friend request!",
									route: "handle-request"
								})
							} else {
								user["notifications"] = [{
									user: username,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
									id: generated,
									data: "sent you a friend request!",
									route: "handle-request"
								}]
							}
							collection.save(user);
							count++;
							console.log("special update three: ", user);
						} else {
							user.friends.push({
								recipient,
								author: username,
								date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
								id: generated,
								status: "pending"
							});
							if (user.notifications) {
								user.notifications.push({
									user: username,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
									id: generated,
									data: "sent you a friend request!",
									route: "handle-request"
								})
							} else {
								user["notifications"] = [{
									user: username,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
									id: generated,
									data: "sent you a friend request!",
									route: "handle-request"
								}]
							}
							collection.save(user);
							count++;
							console.log("special update four: ", user);
						}
					}
				}
				if (count === 2) {
					res.json({
						message: "Successfully sent friend request!"
					})
				}
			})

			// collection.findOneAndUpdate({ username }, { $push: { friendRequests: { 
				// recipient,
				// author: username,
				// date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
				// id: uuidv4(),
				// status: "pending"
			// }}}, (err, doc) => {
			// 	if (err) {
			// 		console.log(err);
			// 	} else {
			// 		console.log(doc);
			// 		res.json({
			// 			message: "Successfully marked new location!",
			// 			doc
			// 		})				
			// 	}
			// });
	});
});

module.exports = router;