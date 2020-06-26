// import usable modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const config = require("config");
const http = require("http");
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

// !important stuff...
const PORT = process.env.PORT || 5000;
const mongoDB = require("./config/db.js");

mongoDB();

app.use('*', cors());

app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: false
}));
app.use(bodyParser.json({
	limit: "50mb"
}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true }));

app.use("/register/user", require("./routes/auth/register.js"));
app.use("/login", require("./routes/auth/signin.js"));
app.use("/gather/all/profiles", require("./routes/gatherAllUsers.js"));
app.use("/get/user/by/username", require("./routes/singleUser/getSingleUser.js"));
app.use("/get/specific/user", require("./routes/specificUserRoutes/getSpecificUser.js"));
app.use("/send/private/message", require("./routes/messages/send/sendMessage.js"));
// app.use("/get/each/user/picture", require("./routes/general/getUsersPhotos.js"));
app.use("/get/user/by/username/filter", require("./routes/messages/gather/gatherAndSort.js"));
app.use("/get/individual/messages", require("./routes/messages/individual/findIndividualMsgs.js"));
app.use("/post/replay/message/thread", require("./routes/messages/send/sendReply.js"));
app.use("/get/message/reciever", require("./routes/messages/gather/getReciever.js"));
app.use("/get/first/message/private", require("./routes/messages/individual/getFirstMessage.js"));
app.use("/get/last/message", require("./routes/messages/gather/getLastMsg.js"));
app.use("/upload/cover/photo", require("./routes/coverPhoto/uploadCoverPhoto.js"));

app.get('*', cors(), function(_, res) {
  res.sendFile(__dirname, './client/build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    };
  };
});

app.get('/*', cors(), function(_, res) {
  res.sendFile(__dirname, './client/build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    };
  };
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

if (process.env.NODE_ENV === "production") {
	// Express will serve up production files
	app.use(express.static("client/build"));
	// serve up index.html file if it doenst recognize the route
	app.get('*', cors(), function(_, res) {
	  res.sendFile(__dirname, './client/build/index.html'), function(err) {
	    if (err) {
	      res.status(500).send(err)
	    }
	  }
	})
	app.get('/*', cors(), function(_, res) {
	  res.sendFile(path.join(__dirname, './client/build/index.html'), function(err) {
	    if (err) {
	      res.status(500).send(err)
	    }
	  })
	})
}; 


io.on("connection", (socket) => {

  console.log("New client connected");

  socket.on("messaged", (data) => {

    console.log("DATA SOCKET.IO :", data);

    if (data.update === true) {
    	console.log("PUNTING....");
    	io.sockets.emit("message", data);
    }

  })
  socket.on("disconnect", () => {

  	console.log("Client disconnected");

  });
});

server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}!`);
});