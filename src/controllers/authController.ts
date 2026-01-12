import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { CONSTANTS } from "../config/constants";

export const getLogin = (req: Request, res: Response) => {
  res.render("login", { user: null, error: null });
};

export const getRegister = (req: Request, res: Response) => {
  res.render("register", { user: null, error: null });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", { user: null, error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.redirect("/login");
  } catch (error) {
    res.render("register", { user: null, error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", { user: null, error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", { user: null, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      CONSTANTS.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 86400000 });
    res.redirect("/dashboard");
  } catch (error) {
    res.render("login", { user: null, error: "Login failed" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.redirect("/login");
};