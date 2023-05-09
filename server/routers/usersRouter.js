import { Router } from "express";
import db from "../database/connection.js";

const router = Router();


router.get("/api/users", async (req, res) => {
    const [result] = await db.execute("SELECT id, username, email, admin FROM users;");
    const users = result.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      admin: user.admin,
    }));
  
    res.send({ data: users });
});


export default router;