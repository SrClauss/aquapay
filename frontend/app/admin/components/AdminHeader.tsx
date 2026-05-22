'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { removeAdminToken, getAdminToken } from '@/lib/adminAuth';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Leads', href: '/admin/leads' },
  { label: 'Posts', href: '/admin/posts' },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const token = getAdminToken();

  const handleLogout = () => {
    removeAdminToken();
    router.push('/admin/login');
  };

  return (
    <header className="w-full bg-slate-950/95 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-xl">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-4 max-w-7xl">
        <div>
          <Link href="/admin/dashboard" className="text-white font-black text-lg tracking-wide">
            Água Pay Admin
          </Link>
        </div>

        <nav className="flex flex-wrap items-center gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${pathname === item.href ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              {item.label}
            </Link>
          ))}
          {token && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition"
            >
              Sair
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
