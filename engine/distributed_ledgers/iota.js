var iota_init = require('../initialize.js');
var fs=require('fs');

exports.send = function (sensorData,start_time) {

    const iota = iota_init.iota;
    const seed = iota_init.seed;

    const depth = 2;
    const minWeightMagnitude = 14;

    const transaction =
        {
            address: 'XKVOPYNOEMGHSMNVHQXZRESW9MORQFWWZF9PYYQXH9DWMGIEJQNCOHGZWMVHDTWJQYLSBLISKYLPPDFIWHFGGDQPHD',
            value: 0,
            message: iota.utils.toTrytes(sensorData),
            tag: 'CCIUSCMW'
        };

    const transfers = [transaction];

    iota.api.sendTransfer(seed, depth, minWeightMagnitude, transfers, (error, success) => {
        if (error) {
            console.error("sendTransfer: error", error);
        } else {
var t2 = new Date().getTime();
fs.appendFile('./time.txt',(t2-start_time)+'\n', function (err) {
  if (err) throw err;

});
fs.appendFile('./transaction_log.yaml',"IOTA:"+"https://thetangle.org/bundle/" + success[0]["bundle"].toString()+'\n', function (err) {
  if (err) throw err;
});

            console.log('success');
        }
    });
};
