"use client";

import { BACKEND_URL } from "@/basic_info";
import { useMyContext } from "@/contexts/MyContext";
import { Box, Button, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const url = BACKEND_URL + "/auth/login"; // Replace with your target URL
export default function Login() {
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const { sessionId, setSessionId } = useMyContext();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, pass }),
      });
      console.log(response);
      const data = await response.json();
      console.log(data); // Handle the response data as needed
      if (data.result === "success") {
        setSessionId(data.session_id);
        router.push("/debug");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4}>
        <Box>Session: {sessionId}</Box>
        <Box>
          ID:
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            color={"black"}
          />
        </Box>
        <Box>
          PASSWORD:
          <Input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            color={"black"}
          />
        </Box>
        <Button onClick={handleSubmit}>Submit</Button>
      </VStack>
    </Box>
  );
}
