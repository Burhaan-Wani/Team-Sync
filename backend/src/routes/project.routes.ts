import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import {
    createProject,
    deleteProject,
    getAllProjectsOfAWorkspace,
    getProjectAnalytics,
    getProjectInWorkspace,
    updateProject,
} from "../controllers/project.controller";

const router = express.Router();

router.use(isAuthenticated);
router.post("/workspaces/:workspaceId/create", createProject);
router
    .route("/:projectId/workspaces/:workspaceId")
    .get(getProjectInWorkspace)
    .put(updateProject)
    .delete(deleteProject);
router.get("/:id/workspaces/:workspaceId/analytics", getProjectAnalytics);

router.get("/workspaces/:workspaceId/all", getAllProjectsOfAWorkspace);
export default router;
