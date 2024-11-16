import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Session } from "@/_util/session";
import { BACKEND_URL, INVALID_SESSION_MSG, INVALID_SESSION_PAGE } from "@/basic_info";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Button,
} from "@chakra-ui/react";

const responseUrl = BACKEND_URL + "/message/response/post";

const SafetyResponse = () => {
  const router = useRouter();
  const [safetyStatus, setSafetyStatus] = useState(true);
  const [message, setMessage] = useState("");
  const [messageId, setMessageId] = useState<string | null>(null);

  useEffect(() => {
    const session_id = Session.getSessionId();
    if (session_id === null) {
      router.push(INVALID_SESSION_PAGE);
    }
    if (router.isReady) {
      const { message_id } = router.query;
      setMessageId(typeof message_id === "string" ? message_id : null);
    }
  }, [router.isReady]);

  const handleSubmit = async () => {
    console.log("Safety Status:", safetyStatus ? "被害なし" : "被害あり");
    console.log("Message:", message);
    const session_id = Session.getSessionId();
    if (session_id === null) {
      router.push(INVALID_SESSION_PAGE);
    }
    try{
      const data = await (
        await fetch(responseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id: session_id, message_id: messageId, safety: safetyStatus, content: message }),
        })
      ).json();
      if (data.result === "failed" &&data.message === INVALID_SESSION_MSG) {
        router.push(INVALID_SESSION_PAGE);
      }
    }catch(e){
      console.log(e);
    }
  };

  return (
    <Box p={4} maxWidth="500px" mx="auto" borderWidth="1px" borderRadius="md">
      <Heading as="h2" size="lg" mb={4}>
        安否状況
      </Heading>
      <FormControl id="safetyStatus" mb={4}>
        <FormLabel>被害状況:</FormLabel>
        <Select
          value={safetyStatus ? "true" : "false"}
          onChange={(e) => setSafetyStatus(e.target.value === "true")}
        >
          <option value="true">被害なし</option>
          <option value="false">被害あり</option>
        </Select>
      </FormControl>
      <FormControl id="message" mb={4}>
        <FormLabel>メッセージ:</FormLabel>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="自由メッセージを入力してください"
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleSubmit}>
        送信
      </Button>
    </Box>
  );
};

export default SafetyResponse;
