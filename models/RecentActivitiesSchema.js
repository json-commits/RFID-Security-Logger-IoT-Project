var mongoose = require('mongoose');

const RecentActivitiesSchema = new mongoose.Schema({
    user: String,
    inAttendance: Boolean,
    lastLoggedUnixTime: Number,
    lastLocation: String,
    lastAction: String
});

const RecentActivity = mongoose.model('Recent-Activity', RecentActivitiesSchema);

module.exports = RecentActivity;