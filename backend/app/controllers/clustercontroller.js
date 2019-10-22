const shortid = require('shortid');
const mongoose = require('mongoose');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib')

const Customer = mongoose.model('Customer');
const Cluster = mongoose.model('Cluster');
const Logtable = mongoose.model('Logtable');

const findSocketTotalunseccluster = function (req, customer_id) {
    console.log('==== update Socket start ==== ');
    console.log('findSocketTotalunseccluster ');
    const socket = req.app.io;
    return new Promise((resolve, reject) => {
        Cluster.find({cnox_stack: {$in: ['', 'unsecured']}, license_key: customer_id}).exec((err, result) => {
            if (err) throw err;
            if (socket !== undefined) {
                socket.to(customer_id).emit('unseccluster', result);
            }
            resolve(result);
        });
    })
}
const findSocketTotalStackList = function (req, customer_id) {
    console.log('findSocketTotalStackList ');
    const socket = req.app.io;
    return new Promise((resolve, reject) => {
        Cluster.find({cnox_stack: {$nin:['', null, 'unsecured']}, license_key:customer_id}).exec((err, result) => {
            if (err) throw err;
            let gold_stack = 0;
            let silver_stack = 0;
            let bronze_stack = 0;
            let totalgoldNodes = 0;
            let totalsilverNodes = 0;
            let totalbronzeNodes = 0;
            result.filter((x) => {
                if (x.cnox_stack === 'gold_stack') {
                    gold_stack++;
                    totalgoldNodes += Number(x.Nodes)
                } else if (x.cnox_stack === 'silver_stack') {
                    silver_stack++;
                    totalsilverNodes += Number(x.Nodes)
                } else if (x.cnox_stack === 'bronze_stack') {
                    bronze_stack++
                    totalbronzeNodes += Number(x.Nodes)
                }
            })
            let gold = {
                Totalstack: gold_stack,
                TotalNodes: totalgoldNodes,

            }
            let silver = {
                Totalstack: silver_stack,
                TotalNodes: totalsilverNodes,

            }
            let bronze = {
                Totalstack: bronze_stack,
                TotalNodes: totalbronzeNodes,

            }
            result = {
                Gold: gold,
                Silver: silver,
                Bronze: bronze
            }
            if (socket !== undefined) {
                socket.to(customer_id).emit('list', result);
            }
            resolve(result);
        });
    })
}
const findSocketLogEvent = function (req, customer_id) {
    console.log('findSocketLogEvent ');
    return new Promise((resolve, reject) => {
        const socket = req.app.io;
        Logtable.find({customer_id: customer_id}).sort({timestamp: -1}).exec((err, result) => {
            if (err) throw err;
            if (socket !== undefined) {
                socket.to(customer_id).emit('logs', result);
            }
            resolve(result);
        });
    })
}
const findSocketAllTotal = function (req, customer_id) {
    console.log('findSocketAllTotal ');
    return new Promise((resolve, reject) => {
        const socket = req.app.io;
        Cluster.find({license_key: customer_id}).exec((err, result) => {
            if (err) throw err;
            let totalNodes = 0;
            let totalPods = 0;
            let totalServices = 0;
            result.filter((x) => {
                totalNodes += Number(x.Nodes)
                totalPods += Number(x.Pods)
                totalServices += Number(x.Services)
            })
            result = {
                TotalNodes: totalNodes,
                TotalPods: totalPods,
                TotalServices: totalServices
            }
            if (socket !== undefined) {
                socket.to(customer_id).emit('totals', result);
            }
            resolve(result);
        });
    });
}
const findSocketAllcluster = function (req, customer_id) {
    console.log('findSocketAllcluster ');
    return new Promise((resolve, reject) => {
        const socket = req.app.io;
        Cluster.find({license_key: customer_id}).exec((err, result) => {
            if (err) throw err;
            if (socket !== undefined) {
                socket.to(customer_id).emit('cluster', result);
            }
            resolve(result);
            console.log('==== End Socket ==== ');
        });
    });
}

exports.createCluster = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.body.license_key) {
                if (req.body.cluster_name) {
                    resolve();
                } else {
                    let apiResponse = response.generate(true, "Required Parameter cluster_name is missing", 400, null);
                    reject(apiResponse);
                }
            } else {
                let apiResponse = response.generate(true, "Required Parameter license_key is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkCustomer = () => {
        console.log("checkCustomer");
        return new Promise((resolve, reject) => {
            Customer.findOne({customer_id: req.body.license_key}, function (err, customerDetail) {
                if (err) {
                    logger.error("Internal Server error while fetching customer", "createCustomer => checkCustomer()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(customerDetail)) {
                    logger.error("Customer Not Found", "createCluster => checkCustomer()", 5);
                    let apiResponse = response.generate(true, "Customer Not Found", 401, null);
                    reject(apiResponse);
                } else {
                    if (customerDetail.status && (customerDetail.status).toLowerCase() === 'activate') {
                        resolve(customerDetail);
                    } else {
                        logger.error("Customer is inActive", "createCluster => checkCustomer()", 5);
                        let apiResponse = response.generate(true, "Customer is inActive", 401, null);
                        reject(apiResponse);
                    }
                }
            })
        });
    }; // end of checkCustomer

    let checkCluster = (customerDetail) => {
        console.log("checkCluster");
        return new Promise((resolve, reject) => {
            Cluster.find({cluster_name: req.body.cluster_name}, function (err, clusterData) {
                if (err) {
                    logger.error("Internal Server error while fetching Cluster", "createCustomer => checkCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(clusterData)) {
                    resolve(customerDetail);
                } else {
                    logger.error("Cluster Already Exists", "createCluster => checkCluster()", 5);
                    let apiResponse = response.generate(true, "Cluster Already Exists", 401, null);
                    reject(apiResponse);

                }
            })
        });
    }; // end of checkCluster

    let addCluster = (customerDetail) => {
        console.log("addCustomer");
        return new Promise((resolve, reject) => {
            let body = {
                cluster_name: req.body.cluster_name,
                cnox_stack: req.body.cnox_stack,
                cnox_engine_url: req.body.cnox_engine_url,
                Nodes: req.body.Nodes,
                license_key: customerDetail.customer_id,
                Pods: req.body.Pods,
                Services: req.body.Services,
                monitor_url: req.body.monitor_url,
                scanner_url: req.body.scanner_url,
                compliance_url: req.body.compliance_url
            };
            Cluster.create(body, function (err, clusterdetails) {
                if (err) {
                    logger.error("Internal Server error while create Cluster", "addCluster => addCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterdetails);
                }
            })
        });
    }; // end of addCluster

    validatingInputs()
        .then(checkCustomer)
        .then(checkCluster)
        .then(addCluster)
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            Promise.all([findSocketTotalunseccluster(req, req.body.license_key), findSocketTotalStackList(req, req.body.license_key), findSocketAllTotal(req, req.body.license_key), findSocketLogEvent(req, req.body.license_key), findSocketAllcluster(req, req.body.license_key)])
                .then((data) => {
                    res.status(200).send(resolve);
                })

        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

exports.putCnoxEngineUrl = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.params.cluster_name) {
                if (req.body.cnox_engine_url) {
                    resolve();
                } else {
                    let apiResponse = response.generate(true, "Required Parameter cnox_engine_url is missing", 400, null);
                    reject(apiResponse);
                }
            } else {
                let apiResponse = response.generate(true, "Required Parameter cluster_name is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkCluster = () => {
        console.log("checkCluster");
        return new Promise((resolve, reject) => {
            Cluster.findOne({cluster_name: req.params.cluster_name}, function (err, clusterData) {
                if (err) {
                    logger.error("Internal Server error while fetching Cluster", "putCnoxEngineUrl => checkCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(clusterData)) {
                    logger.error("Cluster not found", "putCnoxEngineUrl => checkCluster()", 5);
                    let apiResponse = response.generate(true, "Cluster not found", 401, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterData);
                }
            })
        });
    }; // end of checkCluster

    let updateCluster = () => {
        console.log("updateCluster");
        return new Promise((resolve, reject) => {
            Cluster.findOneAndUpdate({cluster_name: req.params.cluster_name}, {cnox_engine_url: req.body.cnox_engine_url}, {new: true}, function (err, clusterdetails) {
                if (err) {
                    logger.error("Internal Server error while Update Cluster", "putCnoxEngineUrl => updateCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterdetails);
                }
            })
        });
    }; // end of addCluster

    validatingInputs()
        .then(checkCluster)
        .then(updateCluster)
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            Promise.all([findSocketTotalunseccluster(req, resolve.license_key), findSocketTotalStackList(req, resolve.license_key), findSocketAllTotal(req, resolve.license_key), findSocketLogEvent(req, resolve.license_key), findSocketAllcluster(req, resolve.license_key)])
                .then((data) => {
                    res.status(200).send(resolve);
                })

        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

exports.updatecnoxstack = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.params.cluster_name) {
                if (req.body.cnox_stack) {
                    resolve();
                } else {
                    let apiResponse = response.generate(true, "Required Parameter cnox_stack is missing", 400, null);
                    reject(apiResponse);
                }
            } else {
                let apiResponse = response.generate(true, "Required Parameter cluster_name is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkCluster = () => {
        console.log("checkCluster");
        return new Promise((resolve, reject) => {
            Cluster.find({cluster_name: req.params.cluster_name}, function (err, clusterData) {
                if (err) {
                    logger.error("Internal Server error while fetching Cluster", "updatecnoxstack => checkCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(clusterData)) {
                    logger.error("Cluster Not Exists", "updatecnoxstack => checkCluster()", 5);
                    let apiResponse = response.generate(true, "Cluster Not Exists", 400, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterData);
                }
            })
        });
    }; // end of checkCluster

    let updateCluster = () => {
        console.log("updateCluster");
        return new Promise((resolve, reject) => {
            Cluster.findOneAndUpdate({cluster_name: req.params.cluster_name}, {cnox_stack: req.body.cnox_stack}, {new: true}, function (err, clusterdetails) {
                if (err) {
                    logger.error("Internal Server error while update Cluster", "updatecnoxstack => updateCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterdetails);
                }
            })
        });
    }; // end of updateCluster

    let updateSocket = (finalRes) => {
        console.log("updateSocket");
        return new Promise((resolve, reject) => {
            let socket = req.app.io;
            if (socket && socket !== undefined) {
                socket.to(finalRes.license_key).emit('updatecnoxstack', finalRes);
            }
            resolve(finalRes);
        });
    }; // end of updateSocket

    validatingInputs()
        .then(checkCluster)
        .then(updateCluster)
        .then(updateSocket)
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            Promise.all([findSocketTotalunseccluster(req, resolve.license_key), findSocketTotalStackList(req, resolve.license_key), findSocketAllTotal(req, resolve.license_key), findSocketLogEvent(req, resolve.license_key), findSocketAllcluster(req, resolve.license_key)])
                .then((data) => {
                    res.status(200).send(resolve);
                })

        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

exports.updatemonitorurl = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.params.cluster_name) {
                if (req.body.monitor_url) {
                    resolve();
                } else {
                    let apiResponse = response.generate(true, "Required Parameter monitor_url is missing", 400, null);
                    reject(apiResponse);
                }
            } else {
                let apiResponse = response.generate(true, "Required Parameter cluster_name is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkCluster = () => {
        console.log("checkCluster");
        return new Promise((resolve, reject) => {
            Cluster.find({cluster_name: req.params.cluster_name}, function (err, clusterData) {
                if (err) {
                    logger.error("Internal Server error while fetching Cluster", "updatemonitorurl => checkCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(clusterData)) {
                    logger.error("Cluster Not Exists", "updatemonitorurl => checkCluster()", 5);
                    let apiResponse = response.generate(true, "Cluster Not Exists", 400, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterData);
                }
            })
        });
    }; // end of checkCluster

    let updateCluster = () => {
        console.log("updateCluster");
        return new Promise((resolve, reject) => {
            Cluster.findOneAndUpdate({cluster_name: req.params.cluster_name}, {monitor_url: req.body.monitor_url}, {new: true}, function (err, clusterdetails) {
                if (err) {
                    logger.error("Internal Server error while update Cluster", "updatemonitorurl => updateCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterdetails);
                }
            })
        });
    }; // end of updateCluster

    let updateSocket = (finalRes) => {
        console.log("updateSocket");
        return new Promise((resolve, reject) => {
            let socket = req.app.io;
            if (socket && socket !== undefined) {
                socket.to(finalRes.customer_id).emit('updatemonitorurl', finalRes);
            }
            resolve(finalRes);
        });
    }; // end of updateSocket

    validatingInputs()
        .then(checkCluster)
        .then(updateCluster)
        .then(updateSocket)
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            Promise.all([findSocketTotalunseccluster(req, resolve.license_key), findSocketTotalStackList(req, resolve.license_key), findSocketAllTotal(req, resolve.license_key), findSocketLogEvent(req, resolve.license_key), findSocketAllcluster(req, resolve.license_key)])
                .then((data) => {
                    res.status(200).send(resolve);
                })

        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });

};

exports.updatescannerurl = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.params.cluster_name) {
                if (req.body.scanner_url) {
                    resolve();
                } else {
                    let apiResponse = response.generate(true, "Required Parameter scanner_url is missing", 400, null);
                    reject(apiResponse);
                }
            } else {
                let apiResponse = response.generate(true, "Required Parameter cluster_name is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkCluster = () => {
        console.log("checkCluster");
        return new Promise((resolve, reject) => {
            Cluster.find({cluster_name: req.params.cluster_name}, function (err, clusterData) {
                if (err) {
                    logger.error("Internal Server error while fetching Cluster", "updatescannerurl => checkCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(clusterData)) {
                    logger.error("Cluster Not Exists", "updatescannerurl => checkCluster()", 5);
                    let apiResponse = response.generate(true, "Cluster Not Exists", 400, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterData);
                }
            })
        });
    }; // end of checkCluster

    let updateCluster = () => {
        console.log("updateCluster");
        return new Promise((resolve, reject) => {
            Cluster.findOneAndUpdate({cluster_name: req.params.cluster_name}, {scanner_url: req.body.scanner_url}, {new: true}, function (err, clusterdetails) {
                if (err) {
                    logger.error("Internal Server error while update Cluster", "updatescannerurl => updateCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterdetails);
                }
            })
        });
    }; // end of updateCluster

    let updateSocket = (finalRes) => {
        console.log("updateSocket");
        return new Promise((resolve, reject) => {
            let socket = req.app.io;
            if (socket && socket !== undefined) {
                socket.to(finalRes.customer_id).emit('updatescannerurl', finalRes);
            }
            resolve(finalRes);
        });
    }; // end of updateSocket

    validatingInputs()
        .then(checkCluster)
        .then(updateCluster)
        .then(updateSocket)
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            Promise.all([findSocketTotalunseccluster(req, resolve.license_key), findSocketTotalStackList(req, resolve.license_key), findSocketAllTotal(req, resolve.license_key), findSocketLogEvent(req, resolve.license_key), findSocketAllcluster(req, resolve.license_key)])
                .then((data) => {
                    res.status(200).send(resolve);
                })

        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

exports.updatecomplianceurl = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.params.cluster_name) {
                if (req.body.compliance_url) {
                    resolve();
                } else {
                    let apiResponse = response.generate(true, "Required Parameter compliance_url is missing", 400, null);
                    reject(apiResponse);
                }
            } else {
                let apiResponse = response.generate(true, "Required Parameter cluster_name is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkCluster = () => {
        console.log("checkCluster");
        return new Promise((resolve, reject) => {
            Cluster.find({cluster_name: req.params.cluster_name}, function (err, clusterData) {
                if (err) {
                    logger.error("Internal Server error while fetching Cluster", "updatecomplianceurl => checkCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(clusterData)) {
                    logger.error("Cluster Not Exists", "updatecomplianceurl => checkCluster()", 5);
                    let apiResponse = response.generate(true, "Cluster Not Exists", 400, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterData);
                }
            })
        });
    }; // end of checkCluster

    let updateCluster = () => {
        console.log("updateCluster");
        return new Promise((resolve, reject) => {
            Cluster.findOneAndUpdate({cluster_name: req.params.cluster_name}, {compliance_url: req.body.compliance_url}, {new: true}, function (err, clusterdetails) {
                if (err) {
                    logger.error("Internal Server error while update Cluster", "updatecomplianceurl => updateCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterdetails);
                }
            })
        });
    }; // end of updateCluster

    let updateSocket = (finalRes) => {
        console.log("updateSocket");
        return new Promise((resolve, reject) => {
            let socket = req.app.io;
            if (socket && socket !== undefined) {
                socket.to(finalRes.customer_id).emit('updatecomplianceurl', finalRes);
            }
            resolve(finalRes);
        });
    }; // end of updateSocket


    validatingInputs()
        .then(checkCluster)
        .then(updateCluster)
        .then(updateSocket)
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            Promise.all([findSocketTotalunseccluster(req, resolve.license_key), findSocketTotalStackList(req, resolve.license_key), findSocketAllTotal(req, resolve.license_key), findSocketLogEvent(req, resolve.license_key), findSocketAllcluster(req, resolve.license_key)])
                .then((data) => {
                    res.status(200).send(resolve);
                })

        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

exports.updatecount = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.params.cluster_name) {
                if (req.body.nodes && req.body.pods && req.body.services) {
                    resolve();
                } else {
                    let apiResponse = response.generate(true, "Required Parameter nodes or pods or services is missing", 400, null);
                    reject(apiResponse);
                }
            } else {
                let apiResponse = response.generate(true, "Required Parameter cluster_name is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkCluster = () => {
        console.log("checkCluster");
        return new Promise((resolve, reject) => {
            Cluster.find({cluster_name: req.params.cluster_name}, function (err, clusterData) {
                if (err) {
                    logger.error("Internal Server error while fetching Cluster", "updatecount => checkCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(clusterData)) {
                    logger.error("Cluster Not Exists", "updatecount => checkCluster()", 5);
                    let apiResponse = response.generate(true, "Cluster Not Exists", 400, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterData);
                }
            })
        });
    }; // end of checkCluster

    let updateCluster = () => {
        console.log("updateCluster");
        return new Promise((resolve, reject) => {
            Cluster.findOneAndUpdate({cluster_name: req.params.cluster_name}, {
                Nodes: req.body.nodes,
                Pods: req.body.pods,
                Services: req.body.services
            }, {new: true}, function (err, clusterdetails) {
                if (err) {
                    logger.error("Internal Server error while update Cluster", "updatecount => updateCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterdetails);
                }
            })
        });
    }; // end of updateCluster

    validatingInputs()
        .then(checkCluster)
        .then(updateCluster)
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            console.log('res', resolve.license_key);
            Promise.all([findSocketTotalunseccluster(req, resolve.license_key), findSocketTotalStackList(req, resolve.license_key), findSocketAllTotal(req, resolve.license_key), findSocketLogEvent(req, resolve.license_key), findSocketAllcluster(req, resolve.license_key)])
                .then((data) => {
                    res.status(200).send(resolve);
                })

        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

exports.createlogevent = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.body.log_string && req.body.customer_id) {
                resolve();
            } else {
                let apiResponse = response.generate(true, "Required Parameter log_string or customer_idis missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let addLogtable = () => {
        console.log("addLogtable");
        return new Promise((resolve, reject) => {
            var timestamp = new Date();
            Logtable.create({
                timestamp: timestamp,
                log_string: req.body.log_string,
                customer_id: req.body.customer_id
            }, function (err, logtableDetails) {
                if (err) {
                    logger.error("Internal Server error while create Logtable", "createlogevent => addLogtable()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(logtableDetails);
                }
            })
        });
    }; // end of updateCluster

    validatingInputs()
        .then(addLogtable)
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            Promise.all([findSocketTotalunseccluster(req, req.body.customer_id), findSocketTotalStackList(req, req.body.customer_id), findSocketAllTotal(req, req.body.customer_id), findSocketLogEvent(req, req.body.customer_id), findSocketAllcluster(req, req.body.customer_id)])
                .then((data) => {
                    res.status(200).send(resolve);
                })

        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });

};

exports.findAllcluster = (req, res) => {
    const socket = req.app.io;
    let customer_id = req.user.customer_id;
    Cluster.find({license_key: customer_id}).exec((err, result) => {
        if (err) throw err;
        if (socket !== undefined) {
            socket.to(customer_id).emit('cluster', result);
        }
        return res.send(result);
    });

};

exports.findunseccluster = (req, res) => {
    const socket = req.app.io;
    let customer_id = req.user.customer_id;
    Cluster.find({cnox_stack: {$in: ['', 'unsecured']}, license_key: customer_id}).exec((err, result) => {
        if (err) throw err;
        if (socket !== undefined) {
            socket.to(customer_id).emit('unseccluster', result);

        }
        return res.send(result);
    });

};

exports.findAlllogevent = (req, res) => {
    const socket = req.app.io;
    let customer_id = req.user.customer_id;
    Logtable.find({customer_id: customer_id}).sort({timestamp: -1})
        .exec((err, result) => {
            if (err) throw err;
            if (socket !== undefined) {
                socket.to(customer_id).emit('logs', result);
            }
            return res.send(result);
        });
};

exports.findAlltotals = (req, res) => {
    const socket = req.app.io;
    let customer_id = req.user.customer_id;
    Cluster.find({license_key: customer_id}).exec((err, result) => {
        if (err) throw err;
        let totalNodes = 0;
        let totalPods = 0;
        let totalServices = 0;
        result.filter((x) => {
            totalNodes += Number(x.Nodes)
            totalPods += Number(x.Pods)
            totalServices += Number(x.Services)
        })
        result = {
            TotalNodes: totalNodes,
            TotalPods: totalPods,
            TotalServices: totalServices
        }
        if (socket !== undefined) {
            socket.to(customer_id).emit('totals', result);
        }
        return res.send(result);
    });

};

exports.findAllstacklist = (req, res) => {
    const socket = req.app.io;
    let customer_id = req.user.customer_id;
    Cluster.find({cnox_stack: {$nin:['', null, 'unsecured']}, license_key:customer_id}).exec((err, result) => {
        if (err) throw err;
        let gold_stack = 0;
        let silver_stack = 0;
        let bronze_stack = 0;
        let totalgoldNodes = 0;
        let totalsilverNodes = 0;
        let totalbronzeNodes = 0;
        result.filter((x) => {
            if (x.cnox_stack === 'gold_stack') {
                gold_stack++;
                totalgoldNodes += Number(x.Nodes)
            } else if (x.cnox_stack === 'silver_stack') {
                silver_stack++;
                totalsilverNodes += Number(x.Nodes)
            } else if (x.cnox_stack === 'bronze_stack') {
                bronze_stack++
                totalbronzeNodes += Number(x.Nodes)
            }
        })
        let gold = {
            Totalstack: gold_stack,
            TotalNodes: totalgoldNodes,

        }
        let silver = {
            Totalstack: silver_stack,
            TotalNodes: totalsilverNodes,

        }
        let bronze = {
            Totalstack: bronze_stack,
            TotalNodes: totalbronzeNodes,

        }
        result = {
            Gold: gold,
            Silver: silver,
            Bronze: bronze
        }
        if (socket !== undefined) {
            socket.to(customer_id).emit('list', result);
        }
        return res.send(result);
    });

};

exports.deleteCluster = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.params.cluster_name) {
                resolve();
            } else {
                let apiResponse = response.generate(true, "Required Parameter cluster_name is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkCluster = () => {
        console.log("checkCluster");
        return new Promise((resolve, reject) => {
            Cluster.find({cluster_name: req.params.cluster_name}, function (err, clusterData) {
                if (err) {
                    logger.error("Internal Server error while fetching Cluster", "deleteCluster => checkCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(clusterData)) {
                    logger.error("Cluster Not Exists", "deleteCluster => checkCluster()", 5);
                    let apiResponse = response.generate(true, "Cluster Not Exists", 400, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterData);
                }
            })
        });
    }; // end of checkCluster

    let updateCluster = () => {
        console.log("updateCluster");
        return new Promise((resolve, reject) => {
            Cluster.findOneAndRemove({cluster_name: req.params.cluster_name}, function (err, clusterdetails) {
                if (err) {
                    logger.error("Internal Server error while update Cluster", "deleteCluster => updateCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterdetails);
                }
            })
        });
    }; // end of updateCluster

    validatingInputs()
        .then(checkCluster)
        .then(updateCluster)
        .then((resolve) => {
            res.status(200).send('Received a DELETE HTTP method' + req.params.cluster_name);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
}

exports.deleteCnoxStack = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.params.cluster_name) {
                resolve();
            } else {
                let apiResponse = response.generate(true, "Required Parameter cluster_name is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkCluster = () => {
        console.log("checkCluster");
        return new Promise((resolve, reject) => {
            Cluster.findOne({cluster_name: req.params.cluster_name}, function (err, clusterData) {
                if (err) {
                    logger.error("Internal Server error while fetching Cluster", "deleteCluster => checkCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(clusterData)) {
                    logger.error("Cluster Not Exists", "deleteCluster => checkCluster()", 5);
                    let apiResponse = response.generate(true, "Cluster Not Exists", 400, null);
                    reject(apiResponse);
                } else {
                    resolve(clusterData);
                }
            })
        });
    }; // end of checkCluster

    let updateCluster = (clusterData) => {
        console.log("updateCluster");
        return new Promise((resolve, reject) => {
            clusterData.cnox_stack = 'Stack delete in progress';
            clusterData.save();
            resolve(clusterData)
        });
    }; // end of updateCluster

    validatingInputs()
        .then(checkCluster)
        .then(updateCluster)
        .then((resolve) => {
            res.status(200).send(resolve);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
}
