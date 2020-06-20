const config = require("config");
const db = config.get("mongoURI");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

mongoose.set('useCreateIndex', true);

const connectDB = async () => {
	try {
		await mongoose.connect(db, { 
			useNewUrlParser: true
		});

		console.log("MongoDB Connected!");

	} catch (err) {
		
		console.log(err.message);

		process.exit(1);
	}
};
module.exports = connectDB;