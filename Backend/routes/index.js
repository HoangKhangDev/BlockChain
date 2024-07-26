
// Import required modules
const express = require('express');
const router = express.Router();
const Blockchain = require('../Blockchain');
const requestPromise = require('request-promise');
const { v4: uuidv4 } = require('uuid');

const nodeAddress= uuidv4().split('-').join('');
const bitcoin = new Blockchain();

// Define routes
router.get('/blockchain', (req, res) => {
      res.send(bitcoin)
})


router.post('/transaction', (req, res) =>{
      console.log(req.body)
      const blockIndex=bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
      res.json({note:`The transaction will add ${blockIndex}`})
})

router.get('/mine', (req, res) =>{
      const lastBlock = bitcoin.getLastBlock();
      const previousBlockHash = lastBlock['hash'];
      const currentBlockData = {
          transactions: bitcoin.pendingTransactions,
          index: lastBlock['index']+1
      };
      const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
      const blockHash = bitcoin.hashBlock(previousBlockHash,currentBlockData, nonce);

      bitcoin.createNewTransaction(12.5,"00",nodeAddress);

      const newBlock = bitcoin.createNewBlock(nonce,previousBlockHash,blockHash);
      res.json({
            note : "New block mined",
            block : newBlock
      })
});



router.post('/register-and-broadcast-node',(req, res) => {
      //get parameters from request body
      const newNodeUrl = req.body.newNodeUrl;
      //check newNodeUrl exists if does not exist will push to networkNodes
      if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1
            &&bitcoin.currentNodeUrl!=newNodeUrl) {
                  bitcoin.networkNodes.push(newNodeUrl);
      }
	const regNodesPromises = [];
      // read node and push to networkNodes
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		// create method for post request
            const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};

		regNodesPromises.push(requestPromise(requestOptions));
            });

      Promise.all(regNodesPromises)
      .then(data => {
            const bulkRegisterOptions = {
			uri: newNodeUrl + '/register-nodes-bulk',
			method: 'POST',
			body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
			json: true
		};
            return requestPromise(bulkRegisterOptions)
      })
      .then(data =>{
            res.json({ note: 'New node registered with network successfully' });
      });
 
});

router.post('/register-node',(req, res) => {
      const newNodeUrl = req.body.newNodeUrl;
      const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl)== -1;
      const notCurrentNode = bitcoin.currentNodeUrl!== newNodeUrl;

      if (nodeNotAlreadyPresent&&notCurrentNode) {
            bitcoin.networkNodes.push(newNodeUrl);
            res.json({ note: 'New node registered successfully' });
      } else {
            res.json({ note: 'Invalid new node' });
      }
});

router.post('/register-nodes-bulk',(req, res)=>{
      const allNetworkNodes = req.body.allNetworkNodes;
      allNetworkNodes.forEach(networkNodeUrl=>{
            if(bitcoin.networkNodes.indexOf(networkNodeUrl)==-1 
            && bitcoin.currentNodeUrl!=networkNodeUrl) {
                  bitcoin.networkNodes.push(networkNodeUrl); 
            }
      });
      res.json({ note: 'Bulk registration successful' });
});

module.exports = router;
