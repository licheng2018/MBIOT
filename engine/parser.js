// parse the data
//
// call corresponding compute functions from compute/ if necessary
//
// call the blockchain read APIs frpm iota.js or ethereum.js or hyperledger.js
var fs = require('fs');
var init=require('./initialize.js');
var IOTAWrite=require('./distributed_ledgers/iota.js')
var ipfs=require('./distributed_ledgers/ipfs.js')
var hyper_init_flag=0;
var IOTA_init_flag=0;
//const { spawn } = require('child_process');
//const subprocess = spawn('pwd');
const YAML = require('yamljs');

exports.parser_data=function(ledger,start_time)
{
var ledger_type=ledger.slice(ledger.indexOf("type:"),ledger.indexOf("sensordata"));
var sensor_data=ledger.slice(ledger.indexOf('sensordata:'), ledger.length);
sensor_data=sensor_data.replace('sensordata:',"");

if(ledger_type.indexOf('hyperledger')>-1)
{
//console.log('writing into hyperledger:'+sensor_data);
if(hyper_init_flag==0)
{
	init.InitHyperledgerWriter(sensor_data,start_time);
	hyper_init_flag=1;
}
else
{	

	
	init.HyperledgerWriter(sensor_data,start_time);
	

}
}
if(ledger_type.indexOf('IOTA')>-1)
{

if(IOTA_init_flag==0)
{
init.InitIota();
IOTAWrite.send(sensor_data,start_time);
}
else
{
IOTAWrite.send(sensor_data,start_time);
}
//console.log('writing into IOTA:'+sensor_data);
}
if(ledger_type.indexOf('Ethereum')>-1)
{
//console.log('writing into Ethereum:'+sensor_data);
init.WriteData(sensor_data,start_time);
}	
if(ledger_type.indexOf('IPFS')>-1)
{
//console.log('writing into IPFS:'+sensor_data);
ipfs.IPFS_Write(sensor_data,start_time);
}

}

