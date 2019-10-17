const express = require('express');
const router = express.Router();
const usercontroller = require("./../../app/controllers/usercontroller");
const appConfig = require("./../../config/appConfig")

const middleware = require('../middlewares/auth');
module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.
    app.post('/user',[usercontroller.createUser]);

    app.post('/user/login',[usercontroller.loginUser]);

    app.delete('/user/:username/:customer_id',[usercontroller.deleteUser]);

    // app.get('/user',[usercontroller.getCustomerAll]);

    // app.get('/user/:customer_name',[usercontroller.getCustomerDetail]);



}
