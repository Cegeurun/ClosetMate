import express from 'express';
import routeManager from './routes/routeManager.js'
import {pool} from './model/loginModel.js';
import path from 'path';
import { __dirname } from './dirname.js';
// import modelManager from './model/modelManager.js';
// import controllerManager from './controller/controllerManager.js';

const app = express();

// Load folders
app.use('/css',  express.static(path.join(__dirname, 'view', 'frontend', 'public', 'css')));
app.use('/js',   express.static(path.join(__dirname, 'view', 'frontend', 'public', 'js')));
app.use('/img',  express.static(path.join(__dirname, 'view', 'frontend', 'public', 'images')));

console.log(__dirname);

// Load Connection Pool
pool;

app.use(routeManager);
// app.use(modelManager);
// app.use(controllerManager);




app.listen(3000, 'localhost');
