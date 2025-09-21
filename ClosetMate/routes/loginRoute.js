import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';
import * as loginModel from '../model/loginModel.js';

const route = express.Router();
route.use(express.urlencoded({ extended: true }));

route.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/frontend/login.html'));
});

route.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/frontend/register.html'));
});

// Login user
route.post('/login', async (req,res) => {
    console.log(req.body.username);
    console.log(req.body.password);

    console.log(await loginModel.verifyLogin(req.body.username, req.body.password));
    
    res.redirect('/login');

});

// Register user
route.post('/register',async (req,res) => {
  console.log(req.body.username);
    console.log(req.body.password);

    console.log(await loginModel.createUser(req.body.username, req.body.password));
    
    res.redirect('/register');
});


export default route;
