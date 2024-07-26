
// Import required modules
const express = require('express');
const router = express.Router();
const Blockchain = require('./Blockchain');
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

module.exports = router;
