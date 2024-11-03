// src/components/RoleFormWithMembers.tsx
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
  Select,
  Box,
  Text,
} from "@chakra-ui/react";

const groupUrl = BACKEND_URL + "/group/get_groups";
const membersUrl = BACKEND_URL + "/group/member/get";

const RoleFormWithMembers: React.FC = () => {
  const [groupName, setGroupName] = useState<string>("");
  const [groups, setGroups] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [members, setMembers] = useState<Array<{ id: string; enable: boolean }>>([]);

  const router = useRouter();

  useEffect(() => {
    const session_id = Session.getSessionId();
    if (session_id === null) {
      router.push(INVALID_SESSION_PAGE);
    } else {
      // グループ一覧を取得
      fetchGroups(session_id);
    }
  }, []);

  const fetchGroups = async (session_id: string) => {
    try {
      const response = await fetch(groupUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id }),
      });
      const data = await response.json();
      console.log(data)
      if (data.result === "success") {
        setGroups(data.groups || []);
      } else if (data.message === INVALID_SESSION_MSG) {
        router.push(INVALID_SESSION_PAGE);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMembers = async (session_id: string, groupId: number) => {
    try {
      const response = await fetch(membersUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id, group_id: groupId }),
      });
      const data = await response.json();
      if (data.result === "success") {
        setMembers(data.members || []);
      } else if (data.message === INVALID_SESSION_MSG) {
        router.push(INVALID_SESSION_PAGE);
      }
    } catch (error) {
      console.error("ネットワークエラー:", error);
    }
  };

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    setSelectedGroup(selectedId);
    const session_id = Session.getSessionId();
    if (session_id !== null) {
      fetchMembers(session_id, selectedId);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      {/* グループ選択ドロップダウン */}
      <FormControl id="groupSelect" isRequired>
        <FormLabel>グループを選択:</FormLabel>
        <Select placeholder="グループを選択" onChange={handleGroupChange} value={selectedGroup || ""}>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </Select>
      </FormControl>

      {/* メンバー一覧の表示 */}
      {selectedGroup && (
        <Box border="1px solid #ccc" borderRadius="md" p={4} width="100%">
          <FormLabel>メンバー一覧:</FormLabel>
          {members.length > 0 ? (
            members.map((member) => (
              <Text key={member.id}>
                {member.id} - {member.enable ? "有効" : "無効"}
              </Text>
            ))
          ) : (
            <Text>メンバーがいません</Text>
          )}
        </Box>
      )}
    </VStack>
  );
};

export default RoleFormWithMembers;
