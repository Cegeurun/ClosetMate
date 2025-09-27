import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';
import * as loginModel from '../model/loginModel.js';
import jwt from "jsonwebtoken";

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

// Get user info
route.get("/user/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const userData = await loginModel.getRow(userId);

        console.log("This code ran. Raw userData:", userData);
        console.log("Stringified:", JSON.stringify(userData, null, 2));

        res.json(userData || {}); // send {} if userData is null/undefined
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});



export default route;
