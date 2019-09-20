var bodyParser = require('body-parser')
var express = require('express');
var cors = require('cors');
const UserController = require('./controllers/usercontroller');
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/mydb";

mongoose.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
});


var app = express();


app.use(cors());
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    next();
});


app.use(bodyParser.json())

app.post('/', [UserController.create]);

app.put('/cluster/:cluster_name/stack',[UserController.updatecnoxstack]);
app.put('/cluster/:cluster_name/monitor',[UserController.updatemonitorurl]);
app.put('/cluster/:cluster_name/scanner',[UserController.updatescannerurl]);
app.put('/cluster/:cluster_name/resources',[UserController.updatecount]);
app.post('/logevent',[UserController.createlogevent]);
app.get('/cluster',[UserController.findAllcluster]);
app.get('/unseccluster',[UserController.findunseccluster]);
app.get('/log',[UserController.findAlllogevent]);
app.get('/totals',[UserController.findAlltotals]);
app.get('/lists',[UserController.findAllstacklist]);



app.listen(3001, () =>
    console.log(`Example app listening on port 3001!`),
);

let server = require('http').createServer(app);
server.listen(3000, () => {
    console.log(`server listening on port 3000`);
});
let io = require('socket.io').listen(server);
global.io = io;


io.on('connection', function(socket) {
    console.log('client connected');
    app.io = io;
});
