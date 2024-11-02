// src/components/RoleForm.tsx
import React, { useEffect, useState } from "react";
import { Session } from "../../_util/session";
import { useRouter } from "next/navigation";
import {
  BACKEND_URL,
  INVALID_SESSION_MSG,
  INVALID_SESSION_PAGE,
} from "@/basic_info";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";

const url = BACKEND_URL + "/group/add_group";

const RoleForm: React.FC = () => {
  const [group_name, setGroupName] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const session_id = Session.getSessionId();
    if (session_id === null) {
      router.push(INVALID_SESSION_PAGE);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const session_id = Session.getSessionId();

    if (session_id === null) {
      router.push(INVALID_SESSION_PAGE);
    }
    // フォームデータを構築
    const data = {
      session_id: session_id,
      group_name: group_name,
    };

    try {
      // データをサーバーに送信
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.result !== "success") {
            const msg = data.message;
            if (msg == INVALID_SESSION_MSG) {
              router.push(INVALID_SESSION_PAGE);
            }
            return;
          }
        });
    } catch (error) {
      console.error("ネットワークエラー:", error);
    }
  };

  return (
    <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit}>
      <FormControl id="adminRole" isRequired>
        <FormLabel>グループ名:</FormLabel>
        <Input
          type="text"
          value={group_name}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </FormControl>

      <Button type="submit" colorScheme="teal" width="180px">
        送信
      </Button>
    </VStack>
  );
};

export default RoleForm;
