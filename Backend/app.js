const express = require('express');
const app = express();
const Blockchain = require('./Blockchain');
const { v4: uuidv4 } = require('uuid');


const nodeAddress= uuidv4().split('-').join('');

const bitcoin = new Blockchain();

//config body for Post request
const bodyParser = require('body-parser');
const port=3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extends: false}));


app.get('/', (req, res) => {
      res.send('hello world')
})

app.get('/blockchain', (req, res) => {
      res.send(bitcoin)
})

app.post('/transaction', (req, res) =>{
      console.log(req.body)
      const blockIndex=bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
      res.json({note:`The transaction will add ${blockIndex}`})
})

app.get('/mine', (req, res) =>{
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

app.listen(port,()=>{
      console.log("Listening on port http:/localhost:"+ port);
})