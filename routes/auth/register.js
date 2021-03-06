const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");
const User = require("../../models/signupUser.js");
const S3 = require('aws-sdk/clients/s3');
const AWS = require('aws-sdk');
const wasabiEndpoint = new AWS.Endpoint('s3.us-west-1.wasabisys.com');
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");

const accessKeyId = null;
const secretAccessKey = null;

const s3 = new S3({
	endpoint: wasabiEndpoint,
	region: 'us-west-1',
	accessKeyId,
	secretAccessKey
});

mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
	router.post("/", (req, res) => {

		console.log("req.body :", req.body);

		const generatedID = uuidv4();

		const mugshotUUID = uuidv4();

		if (req.body.phoneNumber) {
			console.log(req.body);

			// deconstruct response body
			const { 
				fullName,
				phoneNumber,
				password,
				birthdate,
				base64,
				hometown,
				username, 
				base64MUGSHOT
	        } = req.body;

	        const bufferImage = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""),'base64');

	        const bufferImageTwo = new Buffer(base64MUGSHOT.replace(/^data:image\/\w+;base64,/, ""),'base64');

			const newUser = new User({
			    fullName: fullName.trim(),
				phoneNumber: phoneNumber.trim(),
				password: password.trim(),
				birthdate,
				hometown: hometown.trim(),
				username: username.toLowerCase().trim(),
				profilePic: [{
					date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
					picture: generatedID,
					poster: username.trim(),
					id: uuidv4()
				}],
	            id: uuidv4(),
				profilePicReactions: {
					laugh: 0,
					heartFace: 0,
					frustrated: 0,
					heart: 0,
					angry: 0,
					sad: 0
				},
				base64MUGSHOT: mugshotUUID
			});

			const collection = db.collection("users");

			console.log("username :", username, "phoneNumber", phoneNumber);

			const lowerUsername = username.toLowerCase().trim();
			const trimmedPhone = phoneNumber.trim();

			// const collection = db.collection("users");

			collection.findOne({
			    "$or": [{
			        "username": lowerUsername
			    }, {
			        "phoneNumber": trimmedPhone
			    }]
			}).then((user) => {
				console.log(user);
				if (user) {
					res.json({
						message: "User FOUND - User has already registered with this username or phone number."
					});
				} else {
					newUser.save((err, doc) => {
						if (err) {
							console.log(err);
						}
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
						  	s3.putObject({
							  Body: bufferImageTwo,
							  Bucket: "rating-people",
							  Key: mugshotUUID,
							  ContentEncoding: 'base64'
							}
							, (errorr, dataaa) => {
							  if (errorr) {
							     console.log(errorr);
							  }
							  console.log(dataaa);
							  	res.json({
									message: "Successfully registered!",
									data: doc,
									image: generatedID
								})
							});
						});
						
					})
				}
			}).catch((err) => {
				console.log(err);
				res.json({
					err
				});
			});
		} else if (req.body.email) {
			console.log(req.body);

			// deconstruct response body
			const { 
				fullName,
				email,
				password,
				birthdate,
				base64,
				hometown,
				username, 
				base64MUGSHOT
	        } = req.body;

	        const bufferImage = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""),'base64');

	        const bufferImageTwo = new Buffer(base64MUGSHOT.replace(/^data:image\/\w+;base64,/, ""),'base64');

			const newUser = new User({
			    fullName: fullName.trim(),
				email: email.toLowerCase(),
				password: password.trim(),
				birthdate,
				hometown: hometown.trim(),
				username: username.trim(),
				profilePic: [{
					date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
					picture: generatedID,
					poster: username.trim(),
					id: uuidv4()
				}],
				id: uuidv4(),
				profilePicReactions: {
					laugh: 0,
					heartFace: 0,
					frustrated: 0,
					heart: 0,
					angry: 0,
					sad: 0
				},
				base64MUGSHOT: mugshotUUID
			});

			console.log("username :", username, "email", email);

			const lowerEmail = email.toLowerCase().trim();
			const lowerUsername = username.toLowerCase().trim();
			// const collection = db.collection("users");

			const collection = db.collection("users");

			collection.findOne({
			    "$or": [{
			        "username": lowerUsername
			    }, {
			        "email": lowerEmail
			    }]
			}).then((user) => {
				console.log(user);
				if (user) {
					res.json({
						message: "User FOUND - User has already registered with this username or email."
					});
				} else {
					newUser.save((err, doc) => {
						if (err) {
							console.log(err);
						}
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
						  	s3.putObject({
							  Body: bufferImageTwo,
							  Bucket: "rating-people",
							  Key: mugshotUUID,
							  ContentEncoding: 'base64'
							}
							, (errorr, dataaa) => {
							  if (errorr) {
							     console.log(errorr);
							  }
							  console.log(dataaa);
							  	res.json({
									message: "Successfully registered!",
									data: doc,
									image: generatedID
								})
							});
						});


					})
				}
			}).catch((err) => {
				console.log(err);
				res.json({
					err
				});
			});
		}
	});
});

module.exports = router;
