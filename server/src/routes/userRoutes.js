import express from 'express';

import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    getUser,
    updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/user", authMiddleware, getUser);
router.patch("/user", authMiddleware, updateUser);

export default router;