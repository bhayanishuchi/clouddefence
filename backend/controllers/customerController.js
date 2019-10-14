const shortid = require('shortid');
var Customer = require('../models/customer');

exports.create = (req, res) => {
    if(req.body.name){
        Customer.find({name:req.body.name},function (err,data) {
            if(err){
                console.log('err', err);
                res.send(err);
            } else {
                if(data.length > 0){
                    console.log('This Name already Exist, try other name');
                    res.send('This Name already Exist, try other name');
                } else {
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
                }
            }
        })
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
            let a ={
                "status":200,
                "Message": "Customer Deleted Successfully"
            }
            // return res.send('Customer Deleted, Name: ' + req.body.name);
            return res.send(a);
        });
    } else {
        res.status(500).send('Body parameter NAME is missing')
    }
}
