import express from "express"
import dotnev from "dotenv"
import cors from "cors"
import session from "express-session";
import rateLimit from 'express-rate-limit'


const app = express();


// middleware to parse JSON request bodies
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
const server = http.createServer(app); ////HTTP server will use Express to handle incoming HTTP requests

import { Server } from "socket.io";
const io = new Server(server, { ///socket.io server will use the same HTTP server to handle incoming connections
    cors: {
        origin: "*",
        methods: ["*"]
    }
});

// handle client connections
io.on("connection", (socket) => {

  // handle event when a client chooses a color
    socket.on("a client choose a color", (data) => {
        // Broadcast the event to all connected clients
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






