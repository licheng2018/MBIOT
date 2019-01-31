// Read the configs from the config file
//
// Initialize everything related to blockchain and ipfs
var fs = require('fs');
var Fabric_Client = require('fabric-client');
var fs = require('fs');
var YAML = require('yamljs');
var data = YAML.parse(fs.readFileSync('./config/hyperledger.yaml').toString());//used for reading configuration fill
var hyperledger=require('./distributed_ledgers/hyperledger.js');
var fs = require('fs');
var Fabric_Client = require('fabric-client');
const IOTA = require('iota.lib.js');
var ethereum=require('./distributed_ledgers/ethereum.js');

var client=new Fabric_Client();
var flag=0;
var CHANNEL_NAME=data.CHANNEL_NAME;//read the configuration information from configuration file.
var USER_NAME=data.USER_NAME;
var MSPID=data.MSPID;
var PRIVATE_KEY=data.PRIVATE_KEY;
var SIGN_CERT=data.SIGN_CERT;
var PEER_ADDRESS=data.PEER_ADDRESS;
var PEER_ADDRESS_GRPC=data.PEER_ADDRESS_GRPC;
var PEER_SSL_TARGET=data.PEER_SSL_TARGET;
var ORDERER_SSL_TARGET=data.ORDERER_SSL_TARGET;
var ORDERER_ADDRESS=data.ORDERER_ADDRESS;
var CHAINCODE_ID=data.CHAINCODE_ID;
var CHANNEL_ID=data.CHANNEL_ID;
var LISTENING_ADDRESS=data.LISTENING_ADDRESS;
var channel = client.newChannel(CHANNEL_NAME);
Fabric_Client.newDefaultKeyValueStore({ path: '/tmp/xx/' }).then((state_store) => {
    //client=new Fabric_Client();
    client.setStateStore(state_store);
    var userOpt = {
        username:USER_NAME ,
        mspid: MSPID,
        cryptoContent: { 
            privateKey: PRIVATE_KEY,
            signedCert: SIGN_CERT
        }
    }

    return client.createUser(userOpt)
}).then((user)=>{
    //seting information of Peer
    var peer = client.newPeer(
        PEER_ADDRESS_GRPC,
        {
            pem: fs.readFileSync('./certs/peer/tls/ca.crt', { encoding: 'utf8' }),
            clientKey: fs.readFileSync('./certs/peer/tls/client.key', { encoding: 'utf8' }),
            clientCert: fs.readFileSync('./certs/peer/tls/client.crt', { encoding: 'utf8' }),
            'ssl-target-name-override': PEER_ADDRESS
        }
    );

   channel.addPeer(peer);

	//orderer information
	var ordererUserOpt={
	pem:fs.readFileSync('./certs/orderer/tls/ca.crt', { encoding: 'utf8' }),
	'ssl-target-name-override':ORDERER_SSL_TARGET
	}

	orderer=client.newOrderer(ORDERER_ADDRESS,ordererUserOpt);
	channel.addOrderer(orderer);
});

exports.InitHyperledgerWriter = function (sensorvalue,time){
CHANNEL_NAME=data.CHANNEL_NAME;//read the configuration information from configuration file.
USER_NAME=data.USER_NAME;
MSPID=data.MSPID;
PRIVATE_KEY=data.PRIVATE_KEY;
SIGN_CERT=data.SIGN_CERT;
PEER_ADDRESS=data.PEER_ADDRESS;
PEER_ADDRESS_GRPC=data.PEER_ADDRESS_GRPC;
PEER_SSL_TARGET=data.PEER_SSL_TARGET;
ORDERER_SSL_TARGET=data.ORDERER_SSL_TARGET;
ORDERER_ADDRESS=data.ORDERER_ADDRESS;
CHAINCODE_ID=data.CHAINCODE_ID;
CHANNEL_ID=data.CHANNEL_ID;
LISTENING_ADDRESS=data.LISTENING_ADDRESS;

hyperledger.Hyperledger_Write(CHANNEL_NAME,
	USER_NAME,
	MSPID,
	PRIVATE_KEY,
	SIGN_CERT,
	PEER_ADDRESS,
	PEER_ADDRESS_GRPC,
	PEER_SSL_TARGET,
	ORDERER_SSL_TARGET,
	ORDERER_ADDRESS,
	CHAINCODE_ID,
	CHANNEL_ID,
	LISTENING_ADDRESS,
	sensorvalue,
	channel,
	client,
	time);
	//console.log('first');
}

exports.HyperledgerWriter = function (sensorvalue,time){
hyperledger.Hyperledger_Write(CHANNEL_NAME,
	USER_NAME,
	MSPID,
	PRIVATE_KEY,
	SIGN_CERT,
	PEER_ADDRESS,
	PEER_ADDRESS_GRPC,
	PEER_SSL_TARGET,
	ORDERER_SSL_TARGET,
	ORDERER_ADDRESS,
	CHAINCODE_ID,
	CHANNEL_ID,
	LISTENING_ADDRESS,
	sensorvalue,
	channel,
	client,
	time);
	//console.log(sensorvalue);
}


exports.InitIota = function (){
    var iota =  new IOTA({
        'provider': 'http://node02.iotatoken.nl:14265'
    });
    var seed = 'RAHULRAHULRAHULRAHULRAHULRAHULRAHULRAHULRAHULRAHULRAHULRAHULRAHULRAHULRAHUL9RAHUL';

    exports.iota = iota;
    exports.seed = seed;
};

exports.WriteData = function(sensorvalue,time) {
    ethereum.Eth_Write(sensorvalue,time);
}

