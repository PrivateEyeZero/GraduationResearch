"use client"

import { Box } from "@chakra-ui/react";
import { useMyContext } from "@/contexts/MyContext";

export default function Debug() {
  const {sessionId, setSessionId} = useMyContext();   
  return (
    <Box>
      このページはデバッグ用のページです。: {sessionId}
    </Box>
  );
}