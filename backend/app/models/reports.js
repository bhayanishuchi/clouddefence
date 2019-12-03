const mongoose = require('mongoose');

const reportsSchema = mongoose.Schema({
    customername :String,
    clustername :String,
    report_id  :String,
    report_type :String,
    timestamp :Date,
    summary_json :Object,
    raw_report  : String,
});

var Reports = mongoose.model('reports', reportsSchema);
module.exports = Reports;
