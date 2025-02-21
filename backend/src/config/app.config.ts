import getEnv from "../utils/get-env";

const appConfig = () => ({
    PORT: getEnv("PORT", "8000"),
    NODE_ENV: getEnv("NODE_ENV", "development"),
    MONGO_URI: getEnv("MONGO_URI", ""),

    SESSION_SECRET: getEnv("SESSION_SECRET"),
    SESSION_EXPIRES_IN: getEnv("SESSION_EXPIRES_IN"),
    BASE_URI: getEnv("BASE", "/api"),

    // GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
    // GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
    // GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),

    FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "localhost"),
    // FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL"),
});

const config = appConfig();

export default config;
