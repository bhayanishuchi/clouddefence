// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/mydb";
// var mongoose = require('mongoose');
var Cluster = require('../models/cluster');
var Logtable = require('../models/logtable');
var Customer = require('../models/customer');

exports.create = (req, res) => {
    if (req.body.cluster_name) {
        Cluster.find({cluster_name: req.body.cluster_name}, function (err, data) {
            if (err) {
                console.log('err', err);
                res.send(err);
            } else {
                if (data.length > 0) {
                    console.log('This cluster_name already Exist, try other cluster_name');
                    res.send('This cluster_name already Exist, try other cluster_name');
                } else {
                    Customer.findOne({customer_id:req.body.customer_id, status: 'Activate'},function (err,customer) {
                        if(err){
                            console.log('err', err);
                            res.send(err);
                        } else {
                            if(customer !== null){
                                var myobj = new Cluster({
                                    cluster_name: req.body.cluster_name,
                                    cnox_stack: req.body.cnox_stack,
                                    cnox_engine_url: req.cnox_engine_url,
                                    Nodes: req.body.Nodes,
                                    license_key: customer.customer_id,
                                    Pods: req.body.Pods,
                                    Services: req.body.Services,
                                    monitor_url: req.body.monitor_url,
                                    scanner_url: req.body.scanner_url,
                                    compliance_url: req.body.compliance_url
                                });
                                myobj.save(function (err, res1) {
                                    if (err) {
                                        console.log("errorr", err)
                                        throw err
                                    } else {
                                        console.log("cluster inserted");
                                        findSocketTotalunseccluster(req)
                                            .then(findSocketTotalStackList(req))
                                            .then(findSocketAllTotal(req))
                                            .then(findSocketLogEvent(req))
                                            .then(findSocketAllcluster(req))
                                            .then((data) => {
                                                return res.send(data);
                                            })
                                    }
                                });
                            } else {
                                console.log('Customer Not Found');
                                res.send('Customer Not Found');
                            }
                        }
                    })
                }
            }
        })
    } else {
        res.send('Required Parameter cluster_name is missing')
    }

    // return res.send('Received a POST HTTP method');

};

exports.updatecnoxstack = (req, res) => {
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
exports.delete = (req, res) => {
    var myquery = {cluster_name: req.params.cluster_name};
    Cluster.deleteOne(myquery).exec((err, obj) => {
        if (err) throw err;
        console.log("1 document deleted");
        return res.send('Received a DELETE HTTP method' + req.params.cluster_name);
    });
}


const findSocketTotalStackList = function (req) {
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
const findSocketTotalunseccluster = function (req) {
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
const findSocketLogEvent = function (req) {
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
    return new Promise((resolve, reject) => {
        const socket = req.app.io;
        Cluster.find({}).exec((err, result) => {
            if (err) throw err;
            if (socket !== undefined) {
                socket.emit('cluster', result);
            }
            resolve(result);
        });
    });
}
