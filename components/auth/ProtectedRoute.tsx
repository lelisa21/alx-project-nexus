'use client';

import { useAppSelector } from '@/store/hooks';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const isPublicPollView = /^\/polls\/[^/]+$/.test(pathname);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && !isPublicPollView) {
        router.push('/login');
        return;
      }

      setChecked(true);
    }
  }, [isAuthenticated, isPublicPollView, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
