'use client';

import { store } from '@/store/store';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setUser, setLoading } from '@/features/auth/authSlice';
import { usePathname, useRouter } from 'next/navigation';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
          const user = await response.json();
          console.log('Auth check result:', user);
          
          if (user) {
            dispatch(setUser(user));
            
        
            if (pathname === '/login' || pathname === '/register') {
              router.push('/dashboard');
            }
          } else {
            // No user logged in
            if (pathname.startsWith('/dashboard')) {
         
              console.log('No user, but staying on page for demo');
            }
          }
        } else {
          console.log('Auth check failed with status:', response.status);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch, router, pathname]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
}
