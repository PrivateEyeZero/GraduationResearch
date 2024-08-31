import type { AppProps } from "next/app";
import { MyProvider } from "../contexts/MyContext";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
    <SessionProvider session={pageProps.session}>
    <MyProvider>
      <Component {...pageProps} />
    </MyProvider>
    </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
