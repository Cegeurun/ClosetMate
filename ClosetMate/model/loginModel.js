import express from 'express';
import sql from 'mysql2';
import dotenv from 'dotenv';
import crypto from 'crypto';

const model = express.Router(); // An express router
dotenv.config();

// Pool of connections (Just one this time tho)
export const pool = sql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

// For hashing passwords
export function hashPassword(user_password)
{
    return crypto.createHash('sha256').update(user_password).digest('hex');
}

// Gets info about a row based on User ID
export async function getRow(id)
{
    const [result] = await pool.query('SELECT * FROM users WHERE id=?',[id]);
    return result[0];
}

// Create Account
export async function createUser(user_username, user_password, user_email)
{
    user_password = hashPassword(user_password);
    const insertResult = await pool.query(`
        INSERT INTO users(name, password_hash, email)
        VALUES (?, ?, ?);`, [user_username, user_password, user_email]); // insertResult is just metadata
   return insertResult; 
}

// Verify Account Credentials
export async function verifyLogin(user_email, user_password)
{
    const [selection] = await pool.query(`
        SELECT * FROM users WHERE email = ?`, [user_email]);
    
    if(selection.length === 0){return false;} // 

    const selectionObj = selection[0];
    user_password = hashPassword(user_password);
    
    const isValid = (selectionObj.password_hash === user_password);
    return ({
      success: isValid,
      id: selectionObj.id,
      name: selectionObj.name,
      email: selectionObj.email
    });
}

// Reset User Password
export async function resetPassword(user_username){
    
}


export async function getUserData(username, password) {
  // Fetch user record
  const [rows] = await pool.query(
    `SELECT id, name, email, password_hash, location, preferences, created_at
     FROM users
     WHERE name = ?`,
    [username]
  );

  if (rows.length === 0) return false; // user not found

  const user = rows[0];
  const hashed = hashPassword(password);

  if (user.password_hash !== hashed) return false; // wrong password

  // Parse preferences JSON safely
  let preferences = {};
  try {
    preferences = JSON.parse(user.preferences || "{}");
  } catch (err) {
    console.warn("Failed to parse user preferences JSON:", err);
  }

  // Return user object without password hash
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    location: user.location,
    preferences,
    created_at: user.created_at
  };
}

// const user_info = await getRow(1);
// console.log(`Password: ${user_info.user_password}`);

// await createUser('john', 'doe');

// // Export the router
// export default model; // Allows other files to read it and be able to set any name to it because it is set as default.
