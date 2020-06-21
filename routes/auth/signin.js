const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");

mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
	router.post("/", (req, res) => {
		// deconstruct response body
		if (req.body.phoneNumber) {

			const { phoneNumber, password } = req.body;

			const collection = db.collection("users");

			console.log("req.body", req.body);

			collection.findOne({ phoneNumber }).then((user) => {

				console.log(user);

				if (user) {
					if (user.phoneNumber === phoneNumber && user.password === password) {
						res.json({
							message: "User FOUND!",
							user
						})
					} else {
						res.json({
							message: "Password/email did match our records..."
						})
					}
				} else {
					res.json({
						message: "User could NOT be found..."
					})
				}
			})
		} else if (req.body.email) {

			const { email, password } = req.body;

			const collection = db.collection("users");

			console.log("req.body", req.body);

			collection.findOne({ email: email.toLowerCase() }).then((user) => {
				console.log(user);
				if (user) {
					if (user.email === email.toLowerCase() && user.password === password) {
						res.json({
							message: "User FOUND!",
							user
						})
					} else {
						res.json({
							message: "Password/email did match our records..."
						})
					}
				} else {
					res.json({
						message: "User could NOT be found..."
					})
				}
			})
		}
	});
});

module.exports = router;