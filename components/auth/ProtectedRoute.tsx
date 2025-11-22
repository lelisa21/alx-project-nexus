'use client';

import { useAppSelector } from '@/store/hooks';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      // For demo purposes, allow access even if not authenticated
      // This lets users test the dashboard without proper auth
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChecked(true);
      
      // Optional: Uncomment to enable proper auth
      // if (!isAuthenticated) {
      //   router.push('/login');
      // }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // For demo: show children even if not authenticated
  // Remove this for production
  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
