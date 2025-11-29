'use client'; 

import Link from 'next/link';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-2xl border-0">
        <CardHeader className="space-y-4 pb-6 w-full">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Page Not Found
          </CardTitle>
          <CardDescription className="text-lg">
            Oops! The page you're looking for doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <Button className="w-full" icon={Home}>
                Go Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.history.back()}
              icon={ArrowLeft}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
