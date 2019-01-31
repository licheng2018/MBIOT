// Init all blockchain config
//
// Subscribe from MQTT
//
// Send the data to the parser
var fs = require('fs');
var mqtt = require('mqtt');
var client  = mqtt.connect('ws://eclipse.usc.edu:9001');
var parser=require('./parser.js');



client.on('connect', function () {
  client.subscribe('presence');
});
 client.on('message', function (topic, message) {
	console.log(message.toString());
	var t1 = new Date().getTime();
	parser.parser_data(message.toString(),t1);
});

