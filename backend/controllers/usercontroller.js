// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var mongoose = require('mongoose');
var Cluster = require('../models/cluster');
var Logtable = require('../models/logtable');

exports.create = (req, res) => {
    var myobj = new Cluster({ cluster_name: req.body.cluster_name, cnox_stack: req.body.cnox_stack,cnox_endpoint:req.cnox_endpoint, Nodes: req.body.Nodes, Pods: req.body.Pods,
        Services: req.body.Services, monitor_url: req.body.monitor_url, scanner_url: req.body.scanner_url});
    console.log("myobj", myobj);
    myobj.save(function(err, res) {
        if (err) {
            console.log("errorr")
            throw err};
        console.log("cluster inserted");
    });
    // return res.send('Received a POST HTTP method');
    const socket = req.app.io;
    Cluster.find({ $or:[{cnox_stack:{$ne:''}}, {cnox_stack:{$ne:null}}]}).exec((err, result) => {
        if (err) throw err;
        let gold_stack = 0;
        let silver_stack = 0;
        let bronze_stack = 0;
        let totalgoldNodes = 0;
        let totalsilverNodes = 0;
        let totalbronzeNodes = 0;
        result.filter((x)=>{
            if(x.cnox_stack === 'gold_stack'){
                gold_stack++;
                totalgoldNodes += Number(x.Nodes)
            }else if(x.cnox_stack === 'silver_stack'){
                silver_stack++;
                totalsilverNodes += Number(x.Nodes)
            }else if(x.cnox_stack === 'bronze_stack'){
                bronze_stack++
                totalbronzeNodes += Number(x.Nodes)
            }
        })
        let gold ={
            Totalstack : gold_stack,
            TotalNodes : totalgoldNodes,

        }
        let silver ={
            Totalstack : silver_stack,
            TotalNodes : totalsilverNodes,

        }
        let bronze ={
            Totalstack : bronze_stack,
            TotalNodes : totalbronzeNodes,

        }
        result = {
            Gold : gold,
            Silver : silver,
            Bronze : bronze
        }
        socket.emit('list',result);
        return res.send(result);
    });
};

exports.updatecnoxstack = (req,res) => {
    const socket = req.app.io;
    var object = {_id : req.params.id}
    var query = { cnox_stack: req.body.cnox_stack };
    if(query.cnox_stack){
    Cluster.updateOne(object, query, function(err, result) {
        if (err) throw err;
        socket.emit('updatecnoxstack',result);
        return res.send('Stack successfully updated to'+ result);
    });
    }else{
        console.log("cnox_stack is empty");
        }

};

exports.updatemonitorurl = (req,res) => {
    const socket = req.app.io;
    var object = {_id : req.params.id}
    var query = { monitor_url: req.body.monitor_url };
    if(query.monitor_url) {
        Cluster.updateOne(object, query, function (err, result) {
            if (err) throw err;
            socket.emit('updatemonitorurl',result);
            return res.send(result);
            // return res.send('monitor url sucessfullly updated');
        });
    }else{
        console.log("monitor_url is empty");
    }

};

exports.updatescannerurl = (req,res) => {
    const socket = req.app.io;
    var object = {_id : req.params.id}
    var query = { scanner_url: req.body.scanner_url };
    if(query.scanner_url) {
        Cluster.updateOne(object, query, function (err, result) {
            if (err) throw err;
            socket.emit('updatescannerurl',result);
            return res.send(result);
            // return res.send('scanner url sucessfullly updated');
        });
    }else{
        console.log("scanner_url is empty");
    }
};

exports.updatecount = (req,res) => {
    const socket = req.app.io;
    var object = {_id : req.params.id}
    var query = { Nodes: req.body.nodes, Pods: req.body.pods, Services:req.body.services};
    if(query.Nodes & query.Pods & query.Services) {
        Cluster.updateMany(object, query, function (err, result) {
            if (err) throw err;
            socket.emit('updatecount',result);
            return res.send(result);
        });
    }else{
        console.log("count are empty");
    }
};

exports.createlogevent = (req, res) => {
    var log_string = req.body.log_string;
    if(log_string) {
        var timestamp = new Date();
        var myobj = new Logtable({timestamp: timestamp, log_string: log_string});
        console.log("myobj", myobj);
        myobj.save(function (err, res) {
            if (err) {
                console.log("errorr")
                throw err
            };
            console.log("logevent inserted");
        });
    }else{
        console.log("log_string is empty")
    }
    return res.send('Received a POST HTTP method');
};

exports.findAllcluster = (req, res) => {
    const socket = req.app.io;
    Cluster.find({}).exec((err, result) => {
        if (err) throw err;
        console.log(result);
        socket.emit('cluster',result);
        return res.send(result);
    });

};

exports.findunseccluster = (req, res) => {
    const socket = req.app.io;
    Cluster.find({cnox_stack : {$in: ['','unsecured']}}).exec((err, result) => {
        if (err) throw err;
        console.log(result);
        socket.emit('unseccluster',result);
        return res.send(result);
    });

};

exports.findAlllogevent = (req, res) => {
    const socket = req.app.io;
    Logtable.find({}).exec((err, result) => {
        if (err) throw err;
        console.log(result);
        socket.emit('logs',result);
        return res.send(result);
    });
};

exports.findAlltotals = (req, res) => {
    const socket = req.app.io;
    console.log('socket', Object.keys(socket.nsps['/'].sockets)[0])
    Cluster.find({}).exec((err, result) => {
        if (err) throw err;
        let totalNodes = 0;
        let totalPods = 0;
        let totalServices = 0;
        result.filter((x)=>{
            totalNodes += Number(x.Nodes)
            totalPods += Number(x.Pods)
            totalServices += Number(x.Services)
        })
        result = {
            TotalNodes : totalNodes,
            TotalPods : totalPods,
            TotalServices : totalServices
        }
        socket.emit('totals',result);
        return res.send(result);
    });

};

exports.findAllstacklist = (req, res) => {
    const socket = req.app.io;
    Cluster.find({ $or:[{cnox_stack:{$ne:''}}, {cnox_stack:{$ne:null}}]}).exec((err, result) => {
        if (err) throw err;
        let gold_stack = 0;
        let silver_stack = 0;
        let bronze_stack = 0;
        let totalgoldNodes = 0;
        let totalsilverNodes = 0;
        let totalbronzeNodes = 0;
        result.filter((x)=>{
            if(x.cnox_stack === 'gold_stack'){
                gold_stack++;
                totalgoldNodes += Number(x.Nodes)
            }else if(x.cnox_stack === 'silver_stack'){
                silver_stack++;
                totalsilverNodes += Number(x.Nodes)
            }else if(x.cnox_stack === 'bronze_stack'){
                bronze_stack++
                totalbronzeNodes += Number(x.Nodes)
            }
        })
        let gold ={
            Totalstack : gold_stack,
            TotalNodes : totalgoldNodes,

        }
        let silver ={
            Totalstack : silver_stack,
            TotalNodes : totalsilverNodes,

        }
        let bronze ={
            Totalstack : bronze_stack,
            TotalNodes : totalbronzeNodes,

        }
        result = {
            Gold : gold,
            Silver : silver,
            Bronze : bronze
        }
        socket.emit('list',result);
        return res.send(result);
    });

};
