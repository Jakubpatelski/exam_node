import { Router } from "express";
import bcrypt from "bcrypt"
import db from "../database/connection.js";

const router = Router();

router.post("/login", async (req, res) => {
    const { username, password } = req.body

      // Validate the required fields 
      if (!password || !username) {
        return res.status(400).send({ message: 'Please provide all required credentials' });
    }

     // Check if user exists
     const [userFound] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

     if (userFound.length > 0){
        const userData = userFound[0];
        // Check if password is the same

        const isSamePassword = bcrypt.compare(password, userData.password)


        if (isSamePassword) {
            // Save the user info in the session
            const user = req.session.user = {
                id: userData.id,
                username: userData.username,
                email: userData.email,
                admin: userData.admin

            };

            return res.status(200).send({ message: user });


     }
     
    }
    return res.status(404).send({ message: "User Not found" });

});

export default router;
