import express from "express";
import { add_group } from "./add_group";
const router = express.Router();
router.use(express.json());
router.post("/add_group", add_group);
export default router;
