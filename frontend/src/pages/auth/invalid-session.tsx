import React from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

const InvalidSession: React.FC = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/auth/login");
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
        セッションが無効です。再度ログインしてください。
      </Text>
      <Button colorScheme="red" onClick={handleRedirect}>
        ログインページへ
      </Button>
    </Box>
  );
};

export default InvalidSession;
