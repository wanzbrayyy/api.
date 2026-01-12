import { Router } from "express";
import { register, login, logout } from "../controllers/authController.js";
import { updateProfile, generateApiKey } from "../controllers/userController.js";
import * as Tools from "../controllers/toolsController.js";
import { requireAuth, requireApiKey } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/logout", logout);

router.post("/user/profile", requireAuth, upload.single("avatar"), updateProfile);
router.post("/user/generate-key", requireAuth, generateApiKey);

router.post("/tools/ff", requireApiKey, Tools.apiFF);
router.post("/tools/ml", requireApiKey, Tools.apiML);
router.post("/tools/pubg", requireApiKey, Tools.apiPUBG);
router.get("/tools/github", requireApiKey, Tools.apiGithub);
router.get("/tools/genshin", requireApiKey, Tools.apiGenshin);
router.get("/tools/pinterest", requireApiKey, Tools.apiPinterest);
router.get("/tools/ig", requireApiKey, Tools.apiIg);
router.get("/tools/checkch", requireApiKey, Tools.apiCheckCh);

export default router;