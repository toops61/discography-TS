// Imports
const express = require('express');
const user = require('./controllers/user');

// Router
exports.router = (() => {
    const apiRouter = express.Router();

    // User routes
    apiRouter.route('/users/subscribe').post(user.subscribe);
    apiRouter.route('/users/connect').post(user.connect);

    return apiRouter;
})();