const sha256 = require("sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const currentNodeUrl = process.argv[3];
const uuid = require("uuid/v4");

class Blockchain {
	constructor () {
		this.chain = [];
		this.newTransactions = [];

		this.currentNodeUrl = currentNodeUrl;

		this.networkNodes = [];

		this.createNewBlock(100, "0", "0");
	}
}


Blockchain.prototype.createNewBlock = function (nounce, previousBlockHash, hash) {
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransactions,
		nounce: nounce,
		hash: hash,
		previousBlockHash: previousBlockHash
	};

	this.pendingTransactions = [];

	this.chain.push(newBlock);

	return newBlock;
}


Blockchain.prototype.getLastBlock = function () {
	return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
	const newTransaction = {
		amount,
		sender,
		recipient,
		transactionId: uuid().split("-").join("")
	};

	return newTransaction;
};

Blockchain.prototype.addTransactionToPendingTransactions = function (transactionObj) {
	this.pendingTransactions.push(transactionObj);
	return this.getLastBlock()["index"] + 1;
}

Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nounce) {
	const dataAsString = previousBlockHash + nounce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
};


Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
	let nounce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nounce);

	while (hash.substring(0, 4) !== "0000") {
		nounce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nounce);
	}

	return nounce;
}

Blockchain.prototype.chainIsValid = function (blockchain) {
	let validChain = true;

	for (var i = 1; i < blockchain.length; i++) {
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];  

		const blockHash = this.hashBlock(prevBlock["hash"], { transactions: currentBlock["transactions"], index: currentBlock["index"] }, currentBlock["nounce"]);
		if (blockHash.substring(0, 4) !== "0000") {
			validChain = false;
		}
		if (currentBlock["previousBlockHash"] !== prevBlock["hash"]) {
			validChain = false;
		}
	}
	const genisisBlock = blockchain[0];
	const correctNounce = genisisBlock["nounce"] === 100;
	const correctPreviousBlockHash = genisisBlock["previousBlockHash"] === "0";
	const correctHash = genisisBlock["hash"] === "0";
	const correctTransactions = genisisBlock.hasOwnProperty("transactions");

	if (!correctNounce || !correctPreviousBlockHash || !correctHash || correctTransactions) {
		validChain = false;
	}
	return validChain;
}

Blockchain.prototype.getBlock = function (blockHash) {
	let correctBlock = null;

	this.chain.forEach((block) => {
		if (block.hash === blockHash) {
			correctBlock = block;
		}
	});

	return correctBlock;
}

Blockchain.prototype.getTransaction = function (transactionId) {
	let correctTransaction = null;
	let correctBlock = null;

	console.log(this.chain);

	this.chain.slice(1).forEach((block) => {
		console.log(block);
		block.transactions.forEach((transaction) => {
			if (transaction.transactionId === transactionId) {
				correctTransaction = transaction;
				correctBlock = block;
			};
		});
	});

	return {
		transaction: correctTransaction,
		block: correctBlock
	}
}

Blockchain.prototype.getAddressData = function (address) {
	const addressTransactions = [];
	this.chain.slice(1).forEach((block) => {
		block.transactions.forEach((transaction) => {
			if (transaction.sender === address || transaction.recipient === address) {
				addressTransactions.push(transaction);
			}
		})
	});

	let balance = 0;

	addressTransactions.forEach((transaction) => {
		if (transaction.recipient === address) {
			balance += transaction.amount;
		} else if (transaction.sender === address) {
			balance -= transaction.amount;
		}
	});

	return {
		addressTransactions: addressTransactions,
		addressBalance: balance
	}
}

module.exports = Blockchain;





//
