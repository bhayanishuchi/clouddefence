const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/usercontroller");
const appConfig = require("./../../config/appConfig")

const middleware = require('../middlewares/auth');
module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.
    app.post('/', [userController.createCluster]);
    app.put('/cluster/:cluster_name/engine',[userController.putCnoxEngineUrl]);

    app.put('/cluster/:cluster_name/stack',[userController.updatecnoxstack]);
    app.put('/cluster/:cluster_name/monitor',[userController.updatemonitorurl]);
    app.put('/cluster/:cluster_name/scanner',[userController.updatescannerurl]);
    app.put('/cluster/:cluster_name/resources',[userController.updatecount]);
    app.put('/cluster/:cluster_name/compliance',[userController.updatecomplianceurl]);
    app.post('/logevent',[userController.createlogevent]);
    app.get('/cluster',[userController.findAllcluster]);
    app.get('/unseccluster',[userController.findunseccluster]);
    app.get('/log',[userController.findAlllogevent]);
    app.get('/totals',[userController.findAlltotals]);
    app.get('/lists',[userController.findAllstacklist]);
    app.delete('/deletecluster/:cluster_name',[userController.deleteCluster]);

}
