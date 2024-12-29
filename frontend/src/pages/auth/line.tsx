// src/pages/auth/discord.tsx

"use client"; // クライアントコンポーネントであることを明示

import { Box, Button, VStack, Text } from "@chakra-ui/react";
import { Session } from "../../_util/session";

export default function DiscordAuth() {
  const handleLogin = async () => {
    fetch("http://localhost:8080/auth/line", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id: Session.getSessionId() }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.redirectUrl);
        window.location.href = data.redirectUrl;
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <Box p={4}>
      <VStack spacing={4}>
        <Text>LINEでログインしてください</Text>
        <Button onClick={handleLogin} colorScheme="blue">
          LINEでログイン
        </Button>
      </VStack>
    </Box>
  );
}
