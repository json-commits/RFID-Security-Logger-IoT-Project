var mongoose = require('mongoose');

const LogsSchema = new mongoose.Schema({
    room: String,
    user: String,
    unixTime: Number,
    action: String
});

const Log = mongoose.model('Log', LogsSchema);

module.exports = Log;