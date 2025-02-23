import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import passport from "passport";

import config from "./config/app.config";
import errorHandlingMiddleware from "./middlewares/errorHandlingMiddleware";
import connectDB from "./config/db.config";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import workspaceRoutes from "./routes/workspace.routes";

const app = express();

// PASSPORT
import "./config/passport.config";

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: config.FRONTEND_ORIGIN,
        credentials: true,
    })
);

app.use(
    cookieSession({
        name: "session",
        keys: [config.SESSION_SECRET],
        maxAge: 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    })
);

app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use(`${config.BASE_URI}/user`, userRoutes);
app.use(`${config.BASE_URI}/auth`, authRoutes);
app.use(`${config.BASE_URI}/workspaces`, workspaceRoutes);

// ERROR HANDLING MIDDLEWARE
app.use(errorHandlingMiddleware);

app.listen(config.PORT, async () => {
    console.log(
        `Server is running on http://localhost:${config.PORT} in ${config.NODE_ENV}`
    );
    await connectDB();
});
