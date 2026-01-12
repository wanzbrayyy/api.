import { Router } from "express";
import { register, login, logout } from "../controllers/authController";
import { updateProfile } from "../controllers/userController";
import { requireAuth } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/logout", logout);

router.post("/user/profile", requireAuth, upload.single("avatar"), updateProfile);

export default router;