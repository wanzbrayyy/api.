import { Router } from "express";
import { getLogin, getRegister } from "../controllers/authController.js";
import { getDashboard, getProfile, getBars } from "../controllers/userController.js";
import * as Tools from "../controllers/toolsController.js";
import { requireAuth, redirectIfAuthenticated } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", (req, res) => res.redirect("/dashboard"));
router.get("/login", redirectIfAuthenticated, getLogin);
router.get("/register", redirectIfAuthenticated, getRegister);
router.get("/dashboard", requireAuth, getDashboard);
router.get("/profile", requireAuth, getProfile);
router.get("/bars", requireAuth, getBars);
router.get("/bars/ff", requireAuth, Tools.viewFF);
router.get("/bars/ml", requireAuth, Tools.viewML);
router.get("/bars/pubg", requireAuth, Tools.viewPUBG);
router.get("/bars/github", requireAuth, Tools.viewGithub);
router.get("/bars/genshin", requireAuth, Tools.viewGenshin);
router.get("/bars/pinterest", requireAuth, Tools.viewPinterest);
router.get("/bars/ig", requireAuth, Tools.viewIG);
router.get("/bars/checkch", requireAuth, Tools.viewCheckCh);

export default router;