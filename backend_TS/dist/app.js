"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
//const path = require('path');
const app = (0, express_1.default)();
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const discsRoutes_1 = __importDefault(require("./routes/discsRoutes"));
//import wishesRoutes from './routes/wishesRoutes';
const uri = process.env.URI || '';
(0, mongoose_1.connect)(uri)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(error => console.log('Connexion à MongoDB échouée !', error));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(express_1.default.json());
//app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/', userRoutes_1.default);
app.use('/', discsRoutes_1.default);
//app.use('/', wishesRoutes);
exports.default = app;
