import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const session_data: Map<string, string> = new Map();

router.use(express.json());

// `/auth`エンドポイントを処理するルートを設定します
router.post("/login", (req: Request, res: Response) => {
  const id = req.body.id as string;
  const pass = req.body.pass as string;
  console.log(`id: ${id}, pass: ${pass}`);

  if (id === "user" && pass === "test") {
    const session_id = uuidv4();
    session_data.set(id, session_id);
    res.send(`{"result": "success", "session_id": "${session_id}"}`);
  } else {
    res.send('{"result": "fail"}');
  }
});

export default router;
