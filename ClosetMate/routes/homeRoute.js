import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';

const route = express.Router();

route.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/frontend/index.html'));
});




export default route;
