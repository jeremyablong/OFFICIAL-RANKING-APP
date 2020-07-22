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

		const mugshotUUID = uuidv4();

		const { confirmationPhoto } = req.body;

		console.log("req.body --------- :", req.body)
		
		const bufferImageTwo = new Buffer(confirmationPhoto.replace(/^data:image\/\w+;base64,/, ""),'base64');

		// deconstruct response body
		if (req.body.phoneNumber) {

			const { phoneNumber, password, confirmationPhoto } = req.body;

			const collection = db.collection("users");

			console.log("req.body", req.body);

			collection.findOne({ phoneNumber }).then((user) => {

				console.log(user);

				if (user) {
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
					    if (user.phoneNumber === phoneNumber && user.password === password) {
							res.json({
								message: "User FOUND!",
								image: mugshotUUID,
								user
							})
						} else {
							res.json({
								message: "Password/email did match our records..."
							})
						}
					  	
					});
				} else {
					res.json({
						message: "User could NOT be found..."
					})
				}
			}).catch((err) => {
				console.log(err);
			})
		} else if (req.body.email) {

			const { email, password, confirmationPhoto } = req.body;

			const collection = db.collection("users");

			const lowerCaseEmail = email.toLowerCase();

			console.log("req.body", lowerCaseEmail);

			collection.findOne({ email: lowerCaseEmail.trim() }).then((user) => {
				console.log(user);
				if (user) {
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
					  	if (user.email === email.toLowerCase().trim() && user.password === password) {
							res.json({
								message: "User FOUND!",
								image: mugshotUUID,
								user
							})
						} else {
							res.json({
								message: "Password/email did match our records..."
							})
						}
					});
				} else {
					res.json({
						message: "User could NOT be found..."
					})
				}
			}).catch((err) => {
				console.log(err)
			})
		}
	});
});

module.exports = router;