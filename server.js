// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
var DIST_PATH = path.join(__dirname, "dist");
app.use(express.static(DIST_PATH));
app.get("*", (_req, res) => {
  res.sendFile(path.join(DIST_PATH, "index.html"));
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`CoreTaskPro server listening on 0.0.0.0:${PORT}`);
});
