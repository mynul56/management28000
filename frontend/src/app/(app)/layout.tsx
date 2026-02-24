'use client';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { loading, user } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Auth is handled in context (redirects to login)
    if (!user) return null;

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-8 relative z-0">
                    {/* Background ambient light */}
                    <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-[-1] pointer-events-none"></div>
                    {children}
                </main>
            </div>
        </div>
    );
}
