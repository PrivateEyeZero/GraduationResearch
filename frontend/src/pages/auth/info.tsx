import React, { useEffect, useState } from "react";
import { Session } from "../../_util/session";
import { useRouter } from "next/navigation";
import { INVALID_SESSION_PAGE, INVALID_SESSION_MSG,BACKEND_URL } from "@/basic_info";
import { Box, Text, Heading, List, ListItem, ListIcon, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon, NotAllowedIcon} from "@chakra-ui/icons";

interface UserInfo {
  userId: string;
  userName: string;
  discordId: string;
  teamsId: string;
}

const url = BACKEND_URL + "/auth/info";

const UserInfoPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const session_id = Session.getSessionId();
    if (session_id === null) {
      router.push(INVALID_SESSION_PAGE);
    }

    const fetchUserInfo = async () => {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: session_id }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if(data.result !== "success") {
            const msg = data.message;
            if(msg==INVALID_SESSION_MSG) {
              router.push(INVALID_SESSION_PAGE);
            }
            setError(msg);
            return;
          }
          setUserInfo({
            userId: data.uuid,
            userName: data.id,
            discordId: data.discord,
            teamsId: data.teams,
          });
        })
        .catch((error) => console.error("Error:", error));
    };

    fetchUserInfo();
  }, []);

const getIcon = (data: string) => data ? <ListIcon as={CheckCircleIcon} color="green" /> : <ListIcon as={WarningIcon} color="orange" />;

if (error) return (
  <List spacing={1}>
    <ListItem>
      <ListIcon as={NotAllowedIcon} color="red" />
      <strong>{error}</strong> 
    </ListItem>
  </List>
);

return (
  <Box p={6}>
    <Heading as="h1" size="lg" mb={6}>
      ユーザー情報
    </Heading>
    {userInfo && (
      <List spacing={4}>
        <ListItem>
          {getIcon(userInfo.userId)}
          <strong>ユーザーID:</strong> {userInfo.userId}
        </ListItem>
        <ListItem>
          {getIcon(userInfo.userName)}
          <strong>ユーザー名:</strong> {userInfo.userName}
        </ListItem>
        <ListItem>
          {getIcon(userInfo.discordId)}
          <strong>連携Discord ID:</strong> {userInfo.discordId}
        </ListItem>
        <ListItem>
          {getIcon(userInfo.teamsId)}
          <strong>連携Teams ID:</strong> {userInfo.teamsId}
        </ListItem>
      </List>
    )}
  </Box>
);
};

export default UserInfoPage;
