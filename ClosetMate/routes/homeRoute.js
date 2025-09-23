import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';

const route = express.Router();

route.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/frontend/Dashboard.html'));
});




export default route;
