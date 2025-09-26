import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';
import * as loginModel from '../model/loginModel.js';
import jwt from "jsonwebtoken";

const route = express.Router();
route.use(express.urlencoded({ extended: true }));

route.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/frontend/index.html'));
});

route.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/frontend/signup.html'));
});


// to be moved to other files
route.get('/closet', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/frontend/closet.html'));
});

route.get('/mainmenu', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/frontend/mainmenu.html'));
});

route.get('/onboarding', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/frontend/onboarding.html'));
});

route.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/frontend/settings.html'));
});


// Login user
route.post('/login', async (req,res) => {
    console.log(req.body);


    const user =  await loginModel.verifyLogin(req.body.email, req.body.password);
    if (result == true)
    {
        const token = jwt.sign(
            {id: user.id}, 
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

       res.json({token});
    }

    else
    {
        res.redirect('/login');
    }


});

// Register user
route.post('/signup',async (req,res) => {
  console.log(req.body.username);
    console.log(req.body.password);

    console.log(await loginModel.createUser(req.body.username, req.body.password, req.body.email));
    
    res.redirect('/login');
});

// Get user info
route.get("/user/info", (req, res) => {
  // Pretend user is logged in (replace with DB data or session)
  res.json({ username: "Custer", email: "test@example.com", idle_items: "5"});
});


export default route;
