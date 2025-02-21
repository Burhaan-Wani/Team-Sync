import mongoose from "mongoose";
import config from "./app.config";

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Connected to mongo_DB");
    } catch (error) {
        console.log("Error while connecting to DB");
    }
};

export default connectDB;
