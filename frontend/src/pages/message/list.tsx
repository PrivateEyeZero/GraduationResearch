import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Session } from "@/_util/session";
import {
  BACKEND_URL,
  INVALID_SESSION_MSG,
  INVALID_SESSION_PAGE,
} from "@/basic_info";

const messagesUrl = BACKEND_URL + "/message/get";

type MESSAGE_LIST_TYPE = {
  message_id: string;
  content: string;
  sender: string;
  users: string[];
  groups: string[];
};

const borders = {
  lightGray: "1px solid #000",
  thickBlue: "2px solid #000",
  headerBorder: "3px solid #000",
};

const colors = {
  lightBlue: "#B0E0E6",
  lightGrayBg: "#f7fafc",
  white: "white",
};

const MessageList = () => {
  const [messages, setMessages] = useState<MESSAGE_LIST_TYPE[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMessagesInfo = async () => {
      const session_id = Session.getSessionId();
      if (session_id === null) {
        router.push(INVALID_SESSION_PAGE);
        return;
      }
      try {
        const data = await (
          await fetch(messagesUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ session_id }),
          })
        ).json();
        console.log(data);
        if (data.message === INVALID_SESSION_MSG) {
          router.push(INVALID_SESSION_PAGE);
        } else {
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error("エラーが発生しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessagesInfo();
  }, [router]);

  const handleViewResponse = (message_id: string) => {
    router.push(`/message/check_response?message_id=${message_id}`);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="lg" />
        <Text ml={4}>読み込み中...</Text>
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Table
        variant="unstyled"
        border={borders.thickBlue}
        borderRadius="md"
        w="full"
      >
        <Thead bg={colors.lightBlue}>
          <Tr>
            <Th
              borderBottom={borders.headerBorder}
              borderRight={borders.lightGray}
            >
              メッセージ内容
            </Th>
            <Th
              borderBottom={borders.headerBorder}
              borderRight={borders.lightGray}
            >
              送信者
            </Th>
            <Th
              borderBottom={borders.headerBorder}
              borderRight={borders.lightGray}
            >
              送信対象
            </Th>
            <Th borderBottom={borders.headerBorder}>応答状況</Th>
          </Tr>
        </Thead>
        <Tbody>
          {messages.map((message, index) => (
            <Tr
              key={message.message_id}
              bg={index % 2 === 0 ? colors.lightGrayBg : colors.white}
            >
              <Td
                borderBottom={borders.lightGray}
                borderRight={borders.lightGray}
                maxW="300px"
                whiteSpace="pre-wrap"
                overflow="hidden"
                textOverflow="ellipsis"
                cursor="pointer"
                title={message.content}
              >
                {message.content
                  .slice(0, 40)
                  .split("\n")
                  .slice(0, 2)
                  .join("\n") + "..."}
              </Td>
              <Td
                borderBottom={borders.lightGray}
                borderRight={borders.lightGray}
              >
                {message.sender}
              </Td>
              <Td
                borderBottom={borders.lightGray}
                borderRight={borders.lightGray}
              >
                Group: {message.groups}<br />
                User: {message.users}
              </Td>
              <Td borderBottom={borders.lightGray}>
                <Button
                  colorScheme="blue"
                  onClick={() => handleViewResponse(message.message_id)}
                >
                  応答状況を見る
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default MessageList;
