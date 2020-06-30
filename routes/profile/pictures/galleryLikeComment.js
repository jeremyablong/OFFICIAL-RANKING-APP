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

			const { username, id, receiver, exists } = req.body;

			const collection = db.collection("users");

			console.log("request.bodyyyyyy galleryLikeComment.js :", req.body);

			collection.find({ "profilePic.replies.id": id }).forEach((element) => {
				element.profilePic.forEach((elem, index) => {
					elem.replies.forEach((itemmm, index) => {
						if (itemmm.id === id) {
							console.log("ELLLL :", itemmm);
							if (itemmm.likes) {
								if (exists === false) {
									itemmm.likes.push({
										id: id,
										likedBy: username,
										date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a")
									});
								} else {
									for (var i = 0; i < itemmm.likes.length; i++) {

										let likeee = itemmm.likes[i];

										if (likeee.likedBy === username) {
											console.log("EQUALS.")
											const removeElement = (array, elem) => {
											    let index = array.indexOf(elem);
											    if (index > -1) {
											        array.splice(index, 1);
											    }
											}
											removeElement(itemmm.likes, likeee);

											collection.save(element);
										} 
									}
								}

								
							} else {
								itemmm.likes = [{
									id: id,
									likedBy: username,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a")
								}];
							}

							console.log("ELLLL :", element);
							res.json({
								message: "Successfully liked this comment!"
							})
						}

						
					});
				});
				collection.save(element);
			});


			collection.findOneAndUpdate({ username: receiver.poster }, { $push: { notifications: {
				user: username,
				date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
				id: uuidv4(),
				data: "liked a comment on one of your profile pictures"
			}}}, (err, doc) => {
				if (err) {
					console.log(err);
				}
				console.log(doc);
			})
	});
});

module.exports = router;

