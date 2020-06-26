const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const S3 = require('aws-sdk/clients/s3');
const AWS = require('aws-sdk');
const wasabiEndpoint = new AWS.Endpoint('s3.us-west-1.wasabisys.com');



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

			const { username, comment } = req.body;

			const generatedID = uuidv4();

			const collection = db.collection("users");

			console.log("req.body", req.body);

			if (req.body.avatar && comment) {

				const bufferImage = new Buffer(req.body.avatar.replace(/^data:image\/\w+;base64,/, ""),'base64');

				const { avatar } = req.body;

				collection.findOneAndUpdate({ username }, { $push: { "profilePictureReplies": {
					comment,
					poster: username,
					date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
					id: uuidv4(),
					avatar,
					postedImage: generatedID
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
								message: "Successfully posted new comment!",
								doc,
								image: generatedID
							})
						});
						
					}
				});
			} else if (req.body.avatar && !comment) {

				const bufferImage = new Buffer(req.body.avatar.replace(/^data:image\/\w+;base64,/, ""),'base64');

				collection.findOneAndUpdate({ username }, { $push: { "profilePictureReplies": {
					poster: username,
					date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
					id: uuidv4(),
					postedImage: generatedID
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
								message: "Successfully posted new comment!",
								doc,
								image: generatedID
							})
						});
					}
				});
			} else if (comment && !req.body.avatar) {
				collection.findOneAndUpdate({ username }, { $push: { "profilePictureReplies": {
					comment,
					poster: username,
					date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
					id: uuidv4()
				}}}, (err, doc) => {
					if (err) {
						console.log(err);
					} else {
						console.log(doc);
						res.json({
							message: "Successfully posted new comment!",
							doc
						})
					}
				});
			}
	});
});

module.exports = router;