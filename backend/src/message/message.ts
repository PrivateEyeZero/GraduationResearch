import express from "express";
import { send } from "./send";
import { postResponse, getResponse } from "./response"
import { getMessages } from "./get";
const router = express.Router();
router.use(express.json());
router.post("/send", send);
router.post("/response/post", postResponse);
router.post("/response/get", getResponse);
router.post("/get", getMessages);
export default router;
