import express from "express";
import {
    createTask,
    deleteTask,
    getTask,
    getTasks,
    updateTask,
} from "../controllers/taskController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/task/create", authMiddleware, createTask);
router.get("/tasks", authMiddleware, getTasks);
router.get("/task/:id", authMiddleware, getTask);
router.patch("/task/:id", authMiddleware, updateTask);
router.delete("/task/:id", authMiddleware, deleteTask);

export default router;