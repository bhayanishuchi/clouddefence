var mongoose = require('mongoose');

var tableSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    timestamp :Number,
    log_string : String
});

var Logtable = mongoose.model('Logtable', tableSchema);
module.exports = Logtable;