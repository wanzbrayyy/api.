import { Router } from "express";
import { getLogin, getRegister } from "../controllers/authController";
import { getDashboard, getProfile } from "../controllers/userController";
import { requireAuth, redirectIfAuthenticated } from "../middleware/authMiddleware";

const router = Router();

router.get("/", (req, res) => res.redirect("/dashboard"));

router.get("/login", redirectIfAuthenticated, getLogin);
router.get("/register", redirectIfAuthenticated, getRegister);

router.get("/dashboard", requireAuth, getDashboard);
router.get("/profile", requireAuth, getProfile);

export default router;