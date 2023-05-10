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

router.get("/api/users/:id", async (req,res) => {

  const userId = req.params.id;
  
try{
  const [result] = await db.execute("SELECT id, username, email, admin FROM users WHERE id = ?;", [userId]);

  if(result.length === 0){
    res.stastus(404).send({ error: `User with id ${userId} not found` })
  }

  const user = {
    id: result[0].id,
    username: result[0].username,
    email: result[0].email,
    admin: result[0].admin,
  };

  res.send({ data: user });
 } catch(error){
  res.status(500).send({ error: "Failed to retrieve user" });
 }
});

router.put("/api/users/:id/", async (req, res) => {
  const userId = req.params.id;

  try {
    // Check if the user exists
    const [checkResult] = await db.execute("SELECT id, admin FROM users WHERE id = ?;", [userId]);
    if (checkResult.length === 0) {
      return res.status(404).send({ error: `User with id ${userId} not found` });
    }

    const { admin } = checkResult[0];

    // Toggle the admin status
    const updatedAdminStatus = !admin; // Toggle the value

    // Update the user's admin status
    await db.execute("UPDATE users SET admin = ? WHERE id = ?;", [updatedAdminStatus, userId]);

    res.send({ message: "Admin status updated successfully" });
  } catch (error) {
    console.error("Error updating admin status:", error);
    res.status(500).send({ error: "Failed to update admin status" });
  }
});


router.delete("/api/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Delete user by id
    await db.execute("DELETE FROM users WHERE id = ?", [userId]);
    
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ error: "Failed to delete user" });
  }

});



export default router;