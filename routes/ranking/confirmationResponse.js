const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const request = require("request");


mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
	router.post("/", (req, res) => {

		const collection = db.collection("users");

		console.log("Req.body :", req.body);

		const {
			relatable,
			entertaining, 
			offensive, 
			respectful, 
			happy,  
			overall,
			username
		} = req.body;

		collection.find({ username: { $in: [ username, req.body.user ] }}).toArray((err, users) => {

			if (err) {
				res.json({
					message: "Error occurred...",
					err
				})
			}

			console.log("Usaaaaa: ", users);

			const id = uuidv4();

			for (var i = 0; i < users.length; i++) {
				let user = users[i];
				
				if (user.username === username) {
					const calculated = Math.round((relatable + entertaining + offensive + respectful + happy + overall) / 6);

					if (!user.ranking) {

						

						user["ranking"] = calculated;

						if (!user.rankedUsers) {
							user["rankedUsers"] = [{
								username,
								date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
								id,
								rankedBy: req.body.user 
							}]
						} else if (user.rankedUsers) {
							user.rankedUsers.push({
								username,
								date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
								id,
								rankedBy: req.body.user
							})
						}
						request({ 
							method: "POST",
							url: 'http://recovery-social-media.ngrok.io/get/user/by/username', 
							body: {
								username: req.body.user
							},
							json: true
						}, (error, response, body) => {

							console.log("BODY :", body);

							

							if (user.rankedUsers) {
								user["rankedUsers"] = [{
									reciever: username,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
									id,
									rankedBy: req.body.user,
									completed: true
								}];
							} else if (!user.rankedUsers) {
								user.rankedUsers.push({
									reciever: username,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
									id,
									rankedBy: req.body.user,
									completed: true
								});
							}

							collection.save(user);

							console.log("pop the bag ONE... ", user);


							  // console.error('error:', error); // Print the error if one occurred
							  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
							  // console.log('body:', body); // Print the HTML for the Google homepage.
							});
					}
				} else if (user.username === req.body.user) {
					

					if (!user.rankedUsers) {
						user["rankedUsers"] = [{
							reciever: username,
							date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
							id,
							rankedBy: req.body.user,
							completed: true
						}];
					} else if (user.rankedUsers) {
						user.rankedUsers.push({
							reciever: username,
							date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
							id,
							rankedBy: req.body.user,
							completed: true
						});
					}

					collection.save(user);

					console.log("!!!", user);
					
				}
			}
			res.json({
				message: "Successfully calculated ranking..."
			})
			// collection.save(user);
		});
	});
});

module.exports = router;