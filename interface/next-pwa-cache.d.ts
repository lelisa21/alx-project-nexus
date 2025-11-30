declare module 'next-pwa' {
  import { NextConfig } from 'next';

  type NextPWAOptions = {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    runtimeCaching?: any[];
    [key: string]: any;
  };

  function withPWA(nextConfig: NextConfig): NextConfig;
  function withPWA(options: NextPWAOptions): (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}

declare module 'next-pwa/cache' {
  const runtimeCaching: any[];
  export default runtimeCaching;
}
