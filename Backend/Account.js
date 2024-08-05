const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');
var generator = require("random-word-syllables");
const ShortUniqueId = require('short-unique-id');
process.setMaxListeners(0);

const uid = new ShortUniqueId();

function Account (){
      // this.Accs=[
      //       {
      //             privateKey: sha256(Date.now().toString()),
      //             publicKey: "0000",
      //             password: sha256((Date.now()+3690).toString()),
      //     }
      //];

 // this.currentNodeUrl = currentNodeUrl;
	// this.networkNodes = [];
      // this.keys=[];
      // this.currentKeys=[];
      // this.currentPrimaryKey=""
      // this.currentPublicKey=""
        this.Accs=[
    {
      privateKey: "bfa99fd3c5fd3972f5700b488911df8765840b20ef29f5aae75e159edf162043",
      publicKey: "0000",
      password: "fe091db5d84fc443626b38ed86109243f16510f72894938badbc32c1ee019c37"
    },
    {
      privateKey: "7fc769dcf2c4830e7d0261cac8af535f58301296004022bf90ec7e7391ab6094",
      publicKey: "3438ce5327cf404282bd9772de206ac99403ea3fe201e04b0356d1ec289da86c",
      password: "1",
      name: "11111111",
      dateTime: "23:47:33 05:08:2024",
      key01: "Precentor",
      key02: "Unsugared",
      key03: "Bluestocking",
      key04: "Bargeman",
      key05: "Showerhead",
      key06: "Lunatic"
    },
    {
      privateKey: "8e3dcab58957fa5f9678283142cd8c546c2023f168bd91436d3c9d65a2c9cfd3",
      publicKey: "06ff600edb638322c9cb515ebf31fe0ad135000f21abdc9e1a013c39a45f2ce2",
      password: "2",
      name: "22222222222",
      dateTime: "23:48:36 05:08:2024",
      key01: "News_Report",
      key02: "Ground_Almond",
      key03: "Obscenely",
      key04: "Dry_Vermouth",
      key05: "Overuse",
      key06: "Standard_Cell"
    },
    {
      privateKey: "6029f62e9f96c28818891d226f3625be2ade8f7db50251ebd9811d386a502d97",
      publicKey: "bbec8493bcc785b680e90677d5288fb71089aca1b1246ccb33373e7d925a1203",
      password: "3",
      name: "3333333333",
      dateTime: "23:48:49 05:08:2024",
      key01: "Surface_Mine",
      key02: "Terror-struck",
      key03: "Paiwanic",
      key04: "Carburise",
      key05: "Ready_Cash",
      key06: "St._David"
    }
  ],
      this.currentNodeUrl = currentNodeUrl;
	this.networkNodes = [];
      this.currentKeys=[];
      this.currentPrimaryKey=""
      this.currentPublicKey=""
      this.keys= [
            "7fc769dcf2c4830e7d0261cac8af535f58301296004022bf90ec7e7391ab6094",
            "8e3dcab58957fa5f9678283142cd8c546c2023f168bd91436d3c9d65a2c9cfd3",
            "6029f62e9f96c28818891d226f3625be2ade8f7db50251ebd9811d386a502d97"
      ]
}

Account.prototype.createAccount = function(password, name){
      console.log("Create Account");
      let firstLoad=true;
      let acc={};
      while(!this.checkExitsPrivateKey(this.currentPrimaryKey) && firstLoad ){
            console.log("Loop")
            const difficulty = Math.floor(Math.random());
            key01= this.getKey(0);
            key02= this.getKey(1);
            key03= this.getKey(2);
            key04= this.getKey(3);
            key05= this.getKey(4);
            key06= this.getKey(5);
            this.hash(key01,key02,key03,key04,key05,key06,difficulty);
            acc={
                  privateKey: this.currentPrimaryKey,
                  publicKey: this.currentPublicKey,
                  password: password ? password: "0000",
                  name: name? name:"user "+this.Accs.length,
                  dateTime: formatDateFromTimestamp(Date.now()),
                  key01: key01,
                  key02: key02,
                  key03: key03,
                  key04: key04,
                  key05: key05,
                  key06: key06,
            };
            firstLoad=false;
      }
            this.Accs.push(acc);
            this.keys.push(this.currentPrimaryKey);
            this.clearAll();
            console.log("create  account successfully")
            return acc;
}

Account.prototype.createAccountFromBroadNodeOther= function(acc){
      console.log("Create createAccountFromBroadNodeOther");
      this.Accs.push(acc);
      this.keys.push(acc.privateKey);
      return acc;
}
      
Account.prototype.hash = function(key01,key02,key03,key04,key05,key06,difficulty){
      const rand= uid.stamp(difficulty);
      const rs=  rand+
      key01+key02+key03+key04+key05+key06+Date.now().toString();
	this.currentPrimaryKey =  sha256(rs).toString();
      this.currentPublicKey= sha256(rs+Date.now()).toString();
}

Account.prototype.checkExitsPrivateKey = function(privateKey){
      let valid=false;
      this.keys.forEach((key)=>{
            if(key.toString()===privateKey.toString()){
                  console.log("Loop")
                  valid=true;
                  return;
            }
      });
      return valid;
}

Account.prototype.generateCurrentKey = function(){
      this.currentKeys = generator.randwords(3,6);
}

Account.prototype.clearAll = function(){
      this.currentKeys = [];
      this.currentPrimaryKey = "";
      this.currentPublicKey = "";
      
}

Account.prototype.getKey = function(i){
      if(i===0){
            this.generateCurrentKey();
      }
      if(i===this.currentKeys.length){
            this.clearCurrentKey();
      }

     
      return toPascalCase(this.currentKeys.at(i).toString());
}

function toPascalCase(str) {
  return str
    .split(' ')        
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() 
    )
    .join('_');
}

Account.prototype.getAccountByPrivateKey = function(privateKey){
      return this.Accs.find((acc)=>
            acc.privateKey === privateKey);
}

Account.prototype.getAccountByPublicKey = function(publicKey){
      return this.Accs.find((acc)=>
            acc.publicKey === publicKey);
}

Account.prototype.getProfileAccountByPrivateKey = function(privateKey){
      const found = this.Accs.find((acc)=>
            acc.privateKey === privateKey);
      if(!found) return "Account not found";
      return{
            privateKey: found.privateKey,
            publicKey: found.publicKey,
            name: found.name,
            password: found.password
      }
}

Account.prototype.getAccountByPrivateAndKeys = function(privateKey,key01,key02,key03,key04,key05,key06){
      console.log("getAccountByPrivateAndKeys")
      console.log( this.Accs.find((acc)=>
            acc.privateKey === privateKey &&
            acc.key01 === key01 &&
            acc.key02 === key02 &&
            acc.key03 === key03 &&
            acc.key04 === key04 &&
            acc.key05 === key05 &&
            acc.key06 === key06))
      return this.Accs.find((acc)=>
            acc.privateKey === privateKey &&
            acc.key01 === key01 &&
            acc.key02 === key02 &&
            acc.key03 === key03 &&
            acc.key04 === key04 &&
            acc.key05 === key05 &&
            acc.key06 === key06);
}

Account.prototype.getAccountByPrimaryKeyAndPassword=function(privateKey,password){
      return this.Accs.find((acc)=>
      acc.privateKey === privateKey &&
      acc.password ===password);
}

Account.prototype.changeProfile=function(privateKey, password,name){
      let account=this.getAccountByPrivateKey(privateKey);
      if(name!=account.name&& account.name!="" && account.name!= null){
            account.name=name;
      }
      if(password!=account.password&& account.password!=""&& account.password!=null){
            account.password=password;
      }
      account.dateTime=formatDateFromTimestamp(Date.now());
      const index=this.Accs.indexOf(privateKey);
      this.Accs.splice(index,1);
      this.Accs.push(account);
}

function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    
    return `${hours}:${minutes}:${seconds} ${day}:${month}:${year}`;
}


module.exports = Account;