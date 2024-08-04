const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./Blockchain');
const  Account = require('./Account');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');
const fs = require('fs');
let ejs = require('ejs');
var cookieSession = require("cookie-session");
var cookieParser = require('cookie-parser');
const session = require("express-session");
const path = require('path');
const axios = require('axios');

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "somesecret",
    cookie: { maxAge: 60000 },
  })
);
// const generateRandomString = require("./function/randomNonce");

// set the view engine to ejs
app.set('view engine', 'ejs');

const nodeAddress = uuid().split('-').join('');

const bitcoin = new Blockchain();
const account = new Account();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'files')));
app.use(cookieParser());

//page
app.get("/", (req, res, next) => {
	res.render("pages/index", { title: "Blockchain" });
})

app.get("/home", (req, res, next) => {
	res.render("pages/home", { title: "Blockchain", blockchain: bitcoin.chain, nodeAddress: nodeAddress });
})

app.get("/history", (req, res)=>{
	const cookiePrivateKey = req.cookies.privateKey;
	const cookiePublicKey = req.cookies.publicKey;
	if(cookiePrivateKey!=null && cookiePrivateKey.trim().length>0
		&& cookiePublicKey!=null && cookiePublicKey.trim().length>0){ 
      	const addressData= bitcoin.getAddressData(cookiePublicKey);
		console.log(addressData)
            res.render("pages/history", { title: "History ", addressData : addressData.addressTransactions});
      } else {
            res.redirect("/login");
      }});

app.get("/profileTransaction", (req, res)=>{
	const cookiePrivateKey = req.cookies.privateKey;
	const cookiePublicKey = req.cookies.publicKey;
	const coin = bitcoin.getAddressData(cookiePublicKey);
	if(cookiePrivateKey!=null && cookiePrivateKey.trim().length>0
		&& cookiePublicKey!=null && cookiePublicKey.trim().length>0){ 
			res.render("pages/transaction", { title: "Transaction ",coin : coin});
      } else {
            res.redirect("/login");
}});

app.post("/profileTransaction", (req, res)=>{
	const cookiePrivateKey = req.cookies.privateKey;
	const cookiePublicKey = req.cookies.publicKey;
	
	if(cookiePrivateKey!=null && cookiePrivateKey.trim().length>0
		&& cookiePublicKey!=null && cookiePublicKey.trim().length>0){ 
			console.log(`${port}/transaction/broadcast`)
			axios({
				method: 'post',
				url: `http://localhost:${port}/transaction/broadcast`,
				data: {
					amount:req.body.amount,
                              sender: cookiePublicKey,
                              recipient: req.body.recipient,
				}
			}).then((response)=>{
				console.log(response)
				res.status(200).send("Success send");
			}).catch((error)=>{
				console.log(error)
				res.status(400).send("Failed send");
			});
      } else {
            res.redirect("/login");
      }});

app.get("/profile", (req, res)=>{
	const cookiePrivateKey = req.cookies.privateKey;
	const cookiePublicKey = req.cookies.publicKey;	
	if(cookiePrivateKey!=null && cookiePrivateKey.trim().length>0
		&& cookiePublicKey!=null && cookiePublicKey.trim().length>0){ 
		const acc = account.getProfileAccountByPrivateKey(cookiePrivateKey);
		if(acc==null){
                  res.clearCookie("publicKey");
                  res.clearCookie("privateKey");
			res.redirect("/login");
            }
		console.log(acc)
            res.render("pages/profile", { title: "Profile", account :acc });
      } else {
            res.redirect("/login");
      }
});





app.get("/login", (req, res, next) => {
	res.render("pages/login", { title: "Login" });
});


app.get("/register", (req, res, next) => {
	res.render("pages/register", { title: "Blockchain",key:false,alert:"" });
})

app.post("/register", (req, res, next) => {
	const username = req.body.name;
	const password = req.body.password;
	const alert="Register Success";
	if(username==null || password==null) {
           alert="Register Failed";
	     res.render("pages/register", { 
		title: "Blockchain",
		alert:alert,
		key: false,
            });
      }
	else{
		const acc=account.createAccount(password, username);
		res.cookie("publicKey", acc.publicKey,{ maxAge: 900000, httpOnly: true });
		res.cookie("privateKey", acc.privateKey,{ maxAge: 900000, httpOnly: true });
		res.render("pages/register", { 
		title: "Blockchain",
		alert:alert,
		key: true,
		privateKey: acc.privateKey,
		publicKey:acc.publicKey,
		key01:acc.key01,
		key02:acc.key02,
            key03:acc.key03,
            key04:acc.key04,
            key05:acc.key05,
            key06:acc.key06,
            });
	}
	
})

app.post("/login", (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	console.log(username, password);
	if(username!=null && password!=null) {
		res.status(200).send("login Success")
	}
	else{
		res.status(404).send("login Failed")
	}
	// if(account.getAccountByPrimaryKeyAndPassword(req.body.username,req.body.password)){
      //       req.session.user = account.getAccountByPrimaryKeyAndPassword(req.body.privateKey,req.body.password);
      //       res.redirect('/dashboard');
      // }else{
      //       res.redirect('/login');
      // }
}
)

//account 
app.get('/account', function (req, res) {
  res.send(account);
});

app.post('/account/create', function(req, res) {
      const newAccount = account.createAccount(req.body.password, req.body.name);
      res.send(newAccount);
});

app.post('/account/login', function(req, res) {
	const acc = account.getAccountByPrimaryKeyAndPassword(req.body.privateKey,req.body.password)
	res.status(200).send(acc);
});

app.post('/account/change', function(req, res) {
	const privateKey = req.body.privateKey?req.body.privateKey:res.send("Account not found");
	const key01 = req.body.key01?req.body.key01:"";
	const key02 = req.body.key02?req.body.key02:"";
	const key03 = req.body.key03?req.body.key03:"";
	const key04 = req.body.key04?req.body.key04:"";
	const key05 = req.body.key05?req.body.key05:"";
	const key06 = req.body.key06?req.body.key06:"";
	let acc=account.getAccountByPrivateAndKeys(
		privateKey,
            key01,
            key02,
            key03,
            key04,
            key05,
            key06
	);
	
	if(acc==null){
		res.send("Account not found");
	}
	const password = req.body.password?req.body.password : "";
	const name = req.body.name?req.body.name :"";
	account.changeProfile(privateKey,password,name);
	res.send("Profile is changed")
});

app.post('/account/mine', function(req, res) {
	console.log("Account Mine")
	postMineBlock(req, res);
});



// get entire blockchain
app.get('/blockchain', function (req, res) {
  res.send(bitcoin);
});


// create a new transaction
app.post('/transaction', function(req, res) {
	const newTransaction = req.body;
	const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
	res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});


// broadcast transaction
app.post('/transaction/broadcast', function(req, res) {
	const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	bitcoin.addTransactionToPendingTransactions(newTransaction);

	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/transaction',
			method: 'POST',
			body: newTransaction,
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data => {
		res.status(200).json({ note: 'Transaction created and broadcast successfully.' });
	});
});


// mine a block

function postMineBlock(req, res) {
	const recipient = req.body.recipient?req.body.recipient:"0000";
	const lastBlock = bitcoin.getLastBlock();
	const previousBlockHash = lastBlock['hash'];
	const currentBlockData = {
		transactions: bitcoin.pendingTransactions,
		index: lastBlock['index'] + 1
	};
	const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
	const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/receive-new-block',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data => {
		const requestOptions = {
			uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
			method: 'POST',
			body: {
				amount: 12.5,
				sender: "0000",
				recipient: recipient
			},
			json: true
		};

		return rp(requestOptions);
	})
	.then(data => {
		res.json({
			note: "New block mined & broadcast successfully",
			block: newBlock
		});
	});
};


app.get('/mine', function(req, res) {
	const lastBlock = bitcoin.getLastBlock();
	const previousBlockHash = lastBlock['hash'];
	const currentBlockData = {
		transactions: bitcoin.pendingTransactions,
		index: lastBlock['index'] + 1
	};
	const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
	const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/receive-new-block',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data => {
		const requestOptions = {
			uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
			method: 'POST',
			body: {
				amount: 12.5,
				sender: "0000",
				recipient: "0000"
			},
			json: true
		};

		return rp(requestOptions);
	})
	.then(data => {
		res.json({
			note: "New block mined & broadcast successfully",
			block: newBlock
		});
	});
});


// receive new block
app.post('/receive-new-block', function(req, res) {
	const newBlock = req.body.newBlock;
	const lastBlock = bitcoin.getLastBlock();
	const correctHash = lastBlock.hash === newBlock.previousBlockHash; 
	const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

	if (correctHash && correctIndex) {
		bitcoin.chain.push(newBlock);
		bitcoin.pendingTransactions = [];
		res.json({
			note: 'New block received and accepted.',
			newBlock: newBlock
		});
	} else {
		res.json({
			note: 'New block rejected.',
			newBlock: newBlock
		});
	}
});


// register a node and broadcast it the network
app.post('/register-and-broadcast-node', function(req, res) {
	const newNodeUrl = req.body.newNodeUrl;
	if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

	const regNodesPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};

		regNodesPromises.push(rp(requestOptions));
	});

	Promise.all(regNodesPromises)
	.then(data => {
		const bulkRegisterOptions = {
			uri: newNodeUrl + '/register-nodes-bulk',
			method: 'POST',
			body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
			json: true
		};

		return rp(bulkRegisterOptions);
	})
	.then(data => {
		res.json({ note: 'New node registered with network successfully.' });
	});
});


// register a node with the network
app.post('/register-node', function(req, res) {
	const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
	if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
	res.json({ note: 'New node registered successfully.' });
});


// register multiple nodes at once
app.post('/register-nodes-bulk', function(req, res) {
	const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.forEach(networkNodeUrl => {
		const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
		const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
		if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
	});

	res.json({ note: 'Bulk registration successful.' });
});


// consensus
app.get('/consensus', function(req, res) {
	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/blockchain',
			method: 'GET',
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(blockchains => {
		const currentChainLength = bitcoin.chain.length;
		let maxChainLength = currentChainLength;
		let newLongestChain = null;
		let newPendingTransactions = null;

		blockchains.forEach(blockchain => {
			if (blockchain.chain.length > maxChainLength) {
				maxChainLength = blockchain.chain.length;
				newLongestChain = blockchain.chain;
				newPendingTransactions = blockchain.pendingTransactions;
			};
		});


		if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
			res.json({
				note: 'Current chain has not been replaced.',
				chain: bitcoin.chain
			});
		}
		else {
			bitcoin.chain = newLongestChain;
			bitcoin.pendingTransactions = newPendingTransactions;
			res.json({
				note: 'This chain has been replaced.',
				chain: bitcoin.chain
			});
		}
	});
});


// get block by blockHash
app.get('/block/:blockHash', function(req, res){
	const blockHash = req.params.blockHash;
      const block = bitcoin.getBlock(blockHash);
      res.json({block});
});

//get transaction by transaction id
app.get('/transaction/:transactionId', function(req, res){
	const transactionId = req.params.transactionId;
      const transactionData= bitcoin.getTransaction(transactionId);
      res.json({
		transaction: transactionData.transaction,
		block:transactionData.block
	});
})

//get address by address id
app.get('/address/:addressId',function(req,res){
	const addressId = req.params.addressId;
      const addressData= bitcoin.getAddressData(addressId);
      res.json(addressData);
})

app.get('/block-explore', function(req,res){
	res.sendFile("./block-explorer/index.html",{ root : __dirname})
})



app.listen(port, function() {
	console.log(`Listening on port ${port}...`);
});





