const express = require('express');
const router = express.Router();
const usercontroller = require("./../../app/controllers/usercontroller");
const appConfig = require("./../../config/appConfig");

const middleware = require('../middlewares/auth');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.
    app.post('/user',[usercontroller.createUser]);

    app.post('/user/passwordupdate',[usercontroller.passwordUpdate]);

    app.post('/user/login',[usercontroller.loginUser]);

    app.get('/user/:username/:customer_id',[usercontroller.getUser]);

    app.delete('/user/:username/:customer_id',[usercontroller.deleteUser]);


}
