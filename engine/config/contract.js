const web3 = require('./web3setup');
const keys = require('../config/keys');

const abi = [{"constant":false,"inputs":[],"name":"HashGenerator","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_topic","type":"string"},{"name":"_data","type":"string"}],"name":"SetData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":true,"name":"topic","type":"string"},{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"data","type":"string"}],"name":"DataEmitter","type":"event"}];
const address = keys.CONTRACT_ADDRESS;
const cont = new web3.eth.Contract(abi , address);

module.exports = cont;
