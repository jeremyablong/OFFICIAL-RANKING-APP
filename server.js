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
const fs = require('fs');
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const rp = require("request-promise");
const { v4: uuidv4 } = require('uuid');
const nodeAddress = uuidv4().split("-").join("");
// !important stuff...
const PORT = process.env.PORT || 5000;
const mongoDB = require("./config/db.js");
const paypal = require("paypal-rest-sdk");

mongoDB();

paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id:
        "AXePa0bR0DgSMIh8yphFqnY4i45QQ1KaY8jgG2hYX-WrKXwPvRDLi09DaarchpIFMVg68GTsws-9zCMo",
    client_secret:
        "EFGL6IiWX96C8GioXm6yyIsXRUXch_32KxoVismUz51-QTBFAGdvJr5TD7lBG936L0R6aV195EnMJJMu"
});


app.use('*', cors());

app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: false
}));
app.use(bodyParser.json({
	limit: "50mb"
}));

const publicDir = path.join(process.cwd(), "/assets/images");

app.use(express.static(publicDir));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true }));

app.use("/register/user", require("./routes/auth/register.js"));
app.use("/login", require("./routes/auth/signin.js"));
app.use("/gather/all/profiles", require("./routes/gatherAllUsers.js"));
app.use("/get/user/by/username", require("./routes/singleUser/getSingleUser.js"));
app.use("/get/specific/user", require("./routes/specificUserRoutes/getSpecificUser.js"));
app.use("/send/private/message", require("./routes/messages/send/sendMessage.js"));
app.use("/get/user/by/username/filter", require("./routes/messages/gather/gatherAndSort.js"));
app.use("/get/individual/messages", require("./routes/messages/individual/findIndividualMsgs.js"));
app.use("/post/replay/message/thread", require("./routes/messages/send/sendReply.js"));
app.use("/get/message/reciever", require("./routes/messages/gather/getReciever.js"));
app.use("/get/first/message/private", require("./routes/messages/individual/getFirstMessage.js"));
app.use("/get/last/message", require("./routes/messages/gather/getLastMsg.js"));
app.use("/upload/cover/photo", require("./routes/coverPhoto/uploadCoverPhoto.js"));
app.use("/post/profile/pic/comment", require("./routes/comments/profile/profilePic.js"));
app.use("/gather/profile/pic/comments", require("./routes/comments/profile/getProfilePicComments.js"));
app.use("/react/to/profile/picture", require("./routes/profile/reaction/index.js"));
app.use("/post/new/profile/picture/page", require("./routes/profile/pictures/uploadProfilePictureAgain.js"));
app.use("/organize/single/user/data", require("./routes/singleUser/organizeSingleUser.js"));
app.use("/gather/profile/pictures/gallery", require("./routes/profile/pictures/gatherAllPictureGallery.js"));
app.use("/gather/profile/pictures/gallery/slide", require("./routes/profile/pictures/findByIndex.js"));
app.use("/like/subcomment/respond", require("./routes/profile/pictures/galleryLikeComment.js"));
app.use("/latest/profile/picture/unlike", require("./routes/profile/pictures/latestProfilePicRemoveLike.js"));
app.use("/gather/notifications", require("./routes/notifications/gatherNotifications.js"));
app.use("/post/location/moving/geolocation", require("./routes/location/postNewLocation.js"));
app.use("/create/wall/posting", require("./routes/wall/updateWall.js")); 
app.use("/gather/wall/posts/all", require("./routes/wall/homeWall/gatherWallPostings.js"));
app.use("/send/friend/request", require("./routes/friends/send/sendFriendRequest.js"));
app.use("/remove/notification", require("./routes/notifications/removeNotification.js"));
app.use("/accept/friend/request", require("./routes/friends/respond/acceptFriendRequest.js"));
app.use("/reaction/individual/message", require("./routes/messages/reaction/reactToMessage.js"));
app.use("/mark/notification/viewed", require("./routes/notifications/viewed.js"));
app.use("/decline/friend/request", require("./routes/friends/respond/declineFriendRequest.js"));
app.use("/paypal", require("./routes/paypal/payment.js"));
app.use("/cancel", require("./routes/paypal/cancel.js"));
app.use("/success", require("./routes/paypal/success.js"));


app.get("/blockchain", (req, res) => {
  res.send(gemshire);
});

app.post("/receive-new-block", (req, res) => {
  const { newBlock } = req.body;
  const lastBlock = gemshire.getLastBlock();
  
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock["index"] + 1 === newBlock["index"];

  if (correctHash && correctIndex) {
    gemshire.chain.push(newBlock);
    gemshire.pendingTransactions = [];
    res.json({
      note: "New block received and accepted.",
      newBlock
    })
  } else {
    res.json({
      note: "New block rejected.",
      newBlock
    })
  }

})

app.get("/mine", (req, res) => {

      const lastBlock = gemshire.getLastBlock();

      const previousBlockHash = lastBlock["hash"];

      const currentBlockData = {
        transactions: gemshire.pendingTransactions,
        index: lastBlock["index"] + 1
      }

      const nounce = gemshire.proofOfWork(previousBlockHash, currentBlockData);
    
      const blockHash = gemshire.hashBlock(previousBlockHash, currentBlockData, nounce);

      const newBlock = gemshire.createNewBlock(nounce, previousBlockHash, blockHash);

      const requestPromises = [];

      gemshire.networkNodes.forEach((networkNodeUrl) => {
        const requestOptions = {
          uri: networkNodeUrl + "/receive-new-block",
          method: "POST",
          body: { newBlock },
          json: true
        };

        requestPromises.push(rp(requestOptions));
      })

      Promise.all(requestPromises).then((data) => {
        const requestOptions = {
          uri: gemshire.currentNodeUrl + "/transaction/broadcast",
          method: "POST",
          body: {
            amount: 12.5,
            sender: "00",
            recipient: nodeAddress
          },
          json: true
        }

        return rp(requestOptions);
      }).then((data) => {
        res.json({
          note: "New block mined successfully",
          block: newBlock
        })
      })
});

app.get("/consensus", (req, res) => {
  const requestPromises = [];

  gemshire.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = { 
      uri: networkNodeUrl + "/blockchain",
      method: "GET",
      json: true
    };
    requestPromises.push(rp(requestOptions));
  });
  Promise.all(requestPromises).then((blockchains) => {
    const currentChainLength = gemshire.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;
      
    blockchains.forEach((blockchain) => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

    if (!newLongestChain || (newLongestChain && !gemshire.chainIsValid(newLongestChain))) {
      res.json({
        note: "Current chain has not been replaced.",
        chain: gemshire.chain
      })
    } else if (newLongestChain && gemshire.chainIsValid(newLongestChain)) {
      gemshire.chain = newLongestChain;
      gemshire.pendingTransactions = newPendingTransactions;
      res.json({
        note: "This chain has been replaced",
        chain: gemshire.chain
      })
    }
  });
});

// register a node and broadcast to network
app.post("/register-and-broadcast-node", (req, res) => {
  const { newNodeUrl } = req.body;

  if (gemshire.networkNodes.indexOf(newNodeUrl) == -1 && gemshire.currentNodeUrl !== newNodeUrl) {
      console.log("ran 3");
      gemshire.networkNodes.push(newNodeUrl);
  }
  const regNodesPromises = [];
  gemshire.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true
    }
    regNodesPromises.push(rp(requestOptions));
  });
 
  Promise.all(regNodesPromises).then((data) => {
    // do operations
    const bulkRegisterOptions = {
      uri: newNodeUrl + "/register-nodes-bulk",
      method: "POST",
      body: { allNetworkNodes: [...gemshire.networkNodes, gemshire.currentNodeUrl] },
      json: true
    };

    return rp(bulkRegisterOptions);
  }).then((data) => {
    console.log("DATA :", data);
    res.json({ note: data.note })
  });
});
// register node with the network
app.post("/register-node", (req, res) => {
  console.log("req.body.newNodeUrl", req.body.newNodeUrl, gemshire.currentNodeUrl);
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = gemshire.networkNodes.indexOf(newNodeUrl) === -1;
  const notCurrentNode = gemshire.currentNodeUrl === newNodeUrl;

  if (nodeNotAlreadyPresent && !notCurrentNode) {
    console.log("ran 1");
    gemshire.networkNodes.push(newNodeUrl);
  }
  res.json({
    note: "New node registered successfully."
  })
});
app.post("/transaction", (req, res) => {
  const newTransaction = req.body;

  const blockIndex = gemshire.addTransactionToPendingTransactions(newTransaction);

  res.json({
    note: `Transaction will be added in block ${blockIndex}`
  })
})
app.post('/transaction/broadcast', (req, res) => {
  const { amount, sender, recipient } = req.body;

  const newTransaction = gemshire.createNewTransaction(amount, sender, recipient);

  gemshire.addTransactionToPendingTransactions(newTransaction);

  const requestPromises = [];

  gemshire.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then((data) => {
    res.json({
      note: "Transaction created and broadcasted successfully."
    })
  })
});
// register multiple nodes at once
app.post("/register-nodes-bulk", (req, res) => {
  const allNetworkNodes = req.body.allNetworkNodes;

  allNetworkNodes.forEach((networkNodeUrl) => {
    console.log("allNetworkNodes", allNetworkNodes);
    const nodeNotAlreadyPresent = gemshire.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = gemshire.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) {
      console.log("Ran 2");
      gemshire.networkNodes.push(networkNodeUrl);
    }
  });
  res.json({
    note: "Bulk registration successful."
  }) 
});

app.get("/block/:blockHash", (req, res) => {
  const blockHash = req.params.blockHash;
  const correctBlock = gemshire.getBlock(blockHash);
  res.json({
    block: correctBlock
  })
});

app.get("/transaction/:transactionId", (req, res) => {
  const transactionId = req.params.transactionId;

  const transactionData = gemshire.getTransaction(transactionId);

  res.json({
    transaction: transactionData.transaction,
    block: transactionData.block
  })
});

app.get("/address/:address", (req, res) => {
  const address = req.params.address;
  const addressData = gemshire.getAddressData(address);

  res.json({
    addressData
  })
});



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