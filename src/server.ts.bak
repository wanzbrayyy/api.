import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";
import { routePartykitRequest } from "partyserver";

// PERHATIKAN: Ada tambahan .js di belakang nama file import (Wajib di mode ESM)
import { connectDB } from "./config/database.js";
import { CONSTANTS } from "./config/constants.js";
import viewRoutes from "./routes/viewRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import { Globe } from "./party/globe.js";

// Setup pengganti __dirname untuk ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

app.set("view engine", "ejs");
// Sesuaikan path views agar mengarah ke folder yang benar saat di-deploy
app.set("views", path.join(process.cwd(), "views"));

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", viewRoutes);
app.use("/api", apiRoutes);

const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith("/parties/globe")) {
    try {
      await routePartykitRequest(req, res, {
        party: Globe,
        room: "global-room" 
      });
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  } else {
    app(req, res);
  }
});

server.listen(CONSTANTS.PORT, () => {
  console.log(`Server running on http://localhost:${CONSTANTS.PORT}`);
});