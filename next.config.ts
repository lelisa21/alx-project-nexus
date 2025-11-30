import withPWA from 'next-pwa';
import runtimeCaching from './app/pwa-runtime-caching';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  // empty turbopack config to avoid build error
  turbopack: {},
};

export default withPWA({
  dest: 'public',
  disable: !isProd,   // disables PWA in dev
  register: true,
  skipWaiting: true,
  runtimeCaching,
})(nextConfig);
