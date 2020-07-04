const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");


mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
	router.post("/", (req, res) => {

			const { username, location } = req.body;

			const collection = db.collection("users");

			console.log("req.body", req.body);

			collection.findOneAndUpdate({ username }, { $set: { location }}, (err, doc) => {
				if (err) {
					console.log(err);
				} else {
					console.log(doc);
					res.json({
						message: "Successfully marked new location!",
						doc
					})				
				}
			});
	});
});

module.exports = router;