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
const toBuffer = require('blob-to-buffer');

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

    	if (err) {
    		console.log(err)
    	}

    	const { videoBASE64, username } = req.body;

    	// console.log("REQQQQ-BODY :", req.body);

    	// var data = fs.readFileSync(videoBASE64);

        const generated = uuidv4(); 

        const collection = db.collection("users");

        collection.findOne({ username }).then((user) => {
        	if (user) {

        		if (!user.wall) {
        			user["wall"] = [{
        				id: uuidv4(),
        				date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        				videoID: generated,
        				shareable: true,
        				likes: [],
        				replies: [],
        				author: username
        			}]
        		} else {
        			user.wall.push({
        				id: uuidv4(),
        				date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        				videoID: generated,
        				shareable: true,
        				likes: [],
        				replies: [],
        				author: username
        			})
        		}

				// function to create file from base64 encoded string
				const base64_decode = (base64str, file) => {
				    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
				    var bitmap = new Buffer(base64str, 'base64');
				    // write buffer to file
				   	fs.writeFileSync(file, bitmap);
				    console.log('******** File created from base64 encoded string ********', `${process.cwd()}/assets/images/${generated}.mp4`);

				    fs.readFile(`${process.cwd()}/assets/images/${generated}.mp4`, (err, data) => {
					  	if (err) { 
					  		console.log(err);
					  		throw err;
					  	}

						  	s3.putObject({
							  Body: data,
							  Bucket: "rating-people",
							  Key: generated,
							  ContentEncoding: 'base64',
							  ContentType: 'video/mp4'
							}
							, (err, data) => {
							  if (err) {
							     console.log(err);
							  }
							  console.log("JACKPOT : ", data);
							  if (data) {
							  	collection.save(user);
							  	res.json({
							  		message: "GREAT SUCCESS - Video uploaded..."
							  	})
							  }
							});

					});
				}
				// convert base64 string back to image 
				base64_decode(videoBASE64, `assets/images/${generated}.mp4`);


        		// const bodyStream = fs.createReadStream(videoBASE64);

        		// console.log("BodyStream :", bodyStream);

    //     		s3.putObject({
				//   Body: bodyStream,
				//   Bucket: "rating-people",
				//   Key: generated,
				//   ContentEncoding: 'base64',
				//   ContentType: 'video/mp4'
				// }
				// , (err, data) => {
				//   if (err) {
				//      console.log(err);
				//   }
				//   // console.log("JACKPOT : ", data);
				// });

        		// Setting up S3 upload parameters
				// const params = {
				//     Bucket: "rating-people",
				//     Key: 'cat.jpg', // File name you want to save as in S3
				//     Body: fileContent
				// };

				// console.log("USER :", user);

				// // Uploading files to the bucket
				// s3.upload(params, (err, data) => {
				//     if (err) {
				//         throw err;
				//     }
				//     console.log(`File uploaded successfully. ${data.Location}`);
				// });
        	} else {
        		res.json({
        			message: "User could NOT be found."
        		})
        	}
        }).catch((err) => {
        	console.log(err);
        })

		
    });
});

module.exports = router;

