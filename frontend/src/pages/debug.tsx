"use client";

import { Box, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
export default function Debug() {
  const router = useRouter();
  const handleRedirect = () => {
    router.push("/message/send");
  };

  return (
    <Box
      textAlign="center"
      mt={10}
      p={5}
      borderWidth={1}
      borderRadius="md"
      borderColor="red.500"
    >
      <Text fontSize="xl" color="red.500" mb={4}>
        このページはデバッグ用のページです。
      </Text>
      <Button colorScheme="red" onClick={handleRedirect}>
        情報ページへ
      </Button>
    </Box>
  );
}
