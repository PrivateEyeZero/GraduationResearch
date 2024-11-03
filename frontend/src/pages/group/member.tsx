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
  Flex,
  Divider,
} from "@chakra-ui/react";
import { group } from "console";

const groupUrl = BACKEND_URL + "/group/get_groups";
const getMembersUrl = BACKEND_URL + "/group/member/get";
const addMembersUrl = BACKEND_URL + "/group/member/add";

interface Member {
  id: string;
  uuid: string;
}

const RoleFormWithMembers: React.FC = () => {
  const [groupName, setGroupName] = useState<string>("");
  const [groups, setGroups] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [members, setMembers] = useState<Array<Member>>([]);
  const [nonMembers, setNonMembers] = useState<Array<Member>>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [session_id, setSessionId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const session_id = Session.getSessionId();
    setSessionId(session_id);
    if (session_id === null) {
      router.push(INVALID_SESSION_PAGE);
    } else {
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
      const response_gr = await fetch(getMembersUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id, group_id: groupId }),
      });
      const response_all = await fetch(getMembersUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id, group_id: "" }),
      });
      const data_gr = await response_gr.json();
      const data_all = await response_all.json();
      if (data_gr.result === "success" && data_all.result === "success") {
        const group_members = data_gr.members || [];
        const group_members_uuids = group_members.map(
          (member: Member) => member.uuid,
        );
        const all_members = data_all.members || [];
        const non_members = all_members.filter(
          (member: Member) => group_members_uuids.indexOf(member.uuid) == -1,
        );
        setMembers(data_gr.members || []);
        setNonMembers(non_members);
      } else if (
        data_gr.message === INVALID_SESSION_MSG ||
        data_all.message === INVALID_SESSION_MSG
      ) {
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleShowAllIds = () => {
    setSearchTerm("");
  };

  const filteredNonMembers = nonMembers.filter((member) =>
    member.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddMember = async (uuid: string) => {
    console.log("Add member with uuid:", uuid);

    try {
      const response = await fetch(addMembersUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: session_id,
          group_id: selectedGroup,
          uuid: uuid,
        }),
      });
      console.log(response);
      const memberToAdd = nonMembers.find((member) => member.uuid === uuid);
      if (memberToAdd) {
        setMembers((prevMembers) => [...prevMembers, memberToAdd]);
        setNonMembers((prevNonMembers) =>
          prevNonMembers.filter((member) => member.uuid !== uuid),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      {/* グループ選択ドロップダウン */}
      <FormControl id="groupSelect" isRequired>
        <FormLabel>グループを選択:</FormLabel>
        <Select
          placeholder="グループを選択"
          onChange={handleGroupChange}
          value={selectedGroup || ""}
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </Select>
      </FormControl>

      {/* メンバー一覧の表示 */}
      {selectedGroup && (
        <Box
          border="1px solid #ccc"
          borderRadius="md"
          p={4}
          width="99%"
          backgroundColor="#E8FFFA"
        >
          <Box border="1px solid #ccc" backgroundColor="white">
            <FormLabel>メンバー一覧</FormLabel>
          </Box>
          {members.length > 0 ? (
            members.map((member) => <Text key={member.uuid}>{member.id}</Text>)
          ) : (
            <Text>メンバーがいません</Text>
          )}
        </Box>
      )}

      {/* 未参加メンバー一覧 */}
      {selectedGroup && (
        <Box
          border="1px solid #ccc"
          borderRadius="md"
          p={4}
          width="99%"
          backgroundColor="#FFE5E5"
        >
          <Flex
            justify="space-between"
            align="center"
            mb={3}
            border="1px solid #ccc"
            backgroundColor="white"
          >
            <Text fontSize="lg">未参加メンバー一覧</Text>
            <Box display="flex">
              検索:
              <FormControl width="200px">
                <Input
                  placeholder="検索..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </FormControl>
            </Box>
          </Flex>
          <Divider />
          {filteredNonMembers.length > 0 ? (
            filteredNonMembers.map((member) => (
              <Flex
                borderRadius="0.7em"
                backgroundColor="#FFFAE2"
                justify="space-between"
                marginTop="0.3em"
                display="flex"
                height="1.6em"
                alignItems="center"
                paddingLeft="0.7em"
                paddingRight="0.7em"
              >
                <Text key={member.uuid} padding="0px" margin="0px">
                  {member.id}
                </Text>
                <Button
                  padding="0px"
                  margin="0px"
                  height="80%"
                  onClick={() => handleAddMember(member.uuid)}
                >
                  このユーザを追加
                </Button>
              </Flex>
            ))
          ) : (
            <Text>未参加メンバーがいません</Text>
          )}
          <Button
            colorScheme="blue"
            onClick={handleShowAllIds}
            borderRadius="md"
            mt={2}
          >
            全ユーザIDを表示
          </Button>
        </Box>
      )}
    </VStack>
  );
};

export default RoleFormWithMembers;
