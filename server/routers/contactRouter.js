import nodemailer from "nodemailer"
import { Router } from "express"
import dotenv from 'dotenv'
dotenv.config(); 

const router = Router();

router.post('/contact', async (req, res) => {
    try {

      // create reusable transporter 
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "jakubnodemailer@gmail.com",
                pass: process.env.Nodemailer_Password,
            }
        });
       
        // send mail   
        let info = await transporter.sendMail({
            from: `${req.body.email}>`,
            to: 'jakubnodemailer@gmail.com',
            subject: `${req.body.subject}`,
            text: `${req.body.text}`, 
        });

        res.status(200).send({ message: `Email sent correctly!` });
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
});

export default router;