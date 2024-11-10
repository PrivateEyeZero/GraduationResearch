import express from "express";
import { send } from "./send";
import {response} from "./response";
const router = express.Router();
router.use(express.json());
router.post("/send", send);
router.post("/response", response);
export default router;
