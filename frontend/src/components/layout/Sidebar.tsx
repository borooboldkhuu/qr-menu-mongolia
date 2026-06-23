'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Grid3X3,
  QrCode,
  BarChart3,
  Settings,
  CreditCard,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Хянах самбар', icon: LayoutDashboard },
  { href: '/categories', label: 'Ангилал', icon: Grid3X3 },
  { href: '/menu', label: 'Цэс', icon: UtensilsCrossed },
  { href: '/qr-codes', label: 'QR код', icon: QrCode },
  { href: '/analytics', label: 'Статистик', icon: BarChart3 },
  { href: '/subscription', label: 'Захиалга', icon: CreditCard },
  { href: '/settings', label: 'Тохиргоо', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-brand-600">
          <QrCode className="w-6 h-6" />
          QR Menu
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition',
              pathname === item.href
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition mt-4"
      >
        <LogOut className="w-5 h-5" />
        Гарах
      </button>
    </aside>
  );
}
