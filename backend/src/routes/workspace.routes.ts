import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import {
    changeMemberRoleInWorkspace,
    createWorkspace,
    deleteWorkspace,
    getWorkspace,
    getWorkspaceAnalytics,
    getWorkspaceMembers,
    getWorkspacesWhereUserIsMember,
    updateWorkspace,
} from "../controllers/workspace.controller";

const router = express.Router();

router.use(isAuthenticated);
router.get("/all", getWorkspacesWhereUserIsMember);
router.get("/analytics/:workspaceId", getWorkspaceAnalytics);
router.get("/:workspaceId", getWorkspace);
router.get("/members/:workspaceId", getWorkspaceMembers);
router.post("/create", createWorkspace);
router.put("/update/:workspaceId", updateWorkspace);
router.put("/change/member/role/:workspaceId", changeMemberRoleInWorkspace);
router.delete("/delete/:workspaceId", deleteWorkspace);

export default router;
