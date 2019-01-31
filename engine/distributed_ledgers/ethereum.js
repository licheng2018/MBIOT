exports.Eth_Write = function(sensorvalue,t1) {

  //const express = require('express');
  const web3 = require('../config/web3setup');
  var contract = require('../config/contract');
  const keys = require('../config/keys');
  const HTTP = keys.HTTP_SERVER;
  var fs=require('fs');

  const account = web3.eth.accounts.privateKeyToAccount('0xC89ADA337DCDD9D9D092D582104064554DDC3A835B0D164B82E304F0DFC5F0FC');
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  //console.log('Sending from Metamask account: ' + account.address);
  contract.methods.SetData("sensordata" , sensorvalue).send({
    from:account.address,
    gas:1000000
  }, (error , hash) => {
var t2 = new Date().getTime();
fs.appendFile('./transaction_log.yaml','Etherum:'+hash+'\n', function (err) {
  if (err) throw err;
});
fs.appendFile('./time.txt',(t2-t1)+'\n', function (err) {
  if (err) throw err;

});
    console.log(hash);
console.log(sensorvalue);
  });

};
