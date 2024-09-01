"use client";

import { Box } from "@chakra-ui/react";
import {Session} from "../_util/session";
export default function Debug() {
  return <Box>このページはデバッグ用のページです。: {Session.getSessionId()}</Box>;
}
