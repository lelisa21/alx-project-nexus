export interface RuntimeCaching {
  urlPattern: RegExp | string;
  handler: 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate';
  options?: {
    cacheName?: string;
    expiration?: {
      maxEntries?: number;
      maxAgeSeconds?: number;
    };
    networkTimeoutSeconds?: number;
    [key: string]: any;
  };
}

const runtimeCaching: RuntimeCaching[] = [
  // Google Fonts
  {
    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts',
      expiration: { maxEntries: 4, maxAgeSeconds: 31536000 },
    },
  },
  {
    urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'gstatic-fonts',
      expiration: { maxEntries: 4, maxAgeSeconds: 31536000 },
    },
  },

  // Images
  {
    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'images',
      expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
    },
  },

  // API routes
  {
    urlPattern: /^\/api\/.*$/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      networkTimeoutSeconds: 10,
      expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
    },
  },

  // Dynamic pages like /polls/[id], /polls/edit/[id]
  {
    urlPattern: /^\/polls\/.*$/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'poll-pages',
      networkTimeoutSeconds: 10,
      expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
    },
  },

  // Catch-all for other pages
  {
    urlPattern: /^\/.*$/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'pages',
      networkTimeoutSeconds: 10,
      expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
    },
  },
];

export default runtimeCaching;
