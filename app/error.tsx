// app/error.tsx
'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-2xl border-0">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Something went wrong!
          </CardTitle>
          <CardDescription className="text-lg">
            An unexpected error has occurred.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={reset}
              icon={RefreshCw}
              className="flex-1"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              icon={Home}
              className="flex-1"
            >
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
