const express = require('express');
const router = express.Router();
const clustercontroller = require("../controllers/clustercontroller");
const appConfig = require("./../../config/appConfig")

const middleware = require('../middlewares/auth');

const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync('./upload/')) {
            var mkdirp = require('mkdirp');
            mkdirp('./upload/');
        }
        cb(null, './upload/')
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + file.originalname);
    }
})

const upload = multer({storage: storage});

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.
    app.post('/', [clustercontroller.createCluster]);
    app.put('/cluster/:cluster_name/engine', [clustercontroller.putCnoxEngineUrl]);

    app.put('/cluster/:cluster_name/stack', [clustercontroller.updatecnoxstack]);
    app.put('/cluster/:cluster_name/monitor', [clustercontroller.updatemonitorurl]);
    app.put('/cluster/:cluster_name/scanner', [clustercontroller.updatescannerurl]);
    app.put('/cluster/:cluster_name/resources', [clustercontroller.updatecount]);
    app.put('/cluster/:cluster_name/compliance', [clustercontroller.updatecomplianceurl]);
    app.post('/logevent', [clustercontroller.createlogevent]);
    app.get('/cluster', middleware.isAuthorize, middleware.joinRoom, [clustercontroller.findAllcluster]);
    app.get('/unseccluster', middleware.isAuthorize, middleware.joinRoom, [clustercontroller.findunseccluster]);
    app.get('/log', middleware.isAuthorize, middleware.joinRoom, [clustercontroller.findAlllogevent]);
    app.get('/totals', middleware.isAuthorize, middleware.joinRoom, [clustercontroller.findAlltotals]);
    app.get('/lists', middleware.isAuthorize, middleware.joinRoom, [clustercontroller.findAllstacklist]);
    app.delete('/deletecluster/:cluster_name', [clustercontroller.deleteCluster]);
    app.delete('/cluster/:cluster_name/cnox_stack', [clustercontroller.deleteCnoxStack]);

    app.post('/workloadcompliancereport', upload.single('file'), [clustercontroller.workloadcompliancereport]);
    app.get('/getworkloadcompliancereport/:cluster_name/:customer_id',  [clustercontroller.getWorkLoad]);

    app.post('/clustercompliancereport', [clustercontroller.clustercompliancereport]);

}
