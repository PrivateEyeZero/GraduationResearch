import dotenv from 'dotenv';
dotenv.config({ path: './data/.env' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 他のNext.jsの設定を追加できます
};

export default nextConfig;
