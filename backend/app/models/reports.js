const mongoose = require('mongoose');

const reportsSchema = mongoose.Schema({
    customername: String,
    customer_id: String,
    cluster_name: String,
    report_id: String,
    report_type: String,
    timestamp: Date,
    summary_json: Object,
    raw_report: String,
    img:Array
});

var Reports = mongoose.model('reports', reportsSchema);
module.exports = Reports;
