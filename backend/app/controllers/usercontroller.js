const shortid = require('shortid');
const mongoose = require('mongoose');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib')

const User = mongoose.model('User');
const Customer = mongoose.model('Customer');

let createUser = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.body.username && req.body.customer_id) {
                resolve();
            } else {
                let apiResponse = response.generate(true, "Required Parameter username or customer_id is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkUser = () => {
        console.log("checkUser");
        return new Promise((resolve, reject) => {
            User.find({username: req.body.username, customer_id: req.body.customer_id}, function (err, userDetail) {
                if (err) {
                    logger.error("Internal Server error while fetching user", "createUser => checkUser()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(userDetail)) {
                    resolve();
                } else {
                    logger.error("User Already Exists", "createUser => checkUser()", 5);
                    let apiResponse = response.generate(true, "User Already Exists", 401, null);
                    reject(apiResponse);
                }
            })
        });
    }; // end of checkUser

    let checkCustomer = () => {
        console.log("checkCustomer");
        return new Promise((resolve, reject) => {
            Customer.findOne({customer_id: req.body.customer_id}, function (err, customerDetail) {
                if (err) {
                    logger.error("Internal Server error while fetching user", "createUser => checkCustomer()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(customerDetail)) {
                    logger.error("Customer Not Exists", "createUser => checkCustomer()", 5);
                    let apiResponse = response.generate(true, "Customer Not Exists", 401, null);
                    reject(apiResponse);
                } else {
                    resolve(customerDetail);
                }
            })
        });
    }; // end of checkUser

    let addUser = (customerDetail) => {
        console.log("addUser");
        return new Promise((resolve, reject) => {
            let body = {
                user_id: shortid.generate(),
                customer_id: req.body.customer_id,
                username: req.body.username,
                first_name: (req.body.first_name) ? (req.body.first_name) : '',
                last_name: (req.body.last_name) ? (req.body.last_name) : '',
                email: (req.body.email) ? (req.body.email) : '',
                phone: (req.body.phone) ? (req.body.phone) : '',
                role: (req.body.role) ? (req.body.role) : 'admin',
                status: (req.body.status) ? (req.body.status) : 'Activate',
            };
            if (req.body.password) {
                body['password'] = req.body.password;
            }
            User.create(body, function (err, user) {
                if (err) {
                    logger.error("Internal Server error while create User", "createUser => addUser()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(user);
                }
            })
        });
    }; // end of addUser

    validatingInputs()
        .then(checkCustomer)
        .then(checkUser)
        .then(addUser)
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            res.status(200).send(resolve);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

let deleteUser = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.params.username && req.params.customer_id) {
                resolve();
            } else {
                let apiResponse = response.generate(true, "Required Parameter username or customer_id is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkUser = () => {
        console.log("checkUser");
        return new Promise((resolve, reject) => {
            User.find({username: req.params.username, customer_id: req.params.customer_id}, function (err, customerDetail) {
                if (err) {
                    logger.error("Internal Server error while fetching user", "deleteUser => checkUser()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(customerDetail)) {
                    logger.error("User does not Exists", "deleteUser => checkUser()", 5);
                    let apiResponse = response.generate(true, "User does not Exists", 401, null);
                    reject(apiResponse);
                } else {
                    resolve();
                }
            })
        });
    }; // end of checkUser

    let removeUser = () => {
        console.log("removeUser");
        return new Promise((resolve, reject) => {
            User.findOneAndRemove({username: req.params.username , customer_id: req.params.customer_id}, function (err, user) {
                if (err) {
                    logger.error("Internal Server error while delete user", "deleteUser => removeUser()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(user);
                }
            })
        });
    }; // end of removeCustomer

    validatingInputs()
        .then(checkUser)
        .then(removeUser)
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            res.status(200).send('Received a DELETE HTTP method for username: ' + req.params.username);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
}


module.exports = {
    createUser: createUser,
    deleteUser: deleteUser,
}
