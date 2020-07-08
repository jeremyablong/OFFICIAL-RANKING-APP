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

		const { username, reaction, otherUser, id, date, message } = req.body;

		const collection = db.collection("users");

		console.log("req.bodyyyyyyyyyyy", req.body);

		collection.find({ $or: [ { username: username }, { username: otherUser } ] }).toArray((err, users) => {
			if (err) {
				console.log(err);
			}
			for (let x = 0; x < users.length; x++) {
				let user = users[x];
				// console.log("U:", user);
				// console.log("USAAAAAA :", user);
				if (user.username === username) {
					for (let z = 0; z < user.messages.length; z++) {
						let messageThread = user.messages[z];
						console.log("messageThread :", messageThread);
						if (messageThread.id === id) {
							if (id === messageThread.id && message === messageThread.message && date === messageThread.date) {
								if (messageThread.reactions) {
									// add one to emoji reaction count if already exists
									messageThread.reactions[reaction] += 1;
									// save changes
									collection.save(user);
								} else {
									switch (reaction) {
									  case "laugh":
									    console.log("LAUGH.");
									    // create reactions object key if not existant
										messageThread["reactions"] = {
											laugh: 1,
											heartFace: 0,
											frustrated: 0,
											heart: 0,
											angry: 0,
											sad: 0,
											puke: 0
										}
									    break;
									  case "heartFace":
									    console.log("HEART FACE.");
									    // create reactions object key if not existant
										messageThread["reactions"] = {
											laugh: 0,
											heartFace: 1,
											frustrated: 0,
											heart: 0,
											angry: 0,
											sad: 0,
											puke: 0
										}
									    break;
									  case "frustrated":
									    console.log("FRUSTRATED");
									    // create reactions object key if not existant
										messageThread["reactions"] = {
											laugh: 0,
											heartFace: 0,
											frustrated: 1,
											heart: 0,
											angry: 0,
											sad: 0,
											puke: 0
										}
									    break;
									  case "heart":
									    console.log("HEART.");
									    // create reactions object key if not existant
										messageThread["reactions"] = {
											laugh: 0,
											heartFace: 0,
											frustrated: 0,
											heart: 1,
											angry: 0,
											sad: 0,
											puke: 0
										}
									    break;
									  case "angry":
									    console.log("ANGRY");
									    // create reactions object key if not existant
										messageThread["reactions"] = {
											laugh: 0,
											heartFace: 0,
											frustrated: 0,
											heart: 0,
											angry: 1,
											sad: 0,
											puke: 0
										}
									    break;
									  case "sad":
									    console.log("SAD");
									    // create reactions object key if not existant
										messageThread["reactions"] = {
											laugh: 0,
											heartFace: 0,
											frustrated: 0,
											heart: 0,
											angry: 0,
											sad: 1,
											puke: 0
										}
									    break;
									  case "puke":
									    console.log("PUKED");
									    // create reactions object key if not existant
										messageThread["reactions"] = {
											laugh: 0,
											heartFace: 0,
											frustrated: 0,
											heart: 0,
											angry: 0,
											sad: 0,
											puke: 1
										}
									    break;
									  default:
									    console.log("none matched...");
									}
									// save
									collection.save(user);
								}
							} else if (messageThread.replies) {
								console.log("messageThread.replies :", messageThread.replies);
								for (var q = 0; q < messageThread.replies.length; q++) {
									let individiual = messageThread.replies[q];
									if (individiual.id === id && message === individiual.message) {
										console.log("individiual ONE", individiual);
										if (individiual.reactions) {
											individiual.reactions[reaction] += 1;
											// save changes
											collection.save(user);
										} else {
											switch (reaction) {
											  	case "laugh":
												    console.log("LAUGH.");
												    // create reactions object key if not existant
													individiual["reactions"] = {
														laugh: 1,
														heartFace: 0,
														frustrated: 0,
														heart: 0,
														angry: 0,
														sad: 0,
														puke: 0
													}
												    break;
												  case "heartFace":
												    console.log("HEART FACE.");
												    // create reactions object key if not existant
													individiual["reactions"] = {
														laugh: 0,
														heartFace: 1,
														frustrated: 0,
														heart: 0,
														angry: 0,
														sad: 0,
														puke: 0
													}
												    break;
												  case "frustrated":
												    console.log("FRUSTRATED");
												    // create reactions object key if not existant
													individiual["reactions"] = {
														laugh: 0,
														heartFace: 0,
														frustrated: 1,
														heart: 0,
														angry: 0,
														sad: 0,
														puke: 0
													}
												    break;
												  case "heart":
												    console.log("HEART.");
												    // create reactions object key if not existant
													individiual["reactions"] = {
														laugh: 0,
														heartFace: 0,
														frustrated: 0,
														heart: 1,
														angry: 0,
														sad: 0,
														puke: 0
													}
												    break;
												  case "angry":
												    console.log("ANGRY");
												    // create reactions object key if not existant
													individiual["reactions"] = {
														laugh: 0,
														heartFace: 0,
														frustrated: 0,
														heart: 0,
														angry: 1,
														sad: 0,
														puke: 0
													}
												    break;
												  case "sad":
												    console.log("SAD");
												    // create reactions object key if not existant
													individiual["reactions"] = {
														laugh: 0,
														heartFace: 0,
														frustrated: 0,
														heart: 0,
														angry: 0,
														sad: 1,
														puke: 0
													}
												    break;
												  case "puke":
												    console.log("PUKED");
												    // create reactions object key if not existant
													individiual["reactions"] = {
														laugh: 0,
														heartFace: 0,
														frustrated: 0,
														heart: 0,
														angry: 0,
														sad: 0,
														puke: 1
													}
												    break;
											  default:
											    console.log("none matched...");
											}
											collection.save(user);
										}
									} 
								}
							}
						}
					}

				}
				if (user.username === otherUser) {
					for (let i = 0; i < user.messages.length; i++) {
						let messageThread = user.messages[i];
						if (messageThread.id === id) {
							if (id === messageThread.id && message === messageThread.message && date === messageThread.date) {
								if (messageThread.reactions) {
									// add one to emoji reaction count if already exists
									messageThread.reactions[reaction] += 1;
									// save changes
									collection.save(user);
								} else {
									switch (reaction) {
									  case "laugh":
									    console.log("LAUGH.");
									    // create reactions object key if not existant
										messageThread["reactions"] = {
											laugh: 1,
											heartFace: 0,
											frustrated: 0,
											heart: 0,
											angry: 0,
											sad: 0,
											puke: 0
										}
									    break;
									  case "heartFace":
									    console.log("HEART FACE.");
									    // create reactions object key if not existant
										messageThread["reactions"] = {
											laugh: 0,
											heartFace: 1,
											frustrated: 0,
											heart: 0,
											angry: 0,
											sad: 0,
											puke: 0
										}
									    break;
									  case "frustrated":
									    console.log("FRUSTRATED");
									    // create reactions object key if not existant
										messageThread["reactions"] = {
											laugh: 0,
											heartFace: 0,
											frustrated: 1,
											heart: 0,
											angry: 0,
											sad: 0,
											puke: 0
										}
									    break;
									  case "heart":
									    console.log("HEART.");
									    // create reactions object key if not existant
										messageThread["reactions"] = {
											laugh: 0,
											heartFace: 0,
											frustrated: 0,
											heart: 1,
											angry: 0,
											sad: 0,
											puke: 0
										}
									    break;
									  case "angry":
									    console.log("ANGRY");
									    // create reactions object key if not existant
										messageThread["reactions"] = {
											laugh: 0,
											heartFace: 0,
											frustrated: 0,
											heart: 0,
											angry: 1,
											sad: 0,
											puke: 0
										}
									    break;
									  case "sad":
									    console.log("SAD");
									    // create reactions object key if not existant
										messageThread["reactions"] = {
											laugh: 0,
											heartFace: 0,
											frustrated: 0,
											heart: 0,
											angry: 0,
											sad: 1,
											puke: 0
										}
									    break;
									  case "puke":
									    console.log("PUKED");
									    // create reactions object key if not existant
										messageThread["reactions"] = {
											laugh: 0,
											heartFace: 0,
											frustrated: 0,
											heart: 0,
											angry: 0,
											sad: 0,
											puke: 1
										}
									    break;
									  default:
									    console.log("none matched...");
									}
									// save
									collection.save(user);
								}
							}  else if (messageThread.replies) {
									console.log("messageThread.replies :", messageThread.replies);
									for (var q = 0; q < messageThread.replies.length; q++) {
										let individiual = messageThread.replies[q];
										console.log("INDIVIDUAL :", individiual);
										console.log("REQ.BODY :", req.body);
										console.log(individiual.id, individiual.date, individiual.message)
										if (individiual.id === id && message === individiual.message) {
											console.log("individiual TWO", individiual);
											if (individiual.reactions) {
												individiual.reactions[reaction] += 1;
												// save changes
												collection.save(user);
											} else {
												switch (reaction) {
												  	case "laugh":
													    console.log("LAUGH.");
													    // create reactions object key if not existant
														individiual["reactions"] = {
															laugh: 1,
															heartFace: 0,
															frustrated: 0,
															heart: 0,
															angry: 0,
															sad: 0,
															puke: 0
														}
													    break;
													  case "heartFace":
													    console.log("HEART FACE.");
													    // create reactions object key if not existant
														individiual["reactions"] = {
															laugh: 0,
															heartFace: 1,
															frustrated: 0,
															heart: 0,
															angry: 0,
															sad: 0,
															puke: 0
														}
													    break;
													  case "frustrated":
													    console.log("FRUSTRATED");
													    // create reactions object key if not existant
														individiual["reactions"] = {
															laugh: 0,
															heartFace: 0,
															frustrated: 1,
															heart: 0,
															angry: 0,
															sad: 0,
															puke: 0
														}
													    break;
													  case "heart":
													    console.log("HEART.");
													    // create reactions object key if not existant
														individiual["reactions"] = {
															laugh: 0,
															heartFace: 0,
															frustrated: 0,
															heart: 1,
															angry: 0,
															sad: 0,
															puke: 0
														}
													    break;
													  case "angry":
													    console.log("ANGRY");
													    // create reactions object key if not existant
														individiual["reactions"] = {
															laugh: 0,
															heartFace: 0,
															frustrated: 0,
															heart: 0,
															angry: 1,
															sad: 0,
															puke: 0
														}
													    break;
													  case "sad":
													    console.log("SAD");
													    // create reactions object key if not existant
														individiual["reactions"] = {
															laugh: 0,
															heartFace: 0,
															frustrated: 0,
															heart: 0,
															angry: 0,
															sad: 1,
															puke: 0
														}
													    break;
													  case "puke":
													    console.log("PUKED");
													    // create reactions object key if not existant
														individiual["reactions"] = {
															laugh: 0,
															heartFace: 0,
															frustrated: 0,
															heart: 0,
															angry: 0,
															sad: 0,
															puke: 1
														}
													    break;
												  default:
												    console.log("none matched...");
												}
												collection.save(user);
											}
										}
									}
								}
						}
					}
				}
			}
		});
	});
});

module.exports = router;