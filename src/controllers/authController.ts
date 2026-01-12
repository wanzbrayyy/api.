import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { CONSTANTS } from "../config/constants.js";
import { translateObject } from "../services/translationService.js";

const renderAuth = async (res: Response, view: string, error: string | null, lang: string, textData: any) => {
    const t = await translateObject(textData, lang);
    res.render(view, { user: null, error, t });
};

export const getLogin = async (req: Request, res: Response) => {
    await renderAuth(res, "login", null, req.lang || 'en', {
        page_title: "Login",
        welcome: "Welcome Back",
        subtitle: "Enter your credentials to access the party.",
        email: "Email Address",
        password: "Password",
        btn_login: "Login to Party",
        no_account: "Don't have an account?",
        register_here: "Register here"
    });
};

export const getRegister = async (req: Request, res: Response) => {
    await renderAuth(res, "register", null, req.lang || 'en', {
        page_title: "Register",
        join: "Join the Squad",
        subtitle: "Create your account to get started.",
        fullname: "Full Name",
        email: "Email Address",
        password: "Password",
        btn_create: "Create Account",
        have_account: "Already have an account?",
        login_here: "Login here"
    });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return renderAuth(res, "register", "Email already exists", req.lang || 'en', {
                page_title: "Register",
                join: "Join the Squad",
                subtitle: "Create your account to get started.",
                fullname: "Full Name",
                email: "Email Address",
                password: "Password",
                btn_create: "Create Account",
                have_account: "Already have an account?",
                login_here: "Login here"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.redirect("/login");
    } catch (error) {
        res.redirect("/register");
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return renderAuth(res, "login", "Invalid credentials", req.lang || 'en', {
                page_title: "Login",
                welcome: "Welcome Back",
                subtitle: "Enter your credentials to access the party.",
                email: "Email Address",
                password: "Password",
                btn_login: "Login to Party",
                no_account: "Don't have an account?",
                register_here: "Register here"
            });
        }

        const token = jwt.sign({ userId: user._id }, CONSTANTS.JWT_SECRET, { expiresIn: "24h" });
        res.cookie("token", token, { httpOnly: true, maxAge: 86400000 });
        res.redirect("/dashboard");
    } catch (error) {
        res.redirect("/login");
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie("token");
    res.redirect("/login");
};