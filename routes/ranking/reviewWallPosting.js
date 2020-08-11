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

		const collection = db.collection("users");

		const { 
			relatable,
			entertaining, 
			offensive, 
			respectful, 
			happy, 
			overall,
			username,
			compliments,
			post,
			reviewer
		} = req.body;

		const compli = [];

		for (var i = 0; i < compliments.length; i++) {
			let each = compliments[i];
			compli.push(each.title);
		}

		const sumOfRatings = Math.floor((relatable + entertaining + offensive + respectful + happy + overall) / 6);

		console.log("compli", compli, sumOfRatings);

		console.log("req.body ------ :", req.body);

		collection.findOne({ username }).then((user) => {

			let changed = null;
			
			if (user) {

				if (user.wall) {
					for (var i = 0; i < user.wall.length; i++) {
						let posting = user.wall[i];
						if (posting.id === post.id) {
							console.log("WE HAVE A MATCH... ! ------ :", posting);
							if (!posting["rankings"]) {
								posting["rankings"] = [{
									compliments: compli,
									overall: sumOfRatings,
									reviewedBy: reviewer,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
									id: uuidv4()
								}];

								changed = posting;
							} else {
								posting.rankings.push({
									compliments: compli,
									overall: sumOfRatings,
									reviewedBy: reviewer,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
									id: uuidv4()
								});

								changed = posting;
							}
							console.log("POSTING ", posting);
						}
					}
				}
				
				if (!user["ranking"]) {
					user["ranking"] = [{
						compliments,
						overall: sumOfRatings,
						reviewedBy: reviewer,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						id: uuidv4()
					}]
				} else {
					user.ranking.push({
						compliments,
						overall: sumOfRatings,
						reviewedBy: reviewer,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						id: uuidv4()
					})
				}
				
				collection.save(user);

				res.json({
					message: "Successfully updated wall posting && user account..."
				})
			} else {
				res.json({
					message: "Could NOT find user."
				})
			}

			console.log("USERRRRR AFTER ------- :", user);
		}).catch((err) => {
			console.log(err);
		})
	});
});

module.exports = router;



// const mongoose = require("mongoose");
// const express = require("express");
// const router = express.Router();
// const cors = require("cors");
// const app = express();
// const config = require("config");
// const mongo = require("mongodb");
// const moment = require("moment");
// const { v4: uuidv4 } = require('uuid');

// mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
// 	router.post("/", (req, res) => {

// 		const collection = db.collection("users");

// 		const { 
// 			relatable,
// 			entertaining, 
// 			offensive, 
// 			respectful, 
// 			happy, 
// 			overall,
// 			username,
// 			compliments,
// 			post,
// 			reviewer
// 		} = req.body;

// 		const compli = [];

// 		for (var i = 0; i < compliments.length; i++) {
// 			let each = compliments[i];
// 			compli.push(each.title);
// 		}

// 		const sumOfRatings = Math.floor((relatable + entertaining + offensive + respectful + happy + overall) / 6);

// 		console.log("compli", compli, sumOfRatings);

// 		console.log("req.body ------ :", req.body);

// 		collection.findOne({ username }).then((user) => {

// 			let changed = null;

// 			if (!user["ranking"]) {
// 				user["ranking"] = sumOfRatings;
// 			} else {
// 				user.ranking = Math.floor((user.ranking + sumOfRatings) / 2);
// 			}

// 			for (var i = 0; i < user.wall.length; i++) {
// 				let posting = user.wall[i];
// 				if (posting.id === post.id) {
// 					console.log("WE HAVE A MATCH... ! ------ :", posting);
// 					if (!posting["rankings"]) {
// 						posting["rankings"] = [{
// 							compliments: compli,
// 							overall: sumOfRatings,
// 							reviewedBy: reviewer,
// 							date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
// 							id: uuidv4()
// 						}];

// 						changed = posting;
// 					} else {
// 						posting.rankings.push({
// 							compliments: compli,
// 							overall: sumOfRatings,
// 							reviewedBy: reviewer,
// 							date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
// 							id: uuidv4()
// 						});

// 						changed = posting;
// 					}
// 					console.log("POSTING ", posting);
// 				}
// 			}
// 			// change this back to start saving to DB again...
// 			collection.save(user);

// 			res.json({
// 				message: "Successfully updated wall posting && user account...",
// 				post: changed
// 			})

// 			console.log("USERRRRR AFTER ------- :", user);
// 		}).catch((err) => {
// 			console.log(err);
// 		})
// 	});
// });

// module.exports = router;