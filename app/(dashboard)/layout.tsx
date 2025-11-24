'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/features/auth/authSlice';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Plus, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Home,
  Settings,
  PieChart
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout');
      dispatch(logout());
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Home,
      current: pathname === '/dashboard'
    },
    { 
      name: 'Create Poll', 
      href: '/polls/create', 
      icon: Plus,
      current: pathname === '/polls/create'
    },
    { 
      name: 'My Polls', 
      href: '/polls', 
      icon: PieChart,
      current: pathname === '/polls'
    },
    { 
      name: 'Profile', 
      href: '/profile', 
      icon: User,
      current: pathname === '/profile'
    },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-green-600 border-t-red-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 flex z-40 md:hidden bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <div className={`fixed inset-0 flex z-40 md:hidden transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-green-200/80">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              {/* Close button */}
              <div className="flex items-center justify-between px-4">
                <Image src="/logo.png" alt="logo" width={150} height={60} priority />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="mt-8 px-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-colors ${
                      item.current
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${
                      item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* User section */}
            <div className="shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-3 shrink-0 text-gray-400 hover:text-gray-500 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 border-r border-green-200 bg-[#444444]">
            <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
              {/* Logo */}
              <div className="flex items-center justify-between px-6 mb-8">
                <Link href="/dashboard" className="flex items-center space-x-2">
                 <Image src="/logo.png" alt="logo" width={150} height={60} priority />
                </Link>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      item.current
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm'
                        : 'text-white hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 transition-colors ${
                      item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* User section */}
            <div className="flex-shrink-0 border-t border-gray-200">
              <div className="flex items-center p-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-md hover:bg-gray-100"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          {/* Mobile header */}
          <div className="sticky top-0 z-10 md:hidden bg-green-200/80 border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Image src="/logo.png" alt="logo" width={150} height={60} priority />
              </Link>
              <div className="w-19"></div>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 mt-10">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
