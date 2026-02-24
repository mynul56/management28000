'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, Receipt, PieChart, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Wallets', href: '/wallets', icon: Wallet },
        { name: 'Transactions', href: '/transactions', icon: Receipt },
        { name: 'Budgets', href: '/budgets', icon: PieChart },
        { name: 'Reports', href: '/reports', icon: FileText },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-100 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-20">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200 transform hover:scale-105 transition-transform cursor-pointer">
                    <Wallet className="text-white w-5 h-5" />
                </div>
                <span className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight">FinTrack</span>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-bold shadow-sm border border-indigo-100/50'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500 transition-colors'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100/60 bg-gray-50/50">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-white hover:shadow-sm hover:text-red-600 transition-all duration-200 group border border-transparent hover:border-red-100"
                >
                    <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                    <span className="font-semibold">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
