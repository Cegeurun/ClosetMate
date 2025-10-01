import express from 'express';
import loginModel from './loginModel.js';

const modelManager = express.Router();
modelManager.use(loginModel);

export default modelManager;