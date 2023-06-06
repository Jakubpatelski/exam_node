import express from "express"
import dotnev from "dotenv"
import cors from "cors"
import session from "express-session";
import rateLimit from 'express-rate-limit'



const app = express();
app.use(express.json());

// read .env file
dotnev.config();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: true,
    cookie: { secure: false } //true runs on https so should be false
}));

app.use(cors({
    credentials: true,
    origin: true
}));



// websocket
import http from "http";
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["*"]
    }
});

io.on("connection", (socket) => {

    socket.on("a client choose a color", (data) => {
        io.emit("a new color just dropped", data);
    });

});


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


app.use("/login", limiter);


// check if the user is authenticated
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
app.use(contactRouter);
import playerRouter from "./routers/playersRouter.js"
app.use(playerRouter);




const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("Server is running in port", PORT));






