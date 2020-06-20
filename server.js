const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoDB = require("./config/db.js");
const cors = require("cors");
const path = require("path");
const config = require("config");

mongoDB();

app.use('*', cors());

app.use(express.json());
app.use(express.urlencoded({
	extended: true
})); 



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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}!`);
});