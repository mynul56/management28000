'use client';
import { useAuth } from '@/context/AuthContext';
import { Bell, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const { user } = useAuth();
    const pathname = usePathname();

    // Format pathname to title
    const title = pathname.split('/')[1] || 'Dashboard';
    const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">{displayTitle}</h1>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative group hidden md:block">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64"
                    />
                </div>

                <button className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border border-white"></span>
                </button>

                <div className="h-8 w-px bg-gray-200"></div>

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">{user?.name || 'Loading...'}</p>
                        <p className="text-xs text-gray-400 font-medium">{user?.email || '...'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-bold overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-100 transition-all">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
}
