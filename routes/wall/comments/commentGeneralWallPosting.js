const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");
const moment = require("moment");
const S3 = require('aws-sdk/clients/s3');
const AWS = require('aws-sdk');
const wasabiEndpoint = new AWS.Endpoint('s3.us-west-1.wasabisys.com');
const { v4: uuidv4 } = require('uuid');

const accessKeyId = 'J4FR4IVQL0CV0DFTMYBJ';
const secretAccessKey = 'wuUJoRXlWkSpVfPusz5XEf3ijhgvRtbwXc4oFofP';

const s3 = new S3({
	endpoint: wasabiEndpoint,
	region: 'us-west-1',
	accessKeyId,
	secretAccessKey
});

mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
	router.post("/", (req, res) => {

		const collection = db.collection("users");

		console.log("REQ.body :", req.body);

		const { message, id, author, poster } = req.body;

		if (message && id && author && !req.body.avatar) {

			const { message, id, author } = req.body;
			// content goes here...

			collection.findOne({$and:[{ "wall.id": id }, { username: author }] }).then((user) => {
				for (var i = 0; i < user.wall.length; i++) {
					let wallPosting = user.wall[i];
					if (wallPosting.id === id) {
						wallPosting.replies.push({
							message,
							id: id,
							date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
							author: poster
						})
						const added = {
							message,
							id: id,
							date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
							author: poster
						};
						res.json({
							message: "Successfully posted comment to posting!",
							added
						})
						console.log("wallPosting", wallPosting);
						collection.save(user);
					}
				}
			}).catch((err) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Error occurred...",
						err
					})
				}
			})
 		} 
		if (message && id && author && req.body.avatar) {

			const { avatar, message, id, author } = req.body;

			const bufferImageTwo = new Buffer(avatar.replace(/^data:image\/\w+;base64,/, ""),'base64');
			// content goes here...

			collection.findOne({$and:[{ "wall.id": id }, { username: author }] }).then((user) => {
				for (var i = 0; i < user.wall.length; i++) {
					let wallPosting = user.wall[i];
					if (wallPosting.id === id) {

						const generatedID = uuidv4();

						s3.putObject({
						  Body: bufferImageTwo,
						  Bucket: "rating-people",
						  Key: generatedID,
						  ContentEncoding: 'base64'
						}
						, (errorr, dataaa) => {
						  if (errorr) {
						     console.log(errorr);
						  }
						  	console.log(dataaa);

						 	wallPosting.replies.push({
								message,
								id: id,
								date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
								author: poster,
								picture: generatedID
							});

							const added = {
								message,
								id: id,
								date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
								author: poster,
								picture: generatedID
							}

							console.log("wallPosting", wallPosting);

						  	res.json({
								message: "Successfully posted comment to posting!",
								image: generatedID,
								added
							});
							collection.save(user);
						});
						
					}
				}
			}).catch((err) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Error occurred...",
						err
					})
				}
			})
		}
	});
});

module.exports = router;