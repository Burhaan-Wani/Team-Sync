import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const options = {
    baseURL,
    withCredentials: true,
    timeout: 10000,
};

const API = axios.create(options);

export default API;
