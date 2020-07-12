const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");
const S3 = require('aws-sdk/clients/s3');
const AWS = require('aws-sdk');
const wasabiEndpoint = new AWS.Endpoint('s3.us-west-1.wasabisys.com');
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");

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

			const { username, avatar, title, description } = req.body;

			const generatedID = uuidv4();

			const bufferImage = new Buffer(avatar.replace(/^data:image\/\w+;base64,/, ""),'base64');
 
			const collection = db.collection("users");

			console.log("req.body", req.body);

			if (req.body.description) {
				console.log("title AND description were included...");
				collection.findOneAndUpdate({ username }, { $push: { profilePic: {
					picture: generatedID,
					date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
					poster: username,
					id: uuidv4(),
					title,
					description,
					reactions: {
						laugh: 0,
						heartFace: 0,
						frustrated: 0,
						heart: 0,
						angry: 0,
						sad: 0
					},
					likes: [],
					replies: []
				}}}, (err, doc) => {
					if (err) {
						console.log(err);
					} else {
						console.log(doc);
						s3.putObject({
						  Body: bufferImage,
						  Bucket: "rating-people",
						  Key: generatedID,
						  ContentEncoding: 'base64'
						}
						, (err, data) => {
						  if (err) {
						     console.log(err);
						  }
						  console.log(data);
						  	res.json({
								message: "Successfully added new profile!",
								data: doc,
								image: generatedID
							})
						});
					}
				});
			} else if (req.body.title && !req.body.description) {
				console.log("title was included but description was not...");
				collection.findOneAndUpdate({ username }, { $push: { profilePic: {
					picture: generatedID,
					date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
					poster: username,
					id: uuidv4(),
					title,
					reactions: {
						laugh: 0,
						heartFace: 0,
						frustrated: 0,
						heart: 0,
						angry: 0,
						sad: 0
					},
					likes: [],
					replies: []
				}}}, (err, doc) => {
					if (err) {
						console.log(err);
					} else {
						console.log(doc);
						s3.putObject({
						  Body: bufferImage,
						  Bucket: "rating-people",
						  Key: generatedID,
						  ContentEncoding: 'base64'
						}
						, (err, data) => {
						  if (err) {
						     console.log(err);
						  }
						  console.log(data);
						  	res.json({
								message: "Successfully added new profile!",
								data: doc,
								image: generatedID
							})
						});
					}
				});
			}
	});
});

module.exports = router;