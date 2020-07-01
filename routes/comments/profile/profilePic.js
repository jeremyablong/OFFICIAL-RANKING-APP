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

			const { username, comment, id, owner, index } = req.body;

			const generatedID = uuidv4();

			const firstID = uuidv4();

			const secondID = uuidv4();

			const thirdID = uuidv4();

			const collection = db.collection("users");

			console.log("req.body", req.body);

			if (username === owner) {
				console.log("the poster matches the owner...");
				if (req.body.avatar && comment) {

					const bufferImage = new Buffer(req.body.avatar.replace(/^data:image\/\w+;base64,/, ""),'base64');

					const { avatar } = req.body;

					collection.findOneAndUpdate({ "profilePic.id": id }, { $push: { "profilePic.$.replies": {
						comment,
						poster: username,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						id: firstID,
						// maybe take this out???? below...
						// avatar,
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
									image: generatedID,
									newly: {
										comment,
										picture: `https://s3.us-west-1.wasabisys.com/rating-people/${doc.value.profilePic[doc.value.profilePic.length - 1].picture}`,
										poster: username,
										date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
										id: firstID,
										postedImage: `https://s3.us-west-1.wasabisys.com/rating-people/${generatedID}`
									}
								})
							});
							
						}
					});
				} else if (req.body.avatar && !comment) {

					const bufferImage = new Buffer(req.body.avatar.replace(/^data:image\/\w+;base64,/, ""),'base64');

					collection.findOneAndUpdate({ "profilePic.id": id }, { $push: { "profilePic.$.replies": {
						poster: username,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						id: secondID,
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
									image: generatedID,
									newly: {
										poster: username,
										picture: `https://s3.us-west-1.wasabisys.com/rating-people/${doc.value.profilePic[doc.value.profilePic.length - 1].picture}`,
										date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
										id: secondID,
										postedImage: `https://s3.us-west-1.wasabisys.com/rating-people/${generatedID}`
									}
								})
							});
						}
					});
				} else if (comment && !req.body.avatar) {
					collection.findOneAndUpdate({ "profilePic.id": id }, { $push: { "profilePic.$.replies": {
						comment,
						poster: username,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						id: thirdID
					}}}, (err, doc) => {
						if (err) {
							console.log(err);
						} else {
							console.log(doc);
							res.json({
								message: "Successfully posted new comment!",
								doc,
								newly: {
									comment,
									picture: `https://s3.us-west-1.wasabisys.com/rating-people/${doc.value.profilePic[doc.value.profilePic.length - 1].picture}`,
									poster: username,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
									id: thirdID
								}
							})
						}
					});
				}
			} else {
				if (req.body.avatar && comment) {

				const bufferImage = new Buffer(req.body.avatar.replace(/^data:image\/\w+;base64,/, ""),'base64');

				const { avatar } = req.body;

				collection.findOneAndUpdate({ "profilePic.id": id }, { $push: { "profilePic.$.replies": {
					comment,
					poster: username,
					date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
					id: firstID,
					// maybe take this out???? below...
					// avatar,
					postedImage: generatedID
				}, notifications: {
					user: username,
					date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
					id: uuidv4(),
					data: "commented on your profile picture",
					route: "image-gallery",
					index
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
								image: generatedID,
								newly: {
									comment,
									picture: `https://s3.us-west-1.wasabisys.com/rating-people/${doc.value.profilePic[doc.value.profilePic.length - 1].picture}`,
									poster: username,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
									id: firstID,
									postedImage: `https://s3.us-west-1.wasabisys.com/rating-people/${generatedID}`
								}
							})
						});
						
					}
				});
			} else if (req.body.avatar && !comment) {

					const bufferImage = new Buffer(req.body.avatar.replace(/^data:image\/\w+;base64,/, ""),'base64');

					collection.findOneAndUpdate({ "profilePic.id": id }, { $push: { "profilePic.$.replies": {
						poster: username,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						id: secondID,
						postedImage: generatedID
					}, notifications: {
						user: username,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						id: uuidv4(),
						data: "commented on your profile picture",
						route: "image-gallery",
						index
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
									image: generatedID,
									newly: {
										poster: username,
										picture: `https://s3.us-west-1.wasabisys.com/rating-people/${doc.value.profilePic[doc.value.profilePic.length - 1].picture}`,
										date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
										id: secondID,
										postedImage: `https://s3.us-west-1.wasabisys.com/rating-people/${generatedID}`
									}
								})
							});
						}
					});
				} else if (comment && !req.body.avatar) {
					collection.findOneAndUpdate({ "profilePic.id": id }, { $push: { "profilePic.$.replies": {
						comment,
						poster: username,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						id: thirdID
					}, notifications: {
						user: username,
						date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
						id: uuidv4(),
						data: "commented on your profile picture",
						route: "image-gallery",
						index
					}}}, (err, doc) => {
						if (err) {
							console.log(err);
						} else {
							console.log(doc);
							res.json({
								message: "Successfully posted new comment!",
								doc,
								newly: {
									comment,
									picture: `https://s3.us-west-1.wasabisys.com/rating-people/${doc.value.profilePic[doc.value.profilePic.length - 1].picture}`,
									poster: username,
									date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
									id: thirdID
								}
							})
						}
					});
				}
			}
	});
});

module.exports = router;