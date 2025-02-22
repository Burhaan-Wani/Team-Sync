import express from "express";
import { getMe } from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(isAuthenticated);
router.get("/me", getMe);
export default router;
