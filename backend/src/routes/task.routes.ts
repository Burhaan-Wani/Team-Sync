import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import {
    deleteTask,
    getAllTasks,
    getTaskById,
    updateTask,
} from "../controllers/task.controller";

const router = express.Router();

router.use(isAuthenticated);

router.post("/projects/:projectId/workspaces/:workspaceId/create");

router.post(
    "/:id/projects/:projectId/workspaces/:workspaceId/create",
    updateTask
);

router.get("/workspaces/:workspaceId/all", getAllTasks);

router.get("/:id/projects/:projectId/workspaces/:workspaceId", getTaskById);

router.delete("/:id/workspaces/:workspaceId/delete", deleteTask);

export default router;
