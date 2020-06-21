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

		console.log("req.body :", req.body);

		const generatedID = uuidv4();

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
				username
	        } = req.body;

	        const bufferImage = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""),'base64');

			const newUser = new User({
			    fullName,
				phoneNumber,
				password,
				birthdate,
				hometown,
				username,
				profilePic: generatedID,
	            id: uuidv4()
			});

			const collection = db.collection("users");

			collection.findOne({ phoneNumber }).then((user) => {
				console.log(user);
				if (user) {
					res.json({
						message: "User FOUND - User has already registered with this phone number."
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
						  	res.json({
								message: "Successfully registered!",
								data: doc,
								image: generatedID
							})
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
				username
	        } = req.body;

	        const bufferImage = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""),'base64');

			const newUser = new User({
			    fullName,
				email: email.toLowerCase(),
				password,
				birthdate,
				hometown,
				username,
				profilePic: generatedID,
				id: uuidv4()
			});

			const collection = db.collection("users");

			collection.findOne({ email }).then((user) => {
				console.log(user);
				if (user) {
					res.json({
						message: "User FOUND - User has already registered with this email."
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
						  	res.json({
								message: "Successfully registered!",
								data: doc,
								image: generatedID
							})
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