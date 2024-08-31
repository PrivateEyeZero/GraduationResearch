"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Box, Button, VStack, Text } from "@chakra-ui/react";
import { useEffect } from "react";

export default function DiscordAuth() {
  const { data: session, status } = useSession();


  // 認証成功時の処理
  useEffect(() => {
    if (session) {
      console.log("User is logged in:", session.user);
      // 必要なら、ログイン成功時のリダイレクトや他の処理を追加できます
    }
  }, [session]);

  const handleLogin = () => {
    signIn("discord");
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <Box p={4}>
      <VStack spacing={4}>
        {status === "loading" ? (
          <Text>認証中...</Text>
        ) : session ? (
          <>
            <Text>ようこそ、{session.user?.name}さん！</Text>
            <Button onClick={handleLogout} colorScheme="red">
              ログアウト
            </Button>
          </>
        ) : (
          <>
            <Text>Discordでログインしてください{process.env.DISCORD_CLIENT_ID}</Text>
            <Button onClick={handleLogin} colorScheme="blue">
              Discordでログイン
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
}
