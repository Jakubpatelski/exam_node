import express from "express"
import dotnev from "dotenv"
import cors from "cors"
import session from "express-session";

const app = express();
app.use(express.json());

dotnev.config();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: true,
    cookie: { secure: false } 
}));
// app.use(cors({
//     credentials: true,
//     origin: true
// }));
app.use(cors())

import rateLimit from 'express-rate-limit'
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
// app.use("/login", limiter);


export function isAutheticated(req, res, next){
    if(req.session && req.session.user){
        next();
    } else {
        res.redirect("/login")
    }
}

// import loginRouter from "./routers/loginRouter.js";
// app.use(loginRouter);

// import userRouter from "./routers/usersRouter.js";
// app.use(userRouter);


// import singupRouter from "./routers/singupRouter.js";
// app.use(singupRouter);

// import homeRouter from "./routers/homeRouter.js";
// app.use(homeRouter);


// import logoutRouter from "./routers/logoutRouter.js";
// app.use(logoutRouter);

// import contactRouter from "./routers/contactRouter.js"
// app.use(contactRouter)



const PORT = 8080;
app.listen(PORT, (error) => {
    if(error){
        console.log(error);
    }
    console.log("Server is ruuning on port ", PORT);
})





