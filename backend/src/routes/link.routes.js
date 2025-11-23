import { Router } from "express";
import {
  createShortLink,
  getUserLinks,
  deleteLink,
  getAndRedirect,
  getLinkForStats
} from "../controllers/link.controller.js";

const router = Router();

// Authenticated routes
router.post("/", createShortLink);
router.get("/:code",getLinkForStats);
router.get("/", getUserLinks);
router.delete("/:id", deleteLink);

export default router;
