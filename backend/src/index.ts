import "dotenv/config";
import express from "express";
import cors from "cors";
import config from "./config/app.config";
import errorHandlingMiddleware from "./middlewares/errorHandlingMiddleware";
import connectDB from "./config/db.config";

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: config.FRONTEND_ORIGIN,
        credentials: true,
    })
);

// ERROR HANDLING MIDDLEWARE
app.use(errorHandlingMiddleware);

app.listen(config.PORT, async () => {
    console.log(
        `Server is running on http://localhost:${config.PORT} in ${config.NODE_ENV}`
    );
    await connectDB();
});
