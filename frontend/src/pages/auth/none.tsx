"use client";

import { Box, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
export default function None() {
  const router = useRouter();
  const handleRedirect = () => {
    router.push("/auth/info");
  };

  return (
    <>
      <Box>まだないよ！</Box>
      <Button colorScheme="red" onClick={handleRedirect}>
        もどる
      </Button>
    </>
  );
}
