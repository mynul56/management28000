'use client';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Settings</h2>
                <p className="text-gray-500 mt-2 text-lg">Manage your profile and application preferences.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h3>
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-4xl font-bold flex items-center justify-center shadow-lg shadow-indigo-200">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-gray-800">{user?.name}</h4>
                            <p className="text-gray-500 font-medium">{user?.email}</p>
                        </div>
                    </div>

                    <form className="space-y-6 max-w-lg">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                            <input
                                type="text"
                                disabled
                                value={user?.name || ''}
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 font-semibold text-gray-600"
                            />
                            <p className="text-xs text-gray-400 mt-2">To change your name, please contact support.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                disabled
                                value={user?.email || ''}
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 font-semibold text-gray-600"
                            />
                        </div>
                    </form>
                </div>

                <div className="p-8 bg-gray-50/50">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Security</h3>
                    <button className="bg-white border hover:bg-gray-50 border-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold transition-colors">
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
}
