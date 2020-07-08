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
const fs = require("fs");

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

			const { text, images, username } = req.body;

			const pictures = [];

			const collection = db.collection("users");

			console.log("req.body", req.body);

			if (images && text) {
				console.log("running images and text upload...");
				// iterate through images and post each one to *wasabi* or AWS s3
				for (let i = 0; i < images.length; i++) {

					const generatedID = uuidv4();
				
					let image = images[i];

					image["key"] = generatedID;
					// push images into array to add to mongodb datebase post later in file
					pictures.push(image.key);

					const bufferImage = new Buffer(image.base64.replace(/^data:image\/\w+;base64,/, ""),'base64');
					
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
					  console.log("GREAT SUCCESS :", data);
					});
				}

				collection.findOneAndUpdate({ username }, { $push: { wall: {
					images: pictures,
					author: username,
					date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
					id: uuidv4(),
					text,
					shareable: true,
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
					}
					console.log(doc);
					if (doc) {
						res.json({
							message: "Successfully uploaded images to wall and status update!",
							images: pictures
						})
					}
				})
			} else if (images && !text) {
				console.log("ONLY images exist - no text...");
				for (let i = 0; i < images.length; i++) {

					const generatedID = uuidv4();
				
					let image = images[i];

					image["key"] = generatedID;
					// push images into array to add to mongodb datebase post later in file
					pictures.push(image.key);

					const bufferImage = new Buffer(image.base64.replace(/^data:image\/\w+;base64,/, ""),'base64');
					
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
					  console.log("GREAT SUCCESS :", data);
					});
				}

				collection.findOneAndUpdate({ username }, { $push: { wall: {
					images: pictures,
					author: username,
					date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
					id: uuidv4(),
					shareable: true,
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
					}
					console.log(doc);
					if (doc) {
						res.json({
							message: "Successfully uploaded images to wall and status update!",
							images: pictures
						})
					}
				});
			} else if (!images && text) {
				collection.findOneAndUpdate({ username }, { $push: { wall: {
					text, 
					author: username,
					date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
					id: uuidv4(), 
					shareable: true,
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
					}
					console.log(doc);
					if (doc) {
						res.json({
							message: "Successfully uploaded wall posting!"
						})
					}
				});
			}
	});
});

module.exports = router;
