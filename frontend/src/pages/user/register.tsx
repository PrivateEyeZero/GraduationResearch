"use client";

import { BACKEND_URL } from "@/basic_info";
import { Box, Button, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const url = BACKEND_URL + "/auth/register"; 

export default function Register() {
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      console.log(JSON.stringify({ id, pass, pass2 }));
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, pass, pass2 }),
      });
      console.log(response);
      const data = await response.json();
      console.log(data); 
      if (data.result === "success") {
        router.push("/user/login");
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4}>
        <Box>登録するユーザ情報を入力してください</Box>
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
        <Box>
          CONFIRM PASSWORD:
          <Input
            type="password"
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
            color={"black"}
          />
        </Box>
        <Button onClick={handleSubmit}>Register</Button>
      </VStack>
    </Box>
  );
}
