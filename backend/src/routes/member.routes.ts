import express from "express";
import { joinWorkspace } from "../controllers/member.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(isAuthenticated);
router.post("/workspaces/:inviteCode/join", joinWorkspace);

export default router;
