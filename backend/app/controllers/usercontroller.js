const shortid = require('shortid');
const mongoose = require('mongoose');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib')

const Customer = mongoose.model('Customer');
const Cluster = mongoose.model('Cluster');


var Logtable = require('../models/logtable');

const findSocketTotalunseccluster = function (req) {
    console.log('==== update Socket start ==== ');
    console.log('findSocketTotalunseccluster ');
    const socket = req.app.io;
    return new Promise((resolve, reject) => {
        Cluster.find({cnox_stack: {$in: ['', 'unsecured']}}).exec((err, result) => {
            if (err) throw err;
            if (socket !== undefined) {
                socket.emit('unseccluster', result);

            }
            resolve(result);
        });
    })
}
const findSocketTotalStackList = function (req) {
    console.log('findSocketTotalStackList ');
    const socket = req.app.io;
    return new Promise((resolve, reject) => {
        Cluster.find({$or: [{cnox_stack: {$ne: ''}}, {cnox_stack: {$ne: null}}]}).exec((err, result) => {
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
                socket.emit('list', result);
            }
            resolve(result);
        });
    })
}
const findSocketLogEvent = function (req) {
    console.log('findSocketLogEvent ');
    return new Promise((resolve, reject) => {
        const socket = req.app.io;
        Logtable.find({}).sort({timestamp: -1}).exec((err, result) => {
            if (err) throw err;
            if (socket !== undefined) {
                socket.emit('logs', result);
            }
            resolve(result);
        });
    })
}
const findSocketAllTotal = function (req) {
    console.log('findSocketAllTotal ');
    return new Promise((resolve, reject) => {
        const socket = req.app.io;
        Cluster.find({}).exec((err, result) => {
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
                socket.emit('totals', result);
            }
            resolve(result);
        });
    });
}
const findSocketAllcluster = function (req) {
    console.log('findSocketAllcluster ');
    return new Promise((resolve, reject) => {
        const socket = req.app.io;
        Cluster.find({}).exec((err, result) => {
            if (err) throw err;
            if (socket !== undefined) {
                socket.emit('cluster', result);
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
            if (req.body.customer_id) {
                if (req.body.cluster_name) {
                    resolve();
                } else {
                    let apiResponse = response.generate(true, "Required Parameter cluster_name is missing", 400, null);
                    reject(apiResponse);
                }
            } else {
                let apiResponse = response.generate(true, "Required Parameter customer_id is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkCustomer = () => {
        console.log("checkCustomer");
        return new Promise((resolve, reject) => {
            Customer.findOne({customer_id: req.body.customer_id}, function (err, customerDetail) {
                if (err) {
                    logger.error("Internal Server error while fetching customer", "createCustomer => checkCustomer()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(customerDetail)) {
                    logger.error("Customer Not Found", "createCluster => checkCustomer()", 5);
                    let apiResponse = response.generate(true, "Customer Not Found", 401, null);
                    reject(apiResponse);
                } else {
                    resolve(customerDetail);
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
            Promise.all([findSocketTotalunseccluster(req), findSocketTotalStackList(req), findSocketAllTotal(req), findSocketLogEvent(req), findSocketAllcluster(req)])
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
                if(req.body.cnox_engine_url) {
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
                    let apiResponse = response.generate(true, "Cluster not found", 400, null);
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
            Promise.all([findSocketTotalunseccluster(req), findSocketTotalStackList(req), findSocketAllTotal(req), findSocketLogEvent(req), findSocketAllcluster(req)])
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

    /*let validatingInputs = () => {
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
                    logger.error("Internal Server error while fetching Cluster", "createCustomer => checkCluster()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(clusterData)) {
                    resolve(customerDetail);
                } else {
                    logger.error("Cluster Already Exists", "createCluster => checkCluster()", 5);
                    let apiResponse = response.generate(true, "Cluster Already Exists", 400, null);
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
    }; // end of addCluster*/

    const socket = req.app.io;
    var object = {cluster_name: req.params.cluster_name}
    var query = {cnox_stack: req.body.cnox_stack};
    if (query.cnox_stack) {
        Cluster.updateOne(object, query, function (err, result) {
            if (err) throw err;
            if (socket !== undefined) {
                socket.emit('updatecnoxstack', result);
            }
            findSocketTotalunseccluster(req)
                .then(findSocketTotalStackList(req))
                .then(findSocketAllTotal(req))
                .then(findSocketLogEvent(req))
                .then(findSocketAllcluster(req))
                .then((data) => {
                    return res.send('Stack successfully updated to' + result);
                })

        });
    } else {
        console.log("cnox_stack is empty");
        return res.send('cnox_stack is empty');
    }

    /*validatingInputs()
        .then(checkCluster)
        .then(addCluster)
        .then((resolve) => {
            // let apiResponse = response.generate(false, "Customer Created Successfully!!", 200, resolve);
            Promise.all([findSocketTotalunseccluster(req), findSocketTotalStackList(req), findSocketAllTotal(req), findSocketLogEvent(req), findSocketAllcluster(req)])
                .then((data) => {
                    res.status(200).send(resolve);
                })

        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });*/

};

exports.updatemonitorurl = (req, res) => {
    const socket = req.app.io;
    var object = {cluster_name: req.params.cluster_name}
    var query = {monitor_url: req.body.monitor_url};
    if (query.monitor_url) {
        Cluster.updateOne(object, query, function (err, result) {
            if (err) throw err;
            if (socket !== undefined) {
                socket.emit('updatemonitorurl', result);
            }
            findSocketTotalunseccluster(req)
                .then(findSocketTotalStackList(req))
                .then(findSocketAllTotal(req))
                .then(findSocketLogEvent(req))
                .then(findSocketAllcluster(req))
                .then((data) => {
                    return res.send(data);
                })
            // return res.send('monitor url sucessfullly updated');
        });
    } else {
        console.log("monitor_url is empty");
        return res.send('monitor_url is empty');
    }

};

exports.updatescannerurl = (req, res) => {
    const socket = req.app.io;
    var object = {cluster_name: req.params.cluster_name}
    var query = {scanner_url: req.body.scanner_url};
    if (query.scanner_url) {
        Cluster.updateOne(object, query, function (err, result) {
            if (err) throw err;
            if (socket !== undefined) {
                socket.emit('updatescannerurl', result);
            }
            findSocketTotalunseccluster(req)
                .then(findSocketTotalStackList(req))
                .then(findSocketAllTotal(req))
                .then(findSocketLogEvent(req))
                .then(findSocketAllcluster(req))
                .then((data) => {
                    return res.send(data);
                })
            // return res.send('scanner url sucessfullly updated');
        });
    } else {
        console.log("scanner_url is empty");
        return res.send('scanner_url is empty');
    }
};

exports.updatecomplianceurl = (req, res) => {
    const socket = req.app.io;
    var object = {cluster_name: req.params.cluster_name}
    var query = {compliance_url: req.body.compliance_url};
    if (query.compliance_url) {
        Cluster.updateOne(object, query, function (err, result) {
            if (err) throw err;
            if (socket !== undefined) {
                socket.emit('updatecomplianceurl', result);
            }
            findSocketTotalunseccluster(req)
                .then(findSocketTotalStackList(req))
                .then(findSocketAllTotal(req))
                .then(findSocketLogEvent(req))
                .then(findSocketAllcluster(req))
                .then((data) => {
                    return res.send(data);
                })
        });
    } else {
        console.log("compliance_url is empty");
        return res.send('compliance_url is empty');
    }
};

exports.updatecount = (req, res) => {
    const socket = req.app.io;
    var object = {cluster_name: req.params.cluster_name};
    var query = {Nodes: req.body.nodes, Pods: req.body.pods, Services: req.body.services};
    if (query.Nodes && query.Pods && query.Services) {
        Cluster.findOneAndUpdate(object, query, function (err, result) {
            if (err) throw err;
            findSocketTotalunseccluster(req)
                .then(findSocketTotalStackList(req))
                .then(findSocketAllTotal(req))
                .then(findSocketLogEvent(req))
                .then(findSocketAllcluster(req))
                .then((data) => {
                    return res.send(data);
                })
        });
    } else {
        console.log("count are empty");
        return res.send('count are empty');
    }
};

exports.createlogevent = (req, res) => {
    var log_string = req.body.log_string;
    if (log_string) {
        var timestamp = new Date();
        var myobj = new Logtable({timestamp: timestamp, log_string: log_string});
        console.log("myobj", myobj);
        myobj.save(function (err, response) {
            if (err) {
                console.log("errorr")
                throw err
            }
            ;
            console.log("logevent inserted");
            findSocketTotalunseccluster(req)
                .then(findSocketTotalStackList(req))
                .then(findSocketAllTotal(req))
                .then(findSocketLogEvent(req))
                .then(findSocketAllcluster(req))
                .then((data) => {
                    return res.send(data);
                })

        });
    } else {
        console.log("log_string is empty")
        return res.send('log_string is empty');
    }

};

exports.findAllcluster = (req, res) => {
    const socket = req.app.io;
    Cluster.find({}).exec((err, result) => {
        if (err) throw err;
        if (socket !== undefined) {
            socket.emit('cluster', result);
        }
        return res.send(result);
    });

};

exports.findunseccluster = (req, res) => {
    const socket = req.app.io;
    Cluster.find({cnox_stack: {$in: ['', 'unsecured']}}).exec((err, result) => {
        if (err) throw err;
        if (socket !== undefined) {
            socket.emit('unseccluster', result);

        }
        return res.send(result);
    });

};

exports.findAlllogevent = (req, res) => {
    const socket = req.app.io;
    Logtable.find({}).sort({timestamp: -1})
        .exec((err, result) => {
            if (err) throw err;
            if (socket !== undefined) {
                socket.emit('logs', result);
            }
            return res.send(result);
        });
};

exports.findAlltotals = (req, res) => {
    const socket = req.app.io;
    Cluster.find({}).exec((err, result) => {
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
            socket.emit('totals', result);
        }
        return res.send(result);
    });

};

exports.findAllstacklist = (req, res) => {
    const socket = req.app.io;
    Cluster.find({$or: [{cnox_stack: {$ne: ''}}, {cnox_stack: {$ne: null}}]}).exec((err, result) => {
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
            socket.emit('list', result);
        }
        return res.send(result);
    });

};

exports.deleteCluster = (req, res) => {
    var myquery = {cluster_name: req.params.cluster_name};
    Cluster.deleteOne(myquery).exec((err, obj) => {
        if (err) throw err;
        console.log("1 document deleted");
        return res.send('Received a DELETE HTTP method' + req.params.cluster_name);
    });
}

/*
module.exports = {
    createCluster: createCluster,
    putCnoxEngineUrl: putCnoxEngineUrl,

    updatecnoxstack: updatecnoxstack,
    updatemonitorurl: updatemonitorurl,
    updatescannerurl: updatescannerurl,
    updatecomplianceurl: updatecomplianceurl,
    updatecount: updatecount,
    createlogevent: createlogevent,
    findAllcluster: findAllcluster,
    findunseccluster: findunseccluster,
    findAlllogevent: findAlllogevent,
    findAlltotals: findAlltotals,
    findAllstacklist: findAllstacklist,
    deleteCluster: deleteCluster,
}
*/
