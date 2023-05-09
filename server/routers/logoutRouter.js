import { Router } from "express";
const router = Router();


router.post("/logout", (req, res) => {
    try {
        req.session.destroy(() => {
            res.send({ message: "Logged out." })  
        })
          
    } catch {
        res.status(500).send("Server error")
    }
})

export default router;