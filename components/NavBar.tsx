'use client';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../features/auth/authSlice';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/(auth)/login');
  };

  return (
    <nav className="flex justify-between p-4 bg-gray-100">
      <Link href="/dashboard/dashboard" className="font-bold">Poll App</Link>
      {user && (
        <div className="space-x-4">
          <span>{user.name}</span>
          <button onClick={handleLogout} className="text-red-500">Logout</button>
        </div>
      )}
    </nav>
  );
}
