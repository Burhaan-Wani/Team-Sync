import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import passport from "passport";
import path from "path";

import config from "./config/app.config";
import errorHandlingMiddleware from "./middlewares/errorHandlingMiddleware";
import connectDB from "./config/db.config";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import workspaceRoutes from "./routes/workspace.routes";

import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import memberRoutes from "./routes/member.routes";

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

app.use(express.static(path.join(__dirname, "../../frontend/dist")));
// ROUTES
app.use(`${config.BASE_URI}/user`, userRoutes);
app.use(`${config.BASE_URI}/auth`, authRoutes);
app.use(`${config.BASE_URI}/workspaces`, workspaceRoutes);
app.use(`${config.BASE_URI}/projects`, projectRoutes);
app.use(`${config.BASE_URI}/tasks`, taskRoutes);
app.use(`${config.BASE_URI}/members`, memberRoutes);

app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

// ERROR HANDLING MIDDLEWARE
app.use(errorHandlingMiddleware);

app.listen(config.PORT, async () => {
    console.log(
        `Server is running on http://localhost:${config.PORT} in ${config.NODE_ENV}`
    );
    await connectDB();
});
