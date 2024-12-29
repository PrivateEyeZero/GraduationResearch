import { Request, Response } from "express";
import { LINE_ENV } from "../server";
import axios from "axios";
const LINE_API_URL = "https://api.line.me/v2/bot/message/push";

export class Line {
  public static sendMessage = async (msg: string) => {
    try {
      const response = await axios.post(
        LINE_API_URL,
        {
          to: "Uba58d381fd21bfd4349e5eac9835eb01",
          messages: [
            {
              type: "text",
              text: msg,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LINE_ENV.accessToken}`,
          },
        },
      );

      console.log("Message sent successfully:", response.data);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
}
