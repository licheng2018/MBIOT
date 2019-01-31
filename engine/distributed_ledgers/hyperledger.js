


var fs = require('fs');
//var Fabric_Client = require('fabric-client');
var util = require('util'); 
var tx_id=null;
//var client=new Fabric_Client();
const YAML = require('yamljs');
var crypto = require('crypto');
//var channel = client.newChannel(CHANNEL_NAME);

//var channel = client.newChannel('mychannel');
//var sensorvalue = YAML.parse(fs.readFileSync('./sensordata.yaml').toString());// used for reading the data file
//var sensorvalue='abc';
//console.log(sensorvalue);

exports.Hyperledger_Write = function (CHANNEL_NAME,
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
	t1)
{


var timestamp = crypto.randomBytes(32).toString("hex");
//var t1 = new Date().getTime();
Promise.resolve().then(() => { 
tx_id=client.newTransactionID();

    const request = {
        
		//targers:targets,
		chaincodeId: CHAINCODE_ID,   //name of chaincode
                fcn: 'write',          //function name
                args: [timestamp,sensorvalue],         //argument
		chainId:CHANNEL_NAME,
		txId:tx_id,
    };
    

	return channel.sendTransactionProposal(request);
   // return channel.sendTransactionProposal(request);


}).then((results)=>{
    var proposalResponses = results[0]; 
    var proposal = results[1]; 
    var header = results[2]; 
	
let isProposalGood = false; 
    if (proposalResponses && proposalResponses[0].response && 
        proposalResponses[0].response.status === 200) { 
        isProposalGood = true;  
    } 
    if (isProposalGood) { 
	    console.log('Successfully sent Proposal and received ProposalResponse');
        var request = { 
            proposalResponses: proposalResponses, 
             proposal: proposal, 
            header: header 
        }; 
		

	var transactionID = tx_id.getTransactionID(); 
        var eventPromises = []; 
        let eh = client.newEventHub();
        let grpcOpts = { 
             pem: fs.readFileSync('./certs/peer/tls/ca.crt', { encoding: 'utf8' }),
            'ssl-target-name-override': PEER_ADDRESS
        } 
        eh.setPeerAddr(LISTENING_ADDRESS,grpcOpts); 
        eh.connect();
		

        let txPromise = new Promise((resolve, reject) => { 
            let handle = setTimeout(() => { 
                eh.disconnect(); 
                reject(); 
            }, 30000); 
	
        	eh.registerTxEvent(transactionID, (tx, code) => { 
                clearTimeout(handle); 
                eh.unregisterTxEvent(transactionID); 
                eh.disconnect();

                if (code !== 'VALID') { 
                    console.error( 
                        'The transaction was invalid, code = ' + code); 
                    reject(); 
                 } else { 
			 
                    console.log( 
                         'The transaction has been committed on peer ' + 
                         eh._ep._endpoint.addr);

                    resolve(); 
                } 
            }); 
        }); 
        var sendPromise = channel.sendTransaction(request);
		return Promise.all([sendPromise].concat(eventPromises)).then((results) => { 
		return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call 
		}).catch((err)=>{
			console.error( 
                'Failed to send transaction and get notifications within the timeout period.' 
            ); 
            return 'Failed to send transaction and get notifications within the timeout period.'; 
         }); 
    } else { 
        console.error( 
            'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...' 
        ); 
        return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'; 
    } 
}, (err) => { 
    console.error('Failed to send proposal due to error: ' + err.stack ? err.stack : 
        err); 
    return 'Failed to send proposal due to error: ' + err.stack ? err.stack : 
        err; 
}).then((response) => { 
    if (response.status === 'SUCCESS') { 
	var t2 = new Date().getTime();
fs.appendFile('./time.txt',(t2-t1)+'\n', function (err) {
  if (err) throw err;

});
        console.log('Successfully sent transaction to the orderer');
        fs.appendFile('./transaction_log.yaml','Hyperledger:'+timestamp+'\n', function (err) {
  if (err) throw err;
});
        return tx_id.getTransactionID(); 
    } else { 
        console.error('Failed to order the transaction. Error code: ' + response.status); 
        return 'Failed to order the transaction. Error code: ' + response.status; 
    } 
}, (err) => { 
    console.error('Failed to send transaction due to error: ' + err.stack ? err 
         .stack : err); 
    return 'Failed to send transaction due to error: ' + err.stack ? err.stack : 
        err; 
});
}

