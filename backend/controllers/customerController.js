const shortid = require('shortid');
var Customer = require('../models/customer');

exports.create = (req, res) => {
    if(req.body.name){
        var customer = new Customer({
            customer_id: shortid.generate(),
            name: req.body.name,
            status: 'Activate',
        });
        customer.save(function (err, user) {
            if (err) {
                console.log("errorr", err)
                throw err
            } else{
                console.log("Customer Created");
                res.status(200).send('Customer Created')
                // findSocketTotalunseccluster(req)
                //     .then(findSocketTotalStackList(req))
                //     .then(findSocketAllTotal(req))
                //     .then(findSocketLogEvent(req))
                //     .then(findSocketAllcluster(req))
                //     .then((data) => {
                //         return res.send(data);
                //     })
            }
        });
    } else {
        res.status(500).send('Body parameter NAME is missing')
    }

};

exports.delete = (req, res) => {
    if(req.body.name){
        var myquery = {name: req.body.name};
        Customer.deleteOne(myquery).exec((err, obj) => {
            if (err) throw err;
            console.log("1 customer deleted");
            return res.send('Received a DELETE HTTP method' + req.body.name);
        });
    } else {
        res.status(500).send('Body parameter NAME is missing')
    }

    Cluster.deleteOne(myquery).exec((err, obj) => {
        if (err) throw err;
        console.log("1 document deleted");
        return res.send('Received a DELETE HTTP method' + req.params.cluster_name);
    });
}
