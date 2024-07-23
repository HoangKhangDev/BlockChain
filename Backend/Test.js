const Blockchain  = require("./Blockchain");
const fs = require('node:fs');
const path = require('path');

const rs = ""
setInterval(() => {
      fs.readFile(path.join(__dirname, 'primaryKey.txt'), 'utf8', (err, data) => {
      if (err) {
            console.error(err);
      return;
      }
      let rad = data;
      console.log(data)
      while(rad===data){
            rad=Math.round(Math.random() * 10000+1);
      }
      console.log(rad)
      fs.writeFileSync(path.join(__dirname, 'primaryKey.txt'), parseInt(rad, 10).toString(), (err, data)=>{
            if (err) {
                  console.error(err);
            return;
            }
      });
});
}, 10000);

console.log(rs)
let bitcoin = new Blockchain();
bitcoin.createNewBlock(1122,'BASDASD2AND','ASDDWCC2AC');
bitcoin.createNewTransaction(100,'ALEXCC22WXSA','JEACNAMAS2AC')

bitcoin.createNewBlock(3344,'BASDASD3AND','ASDDWCC3AC')
bitcoin.createNewBlock(5566,'BASDASD4AND','ASDDWCC4AC')
bitcoin.createNewTransaction(100,'ALEXCC22WXSA','JEACNAMAS2AC')

bitcoin.createNewBlock(8778,'BASDASD5AND','ASDDWCC5AC')
bitcoin.createNewTransaction(100,'ALEXCC22WXSA','JEACNAMAS2AC')
bitcoin.createNewTransaction(20000,'ALEXCC22WXSA','JEACNAMAS2AC')
bitcoin.createNewTransaction(30000,'ALEXCC22WXSA','JEACNAMAS2AC')
bitcoin.createNewBlock(9009,'BASDASD6AND','ASDDWCC6AC')


const previousHash='BEACNAMAS2AC';
const currentBlockHash=[
      {
            amount:10,
            sender:'JEACNAMAS2AC',
            recipient:'ALEXCC22WXSA'
      },
      {
            amount:20000,
            sender:'JEACNAMAS2AC',
            recipient:'JEACNAMAS2AC'
      }
      ,
      {
            amount:30000,
            sender:'JEACNAMAS2AC',
            recipient:'JEACNAMAS2AC'
      }
]



// console.log(bitcoin);
console.log(bitcoin.proofOfWork(previousHash,currentBlockHash))




