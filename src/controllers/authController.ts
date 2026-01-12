import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { CONSTANTS } from "../config/constants.js";
import { translateText } from "../services/translationService.js";

const translateBatch = async (texts: Record<string, string>, lang: string) => {
  const keys = Object.keys(texts);
  const values = Object.values(texts);
  const translatedValues = await Promise.all(values.map(v => translateText(v, lang)));
  
  const result: Record<string, string> = {};
  keys.forEach((key, index) => {
    result[key] = translatedValues[index];
  });
  return result;
};

export const getLogin = async (req: Request, res: Response) => {
  const lang = req.lang || 'en';
  
  const t = await translateBatch({
    welcome: "Welcome Back",
    subtitle: "Enter your credentials to access the party.",
    email: "Email Address",
    password: "Password",
    btn_login: "Login to Party",
    no_account: "Don't have an account?",
    register_here: "Register here"
  }, lang);

  res.render("login", { user: null, error: null, t });
};

export const getRegister = async (req: Request, res: Response) => {
  const lang = req.lang || 'en';

  const t = await translateBatch({
    join: "Join the Squad",
    subtitle: "Create your account to get started.",
    fullname: "Full Name",
    email: "Email Address",
    password: "Password",
    btn_create: "Create Account",
    have_account: "Already have an account?",
    login_here: "Login here"
  }, lang);

  res.render("register", { user: null, error: null, t });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      const lang = req.lang || 'en';
      const t = await translateBatch({
        join: "Join the Squad", subtitle: "Create your account to get started.",
        fullname: "Full Name", email: "Email Address", password: "Password",
        btn_create: "Create Account", have_account: "Already have an account?", login_here: "Login here"
      }, lang);
      return res.render("register", { user: null, error: "Email already exists", t });
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
      const lang = req.lang || 'en';
      const t = await translateBatch({
        welcome: "Welcome Back", subtitle: "Enter your credentials to access the party.",
        email: "Email Address", password: "Password", btn_login: "Login to Party",
        no_account: "Don't have an account?", register_here: "Register here"
      }, lang);
      return res.render("login", { user: null, error: "Invalid credentials", t });
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