const getEnv = (key: string, defaultValue: string = ""): string => {
    const env = process.env[key];
    if (!env) {
        if (defaultValue) {
            return defaultValue;
        }
        throw new Error(`${key} env-variable not set.`);
    }
    return env;
};

export default getEnv;
