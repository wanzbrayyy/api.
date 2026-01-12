import { Router } from "express";
import { register, login, logout } from "../controllers/authController.js";
import { updateProfile } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/logout", logout);

router.post("/user/profile", requireAuth, upload.single("avatar"), updateProfile);

export default router;