import http from "http";
import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { routePartykitRequest } from "partyserver";
import { connectDB } from "./config/database";
import { CONSTANTS } from "./config/constants";
import viewRoutes from "./routes/viewRoutes";
import apiRoutes from "./routes/apiRoutes";
import { Globe } from "./party/globe";

const app = express();

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.static(path.join(__dirname, "../public")));
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