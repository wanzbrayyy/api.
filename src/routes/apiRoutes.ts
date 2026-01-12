import { Router } from "express";
import { register, login, logout } from "../controllers/authController.js";
import { updateProfile } from "../controllers/userController.js";
import * as Tools from "../controllers/toolsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/logout", logout);
router.post("/user/profile", requireAuth, upload.single("avatar"), updateProfile);
router.post("/tools/ff", requireAuth, Tools.apiFF);
router.post("/tools/ml", requireAuth, Tools.apiML);
router.post("/tools/pubg", requireAuth, Tools.apiPUBG);
router.get("/tools/github", requireAuth, Tools.apiGithub);
router.get("/tools/genshin", requireAuth, Tools.apiGenshin);
router.get("/tools/pinterest", requireAuth, Tools.apiPinterest);
router.get("/tools/ig", requireAuth, Tools.apiIg);
router.get("/tools/checkch", requireAuth, Tools.apiCheckCh);

export default router;