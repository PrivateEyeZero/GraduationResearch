// src/pages/auth/discord.tsx

"use client";  // クライアントコンポーネントであることを明示

import { Box, Button, VStack, Text } from "@chakra-ui/react";
export default function DiscordAuth() {
  const handleLogin = async () => {
    fetch('http://localhost:8080/auth/discord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: "test27" }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.redirectUrl);
      window.location.href = data.redirectUrl;
    })
    .catch(error => console.error('Error:', error));
  }

  return (
    <Box p={4}>
      <VStack spacing={4}>
        
            <Text>Discordでログインしてください</Text>
            <Button onClick={handleLogin} colorScheme="blue">
              Discordでログイン
            </Button>
        
      </VStack>
    </Box>
  );
}
