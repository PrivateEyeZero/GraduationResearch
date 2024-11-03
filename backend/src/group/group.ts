import express from "express";
import { add_group } from "./add_group";
import { get_member } from "./member/get";
import { add_member } from "./member/add";
import { get_groups } from "./get_groups";
const router = express.Router();
router.use(express.json());
router.post("/add_group", add_group);
router.post("/get_groups", get_groups);
router.post("/member/get",get_member)
router.post("/member/add",add_member)
export default router;
