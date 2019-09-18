var mongoose = require('mongoose');

var clusterSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    cluster_name :String,
    cnox_stack : String,
    cnox_endpoint :String,
    Nodes : Number,
    Pods : Number,
    Services : Number,
    monitor_url : String,
    scanner_url :String
});

var Cluster = mongoose.model('Cluster', clusterSchema);
module.exports = Cluster;
