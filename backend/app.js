import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/auth.routes.js";
import linkRoutes from "./src/routes/link.routes.js";
import { getAndRedirect } from "./src/controllers/link.controller.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.get("/:code", getAndRedirect);

// Health check endpoint
app.get("/healthz", (req, res) => {
  res.sendStatus(200); // returns 200 OK
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
