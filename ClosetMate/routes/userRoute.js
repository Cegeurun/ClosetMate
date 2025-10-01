import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';
import * as loginModel from '../model/loginModel.js';
import multer from 'multer';

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'userMedia/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get user info
route.get("/user/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const userData = await loginModel.getRow(userId);

        // console.log("This code ran. Raw userData:", userData);
        // console.log("Stringified:", JSON.stringify(userData, null, 2));

        res.json(userData || {}); // send {} if userData is null/undefined
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// Get all items for a user
route.get("/user/:userId/items", async (req, res) => {
    try {
        const userId = req.params.userId;
        const items = await loginModel.getItemsByUserId(userId);
        res.json(items || []);
    } catch (err) {
        console.error("Error fetching user items:", err);
        res.status(500).json({ error: "Failed to fetch user items" });
    }
});

// Save userInfo to closet
route.post("/user/addItem", upload.single('image'), async (req, res) => {
    try {
        // 1. Extract item data and userId from the request body
        const { userId, name, category, subcategory, tags } = req.body;
        const imageUrl = req.file ? `/userMedia/${req.file.filename}` : null;

        // Ensure userId is provided
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is missing.' });
        }

        // The tags are sent as a JSON string from the frontend, so we parse them.
        const parsedTags = JSON.parse(tags);

        // 2. Call the createItem function to save to the database
        await loginModel.createItem(userId, name, category, subcategory, parsedTags, imageUrl);

        // 3. Send a success response
        res.status(201).json({
            success: true,
            message: 'Item added successfully!',
            imageUrl: imageUrl
        });

    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ success: false, message: 'Failed to add item to the closet.' });
    }
});


export default route;
