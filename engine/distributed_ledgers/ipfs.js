exports.IPFS_Write = function(sensorvalue,t1){
const ipfsFile = require('./ipfsFile.js');
const fs = require('fs');
const crypto = require('crypto');
const AES = require('./aes.js');
let password = crypto.randomBytes(32).toString("hex");
let buff = AES.encrypt(sensorvalue,password);
ipfsFile.add(buff).then((hash)=>{
 var t2 = new Date().getTime();
fs.appendFile('./time.txt',(t2-t1)+'\n', function (err) {
  if (err) throw err;

});
 console.log("success right into IPFS");
 fs.appendFile('./transaction_log.yaml','IPFS:'+hash+'  Key:'+password+'\n', function (err) {
  if (err) throw err;
});

}).catch((err)=>{
    console.log(err);
}
)
}
