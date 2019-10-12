var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    customer_id :String,
    name : String,
    status :String,
});

var Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
