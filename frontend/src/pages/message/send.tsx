import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import {
  BACKEND_URL,
  INVALID_SESSION_MSG,
  INVALID_SESSION_PAGE,
  PROVIDER,
} from "@/basic_info";
import { Session } from "@/_util/session";
import { useRouter } from "next/router";

const info_url = BACKEND_URL + "/auth/info";
const send_url = BACKEND_URL + "/message/send";

const SendMessage = () => {
  const [providerOptions, setProviderOptions] = useState<string[]>([]);
  const [provider, setProvider] = useState("");
  const [groups, setGroups] = useState<{
    [provider: string]: { id: string; name: string }[];
  } | null>(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // データを取得する関数
    const fetchProviderInfo = async () => {
      const session_id = Session.getSessionId();
      if (session_id === null) {
        router.push(INVALID_SESSION_PAGE);
      }
      try {
        const response = await fetch(info_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id: session_id }),
        });

        const data = await response.json();
        if (data.message === INVALID_SESSION_MSG)
          router.push(INVALID_SESSION_PAGE);

        const options = [];
        if (data.discord) options.push(PROVIDER.DISCORD);
        if (data.teams) options.push(PROVIDER.TEAMS);
        if (data.line) options.push(PROVIDER.LINE);
        setProviderOptions(options);
        setGroups(data.groups);

        console.log(groups);
      } catch (error) {
        console.error("エラーが発生しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderInfo();
  }, []);

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvider(e.target.value);
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroup(e.target.value);
  };

  const handleSubmit = async () => {
    if (!provider) {
      alert("プロバイダを選択してください");
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
          provider: provider,
          group_id: selectedGroup, // 選択されたグループのIDを送信
          message: message,
        }),
      })
    ).json();

    if (response.message === INVALID_SESSION_MSG)
      router.push(INVALID_SESSION_PAGE);

    // 送信処理
    console.log(response);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box width="150px">
      <FormControl mb={4}>
        <FormLabel>プロバイダ選択</FormLabel>
        <Select value={provider} onChange={handleProviderChange}>
          <option value="">選択してください</option>
          {providerOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>グループ選択</FormLabel>
        <Select value={selectedGroup} onChange={handleGroupChange}>
          <option value="">グループを選択してください</option>
          {provider && groups && groups[provider] ? (
            groups[provider].map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))
          ) : (
            <></>
          )}
        </Select>
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
