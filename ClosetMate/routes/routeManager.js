import express from 'express';
import dashboardRouter from './dashboardRoute.js';
import loginRouter from './loginRoute.js';
import userRouter from './userRoute.js'
import { __dirname } from '../dirname.js';
import path from 'path';

const routeManager = express.Router();

const test = routeManager.use(express.static(path.join(__dirname, "view", "frontend")));
console.log();

routeManager.use(dashboardRouter);
routeManager.use(loginRouter);
routeManager.use(userRouter);

export default routeManager;
