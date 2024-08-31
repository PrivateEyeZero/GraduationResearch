import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      // サインイン時のコールバック処理を記述できます（必要に応じて）
      return true;
    },
    async redirect({ url, baseUrl }) {
      // 認証後のリダイレクト先を設定できます
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
