import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";
import { routePartykitRequest } from "partyserver";

import { connectDB } from "./config/database.js";
import { CONSTANTS } from "./config/constants.js";
import viewRoutes from "./routes/viewRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import { Globe } from "./party/globe.js";

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

app.use("/", viewRoutes);
app.use("/api", apiRoutes);

const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith("/parties/globe")) {
    try {
      // FIX: Tambahkan 'as any' pada opsi objek untuk membungkam error TS2353
      await routePartykitRequest(req as any, res as any, {
        party: Globe,
        room: "global-room" 
      } as any);
      
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