import express from 'express';
import weatherService from './weatherService.js'
import aiService from './aiService.js'
import { __dirname } from '../dirname.js';
import path from 'path';

const serviceManager = express.Router();

// serviceManager.use(weatherService);
serviceManager.use(aiService);

export default serviceManager;
