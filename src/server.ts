import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/database.js";
import { CONSTANTS } from "./config/constants.js";
import viewRoutes from "./routes/viewRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import { detectLanguage } from "./middleware/localeMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", apiRoutes);
app.use(detectLanguage);
const langRouter = express.Router();
langRouter.use("/:lang", viewRoutes);
app.use("/", langRouter);

const server = http.createServer(app);

server.listen(CONSTANTS.PORT, () => {
  console.log(`Server running on http://localhost:${CONSTANTS.PORT}`);
});