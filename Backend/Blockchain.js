const { createHash } = require('crypto');
const dotenv=require('dotenv').config({ override: true })

function Blockchain (){
      this.chain = [];
      this.pendingTransaction=[];

      this.createNewBlock(100,'0','0');
}

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
      const newBlock ={
            index: this.chain.length +1 ,
            timestamp: Date.now(),
            transactions: this.pendingTransaction,
            nonce: nonce,
            hash: hash,
            previousBlockHash: previousBlockHash
      } ;

      this.pendingTransaction = [];
      this.chain.push(newBlock);

      return newBlock;
}

Blockchain.prototype.getLastBlock = function(){
      return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount,sender,recipient){
      const newTransaction= {
            amount: amount,
            sender: sender,
            recipient: recipient
      }
      this.pendingTransaction.push(newTransaction);

      return this.getLastBlock()['index']+1;
}

Blockchain.prototype.hashBlock = function(previousBlockHash,currentBlockHash,nonce){
      const dataAsString = previousBlockHash + nonce + JSON.stringify(currentBlockHash); 
      const hash = createHash('sha256').update(dataAsString).digest('hex');
      return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData){
      console.log(process.env.primarykey)
      let nonce=0;
      let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
      while(hash.substring(0,4)!=='0000'){
            nonce++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
      }
      return nonce;
}
// setInterval(()=>{},1000);
module.exports = Blockchain;