var mongoose = require('mongoose');

module.exports = {
    connectToMongo: function (host, option) {
        mongoose.connect(host, option, function (err) {
            if (err) console.log('Unable to establish connection to server');
            else {
                console.log('MongoDB connected: Ready to Rock !');
            }
        });
    },
    disconnect: function () {
        mongoose.disconnect();
    }
}