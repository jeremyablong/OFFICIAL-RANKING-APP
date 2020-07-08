const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");

mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
	router.post("/", (req, res) => {

			const { username, requester, requestID } = req.body;

			const collection = db.collection("users");

			console.log("req.body", req.body);

			const finalMessage = [];

			let count = 0;

			collection.find({ $or: [ { username: username }, { username: requester } ] }).toArray((err, data) => {
				if (err) {
					console.log(err);
				}
				for (let x = 0; x < data.length; x++) {
					let user = data[x];
					if (user.username === username) {
						console.log("logged in user... :", user);
						for (let i = 0; i < user.friends.length; i++) {
							let friend = user.friends[i];
							if (friend.id === requestID) {
								console.log("User - acceptFriendRequest.js MATCHHHHH:", friend);
								friend.status = "accepted";
								count++;
							}
						}
					} else if (user.username === requester) {
						console.log("sender user... :", user);
						for (let i = 0; i < user.friends.length; i++) {
							const friend = user.friends[i];
							if (friend.id === requestID) {
								friend.status = "accepted";
								count++;
							}
						}
					}
					collection.save(user);
				}
				if (count === 2) {
					res.json({
						message: "You've accepted this friend request!"
					})
				}
			});
	});
});

module.exports = router;

// for (let i = 0; i < user.friends.length; i++) {
// 	let friend = user.friends[i];
// 	console.log("friend ... :", friend);
// 	if (friend.id === requestID) {
// 		console.log("User - acceptFriendRequest.js MATCHHHHH:", friend);
// 		friend.status = "accepted";
// 	}
// }
// collection.save(user);
// res.json({
// 	message: "You've accepted this friend request!"
// })