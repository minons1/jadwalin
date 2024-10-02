import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL
  }
};

 if (process.env.NODE_ENV === 'development') {
   await setupDevPlatform();
 }

export default nextConfig;