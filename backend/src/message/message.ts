import express from "express";
import { send } from "./send";
const router = express.Router();
router.use(express.json());
router.post("/send", send);
export default router;
