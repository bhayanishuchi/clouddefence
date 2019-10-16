const express = require('express');
const router = express.Router();
const policycontroller = require("./../../app/controllers/policycontroller");
const appConfig = require("./../../config/appConfig")

const middleware = require('../middlewares/auth');
module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.
    // app.post('/policy',[policycontroller.createPolicy]);
    // app.delete('/policy/:policyname/:customer_id',[policycontroller.deletePolicy]);



}
