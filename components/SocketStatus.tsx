'use client';

import { useSockets } from '@/hooks/useSocket';

export function SocketStatus() {
  const { isConnected, connectionError } = useSockets();

  if (connectionError) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg shadow-lg">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 bg-green-100 border border-green-300 text-green-700 px-3 py-2 rounded-lg shadow-lg">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-sm">Live</span>
    </div>
  );
}
