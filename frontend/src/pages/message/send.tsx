import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import {
  BACKEND_URL,
  INVALID_SESSION_MSG,
  INVALID_SESSION_PAGE,
} from "@/basic_info";
import { Session } from "@/_util/session";
import { useRouter } from "next/router";

const send_url = BACKEND_URL + "/message/send";
const groupUrl = BACKEND_URL + "/group/get_groups";

const SendMessage = () => {
  const [providerOptions, setProviderOptions] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchProviderInfo = async () => {
      const session_id = Session.getSessionId();
      if (session_id === null) {
        router.push(INVALID_SESSION_PAGE);
      }
      try {
        const data = await (
          await fetch(groupUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ session_id }),
          })
        ).json();
        if (data.message === INVALID_SESSION_MSG) {
          router.push(INVALID_SESSION_PAGE);
        }

        setProviderOptions(["Discord", "Teams", "LINE"]);
        setGroups(data.groups);
      } catch (error) {
        console.error("エラーが発生しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderInfo();
  }, []);

  const handleProviderSelection = (provider: string) => {
    setSelectedProviders(
      (prev) =>
        prev.includes(provider)
          ? prev.filter((p) => p !== provider) // 選択解除
          : [...prev, provider], // 新規選択
    );
  };

  const handleGroupSelection = (groupId: string) => {
    setSelectedGroups(
      (prev) =>
        prev.includes(groupId)
          ? prev.filter((id) => id !== groupId) // 選択解除
          : [...prev, groupId], // 新規選択
    );
  };

  const handleSubmit = async () => {
    if (selectedProviders.length === 0) {
      alert("少なくとも1つのサービスを選択してください");
      return;
    }
    if (selectedGroups.length === 0) {
      alert("少なくとも1つのグループを選択してください");
      return;
    }

    const session_id = Session.getSessionId();
    if (session_id === null) {
      router.push(INVALID_SESSION_PAGE);
    }

    const response = await (
      await fetch(send_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: session_id,
          providers: selectedProviders,
          group_ids: selectedGroups,
          message: message,
        }),
      })
    ).json();

    if (response.message === INVALID_SESSION_MSG) {
      router.push(INVALID_SESSION_PAGE);
    }

    console.log(response);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box width="300px">
      <FormControl mb={4}>
        <FormLabel>サービス選択</FormLabel>
        <Box border="1px solid black" p={4}>
          {providerOptions.map((provider) => (
            <Box key={provider} mb={2}>
              <label>
                <input
                  type="checkbox"
                  value={provider}
                  checked={selectedProviders.includes(provider)}
                  onChange={() => handleProviderSelection(provider)}
                />
                {provider}
              </label>
            </Box>
          ))}
        </Box>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>グループ選択</FormLabel>
        <Box border="1px solid black" p={4}>
          {groups.map((group) => (
            <Box key={group.id} mb={2}>
              <label>
                <input
                  type="checkbox"
                  value={group.id}
                  checked={selectedGroups.includes(group.id)}
                  onChange={() => handleGroupSelection(group.id)}
                />
                {group.name}
              </label>
            </Box>
          ))}
        </Box>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>メッセージ</FormLabel>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="メッセージを入力してください"
        />
      </FormControl>

      <Button width="100%" colorScheme="teal" onClick={handleSubmit}>
        送信
      </Button>
    </Box>
  );
};

export default SendMessage;
