import express from "express"
import dotnev from "dotenv"
import cors from "cors"
import session from "express-session";
import rateLimit from 'express-rate-limit'



const app = express();
app.use(express.json());

dotnev.config();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: true,
    cookie: { secure: false } //i run on http so should be false
}));
app.use(cors({
    credentials: true,
    origin: true
}));

const limiter = rateLimit({
	windowMs: 30 * 60 * 1000, // 30 minutes
	max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use("/login", limiter);



export function isAuthenticated (req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

import loginRouter from "./routers/loginRouter.js";
app.use(loginRouter);

import userRouter from "./routers/usersRouter.js";
app.use(userRouter);


import signupRouter from "./routers/signupRouter.js";
app.use(signupRouter);

import homeRouter from "./routers/homeRouter.js";
app.use(homeRouter);


import logoutRouter from "./routers/logoutRouter.js";
app.use(logoutRouter);

import contactRouter from "./routers/contactRouter.js"
app.use(contactRouter)
import playerRouter from "./routers/playersRouter.js"
app.use(playerRouter)

import reviews from "./routers/reviewsRouter.js"
app.use(reviews)



const PORT = 8080;
app.listen(PORT, (error) => {
    if(error){
        console.log(error);
    }
    console.log("Server is ruuning on port ", PORT);
})





