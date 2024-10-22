import express, { Router } from "express";
import { apiAuthMiddleware } from "../middlewares/auth.middleware";
import {
  login,
  register,
  checkToken,
  guestToken,
  logout,
} from "../controllers/auth.controller";
const router: Router = express.Router();

router.get("/check", checkToken);
router.get("/guest", guestToken);
router.post("/login", apiAuthMiddleware, login);
router.post("/logout", apiAuthMiddleware, logout);
router.post("/register", apiAuthMiddleware, register);

export default router;
