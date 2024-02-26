import express, { Express, Request, Response } from 'express';
import {connect} from 'mongoose';
import {config} from 'dotenv';
config();
//const path = require('path');

const app: Express = express();

import userRoutes from './routes/userRoutes';
import discsRoutes from './routes/discsRoutes';
//import wishesRoutes from './routes/wishesRoutes';

const uri = process.env.URI || '';

connect(uri)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(error => console.log('Connexion à MongoDB échouée !',error));

app.use((req: Request, res: Response, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

//app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/', userRoutes);
app.use('/', discsRoutes);
//app.use('/', wishesRoutes);

export default app;