import { Router } from "express";
import { isAuthenticated } from "../app.js";
const router = Router();

router.get("/home", isAuthenticated, (req, res) => {
    res.send({ message: `Hello, ${req.session.user.username}` });
})

export default router;