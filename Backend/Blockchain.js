const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');
const noncekey = "3091";

function Blockchain() {
	this.chain= [
	{
		index: 1,
		timestamp: 1722876442225,
		transactions: [ ],
		nonce: "0",
		hash: "0",
		previousBlockHash: "0"
	},
	{
		index: 2,
		timestamp: 1722876639492,
		transactions: [ ],
		nonce: 10301,
		hash: "3091e2980f1c45b1127dda7e445be434dc5ee24963bbd695a5e5c4f940b47ffc",
		previousBlockHash: "0"
	},
	{	index: 3,
		timestamp: 1722876671391,
		transactions: [
		{
		amount: 12.5,
		sender: "0000",
		recipient: "8e3dcab58957fa5f9678283142cd8c546c2023f168bd91436d3c9d65a2c9cfd3",
		transactionId: "d8670451534a11efa96981d4b1b363a9"
		}
		],
		nonce: 90265,
		hash: "309153cccd715885dba9404332cd9c868b7c89dd9f2133f13a470ec457186493",
		previousBlockHash: "3091e2980f1c45b1127dda7e445be434dc5ee24963bbd695a5e5c4f940b47ffc"
	},
	{
		index: 4,
		timestamp: 1722876673594,
		transactions: [
		{
		amount: 12.5,
		sender: "0000",
		recipient: "06ff600edb638322c9cb515ebf31fe0ad135000f21abdc9e1a013c39a45f2ce2",
		transactionId: "eb69cec1534a11efa96981d4b1b363a9"
		}
		],
		nonce: 4941,
		hash: "3091ab2a35b34c9a381fb8d13e5db455a66290a01216af5cb725e8e978e51be6",
		previousBlockHash: "309153cccd715885dba9404332cd9c868b7c89dd9f2133f13a470ec457186493"
	},
	{
		index: 5,
		timestamp: 1722876719020,
		transactions: [
		{
		amount: 12.5,
		sender: "0000",
		recipient: "06ff600edb638322c9cb515ebf31fe0ad135000f21abdc9e1a013c39a45f2ce2",
		transactionId: "ecb847c1534a11efa96981d4b1b363a9"
		}
		],
		nonce: 73570,
		hash: "30919b7fac688aa729d776213666c2f3e2d7e99be82a619cbaf6ee55c0af8906",
		previousBlockHash: "3091ab2a35b34c9a381fb8d13e5db455a66290a01216af5cb725e8e978e51be6"
	},
	{
		index: 6,
		timestamp: 1722876730516,
		transactions: [
		{
		amount: 12.5,
		sender: "0000",
		recipient: "06ff600edb638322c9cb515ebf31fe0ad135000f21abdc9e1a013c39a45f2ce2",
		transactionId: "07cc5921534b11efa96981d4b1b363a9"
		}
		],
		nonce: 8296,
		hash: "309100a7f471727fc47b20adee37da4501341e40e3db1ebf08226b89068dcb81",
		previousBlockHash: "30919b7fac688aa729d776213666c2f3e2d7e99be82a619cbaf6ee55c0af8906"
	},
	{
		index: 7,
		timestamp: 1722876735958,
		transactions: [
		{
		amount: 12.5,
		sender: "0000",
		recipient: "06ff600edb638322c9cb515ebf31fe0ad135000f21abdc9e1a013c39a45f2ce2",
		transactionId: "0ea60a71534b11efa96981d4b1b363a9"
		}
		],
		nonce: 158,
		hash: "3091b2e6790249b1193fb1ad4db175f6f636d8525e20f9add0aee9b713c59c10",
		previousBlockHash: "309100a7f471727fc47b20adee37da4501341e40e3db1ebf08226b89068dcb81"
	},
	{
		index: 8,
		timestamp: 1722876752133,
		transactions: [
		{
		amount: 12.5,
		sender: "0000",
		recipient: "06ff600edb638322c9cb515ebf31fe0ad135000f21abdc9e1a013c39a45f2ce2",
		transactionId: "11e41e71534b11efa96981d4b1b363a9"
		}
		],
		nonce: 155104,
		hash: "30912168218168b0fc3c3d3537c8ff0e1915161a6b22997b6d8e4c5dd52c7c7e",
		previousBlockHash: "3091b2e6790249b1193fb1ad4db175f6f636d8525e20f9add0aee9b713c59c10"
	}
	],
	this.pendingTransactions= [
	{
		amount: 12.5,
		sender: "0000",
		recipient: "06ff600edb638322c9cb515ebf31fe0ad135000f21abdc9e1a013c39a45f2ce2",
		transactionId: "1b8a0f20534b11efa96981d4b1b363a9"
	}
	],
	this.currentNodeUrl = currentNodeUrl;
	this.networkNodes = [];

	this.createNewBlock("0","0","0");
	// this.createNewBlock(noncekey, '0', this.hashBlock(0,0,noncekey));
};


Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransactions,
		nonce: nonce,
		hash: hash,
		previousBlockHash: previousBlockHash
	};

	this.pendingTransactions = [];
	this.chain.push(newBlock);

	return newBlock;
};


Blockchain.prototype.getLastBlock = function() {
	return this.chain[this.chain.length - 1];
};


Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient,
		transactionId: uuid().split('-').join('')
	};
	return newTransaction;
};


Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
	let transactionData={
		amount: transactionObj.amount,
            sender: transactionObj.sender,
            recipient: transactionObj.recipient,
            transactionId: uuid().split('-').join('')
	}
	this.pendingTransactions.push(transactionData);
	return this.getLastBlock()['index'] + 1;	
};


Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
};


Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	let dem =1;
	while (hash.substring(0, noncekey.length) !== noncekey) {
		console.log("Dem : "+dem++)
		nonce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	}

	return nonce;
};



Blockchain.prototype.chainIsValid = function(blockchain) {
	let validChain = true;
	// browser elements
	for (var i = 1; i < blockchain.length; i++) {
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];
		const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);
		//check key is valid
		if (blockHash.substring(0, noncekey.length) !== noncekey) validChain = false;
		//check previous Block Hash
		if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
	};

	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;

	if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;

	return validChain;
};


Blockchain.prototype.getBlock = function(blockHash) {
	let correctBlock = null;
	this.chain.forEach(block => {
		if (block.hash === blockHash) correctBlock = block;
	});
	return correctBlock;
};


Blockchain.prototype.getTransaction = function(transactionId) {
	let correctTransaction = null;
	let correctBlock = null;

	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.transactionId === transactionId) {
				correctTransaction = transaction;
				correctBlock = block;
			};
		});
	});

	return {
		transaction: correctTransaction,
		block: correctBlock
	};
};


Blockchain.prototype.getAddressData = function(address) {
	const addressTransactions = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if(transaction.sender === address || transaction.recipient === address) {
				addressTransactions.push(transaction);
			};
		});
	});

	let balance = 0;
	addressTransactions.forEach(transaction => {
		if (transaction.recipient === address) balance += transaction.amount;
		else if (transaction.sender === address) balance -= transaction.amount;
	});

	return {
		addressTransactions: addressTransactions,
		addressBalance: balance
	};
};


Blockchain.prototype.getAllAddressData = function(address) {
	const addressTransactions = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if(transaction.sender === address || transaction.recipient === address) {
				addressTransactions.push(transaction);
			};
		});
	});

	this.pendingTransactions.forEach(transaction => {
		if(transaction.sender === address || transaction.recipient === address) {
                  addressTransactions.push(transaction);
            };
	})

	let balance = 0;
	addressTransactions.forEach(transaction => {
		if (transaction.recipient === address) balance += transaction.amount;
		else if (transaction.sender === address) balance -= transaction.amount;
	});

	return {
		addressTransactions: addressTransactions,
		addressBalance: balance
	};
};






module.exports = Blockchain;














