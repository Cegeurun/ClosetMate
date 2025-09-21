import express from 'express';
import homeRouter from './homeRoute.js';
import loginRouter from './loginRoute.js';
import { __dirname } from '../dirname.js';
import path from 'path';

const routeManager = express.Router();

const test = routeManager.use(express.static(path.join(__dirname, "view", "frontend")));
console.log();

routeManager.use(homeRouter);
routeManager.use(loginRouter);

export default routeManager;
