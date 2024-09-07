import express from "express";
import { login } from "./login";
import { register } from "./register";
import {discord, discord_callback} from "./discord";
import { info } from "./info";
const router = express.Router();
router.use(express.json());
router.post("/login", login);
router.post("/register", register);
router.post("/discord", discord);
router.post("/info", info)
router.get("/discord/callback", discord_callback);
export default router;
