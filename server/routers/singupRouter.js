import { Router } from "express";
import bcrypt from "bcrypt"
import db from "../database/connection.js";

const router = Router()

router.post("/singup", async (req, res) => {
    const { email, username, password, admin } = req.body;

     // Validate the required fields 
     if (!email || !username || !password) {
        return res.status(400).send({ message: 'Please provide all required credentials' });
    }

    // Check if admin field is empty
    if (!admin){
        admin === false;
    }

      // Check if email already exists
      const [emailCheck] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
      if (emailCheck.length > 0) {
          return res.status(409).send({ message: "User with this email already exists" });
      }

      // Check if username already exists
      const [usernameCheck] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
      if (usernameCheck.length > 0) {
          return res.status(409).send({ message: "User with this username already exists" });
      }

  
      try {

        // Set admin to false if it is empty
        const isAdmin = admin || false;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into db
        const [result] = await db.execute('INSERT INTO users (email, username, password, admin) VALUES (?, ?, ?, ?)', [email, username, hashedPassword, isAdmin]);

        return res.status(201).send({ message: "User created" });

    } catch (error) {

        return res.status(500).send({ message: "Internal server error" });
    }

});

export default router;
