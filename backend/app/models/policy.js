const mongoose = require('mongoose');

const policySchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    policy_id :String,
    customer_id :String,
    policy_body : Object,
});

var Policy = mongoose.model('Policy', policySchema);
module.exports = Policy;
