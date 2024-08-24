import type { AppProps } from "next/app";
import { MyProvider } from "../contexts/MyContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MyProvider>
      <Component {...pageProps} />
    </MyProvider>
  );
}

export default MyApp;
