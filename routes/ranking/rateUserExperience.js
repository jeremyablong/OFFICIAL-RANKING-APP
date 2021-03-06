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

		let count = 0;

		const collection = db.collection("users");

		console.log("Req.body :", req.body);

		const {
			relatable,
			entertaining, 
			offensive, 
			respectful, 
			happy, 
			overall,
			username, 
			user, 
			compli
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

						

						user["ranking"] = [{
							compliments: compli,
							overall: calculated,
							reviewedBy: req.body.user,
							date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
							id: uuidv4()
						}];

						if (!user.rankedUsers) {
							user["rankedUsers"] = [{
								username,
								date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
								id,
								rankedBy: req.body.user,
								completed: false 
							}]
						} else if (user.rankedUsers) {
							user.rankedUsers.push({
								username,
								date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
								id,
								rankedBy: req.body.user,
								completed: false
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

							if (!user.notifications) {
								user["notifications"] = [{
									user: body.user.username,
									userObject: body.user,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
									id: uuidv4(),
									data: "reviewed you... You can now review them. Click to be directed to the review/response page",
									route: "complete-review-process"
								}]
							} else if (user.notifications) {
								user.notifications.push({
									user: body.user.username,
									userObject: body.user,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
									id: uuidv4(),
									data: "reviewed you... You can now review them. Click to be directed to the review/response page",
									route: "complete-review-process"
								})
							}

							// if (!user.rankedUsers) {
							// 	user["rankedUsers"] = [{
							// 		reciever: username,
							// 		date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
							// 		id,
							// 		rankedBy: req.body.user,
							// 		completed: false
							// 	}];
							// } else if (user.rankedUsers) {
							// 	user.rankedUsers.push({
							// 		reciever: username,
							// 		date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
							// 		id,
							// 		rankedBy: req.body.user,
							// 		completed: false
							// 	});
							// }

							

							console.log("pop the bag ONE... ", user);


							  // console.error('error:', error); // Print the error if one occurred
							  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
							  // console.log('body:', body); // Print the HTML for the Google homepage.
						});

						count + 1;

				

						console.log("user AGAIN : ", user);
					} else {
						user.ranking.push({
							compliments: compli,
							overall: calculated,
							reviewedBy: req.body.user,
							date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
							id: uuidv4()
						});

						if (!user.rankedUsers) {
							user["rankedUsers"] = [{
								username,
								date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
								id,
								rankedBy: req.body.user,
								completed: false 
							}]
						} else if (user.rankedUsers) {
							user.rankedUsers.push({
								username,
								date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
								id,
								rankedBy: req.body.user,
								completed: false
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

							if (!user.notifications) {
								user["notifications"] = [{
									user: body.user.username,
									userObject: body.user,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
									id: uuidv4(),
									data: "reviewed you... You can now review them. Click to be directed to the review/response page",
									route: "complete-review-process"
								}]
							} else if (user.notifications) {
								user.notifications.push({
									user: body.user.username,
									userObject: body.user,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
									id: uuidv4(),
									data: "reviewed you... You can now review them. Click to be directed to the review/response page",
									route: "complete-review-process"
								})
							}

							

							console.log("pop the bag ONE... ", user);


							  // console.error('error:', error); // Print the error if one occurred
							  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
							  // console.log('body:', body); // Print the HTML for the Google homepage.
						});


						collection.save(user);
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

					

					console.log("!!!", user);

					count + 1;
		
					
				}

				collection.save(user);
			}

			


			res.json({
				message: "Successfully calculated ranking..."
			})
			// collection.save(user);
		});
	});
});

module.exports = router;