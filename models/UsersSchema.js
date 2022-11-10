var mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    user: String,
    UID: String,
    permissions: String
});

const User = mongoose.model('User', UsersSchema);

module.exports = User;