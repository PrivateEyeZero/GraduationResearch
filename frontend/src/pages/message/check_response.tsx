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

const messagesUrl = BACKEND_URL + "/message/response/get";

type MESSAGE_LIST_TYPE = {
  user: string;
  safety: boolean;
  comment: string;
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

const MessageResponse = () => {
  const [response, setResponse] = useState<MESSAGE_LIST_TYPE[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [messageId, setMessageId] = useState<number>(-1);
  useEffect(() => {
    const session_id = Session.getSessionId();
    if (session_id === null) {
      router.push(INVALID_SESSION_PAGE);
    }
    if (router.isReady) {
      const { message_id } = router.query;
      setMessageId(parseInt(message_id as string));
    }
  }, [router.isReady]);

  useEffect(() => console.log(messageId), [messageId]);

  useEffect(() => {
    const fetchMessagesInfo = async () => {
      if (messageId === -1) return;
      const session_id = Session.getSessionId();
      if (session_id === null) {
        router.push(INVALID_SESSION_PAGE);
        return;
      }
      try {
        console.log(
          "body",
          JSON.stringify({ session_id, message_id: messageId }),
        );
        const data = await (
          await fetch(messagesUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              session_id,
              message_id: messageId,
              test: "test",
            }),
          })
        ).json();
        console.log(data);
        if (data.message === INVALID_SESSION_MSG) {
          router.push(INVALID_SESSION_PAGE);
        } else {
          setResponse(data.response || []);
        }
      } catch (error) {
        console.error("エラーが発生しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessagesInfo();
  }, [router, messageId]);

  useEffect(() => console.log(response), [response]);
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
              ユーザ
            </Th>
            <Th
              borderBottom={borders.headerBorder}
              borderRight={borders.lightGray}
            >
              被害状況
            </Th>
            <Th
              borderBottom={borders.headerBorder}
              borderRight={borders.lightGray}
            >
              メッセージ
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {response.map((res, index) => (
            <Tr
              key={res.user}
              bg={index % 2 === 0 ? colors.lightGrayBg : colors.white}
            >
              {" "}
              <Td
                borderBottom={borders.lightGray}
                borderRight={borders.lightGray}
              >
                {res.user}
              </Td>
              <Td
                borderBottom={borders.lightGray}
                borderRight={borders.lightGray}
              >
                {res.safety ? "被害なし" : "被害あり"}
              </Td>
              <Td
                borderBottom={borders.lightGray}
                borderRight={borders.lightGray}
                maxW="300px"
                whiteSpace="pre-wrap"
                overflow="hidden"
                textOverflow="ellipsis"
                cursor="pointer"
                title={res.comment}
              >
                {res.comment}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default MessageResponse;
