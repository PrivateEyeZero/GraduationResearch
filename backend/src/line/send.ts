
import { Request, Response } from "express";
import {line} from "../server";
import axios from "axios";
const LINE_API_URL = "https://api.line.me/v2/bot/message/push";

export const send = async (req: Request, res: Response) => {

  try {
    const response = await axios.post(
      LINE_API_URL,
      {
        to: "Uba58d381fd21bfd4349e5eac9835eb01",
        messages: [
          {
            type: "text",
            text: "This is Test message.",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${line.accessToken}`,
        },
      }
    );

    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
  res.send("send");
}