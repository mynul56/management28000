'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Wallet, Plus, CreditCard, Banknote } from 'lucide-react';

export default function WalletsPage() {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newWalletName, setNewWalletName] = useState('');

    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
            const res = await api.get('/wallets/');
            setWallets(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWallet = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWalletName.trim()) return;
        try {
            await api.post('/wallets/', { name: newWalletName });
            setNewWalletName('');
            setShowModal(false);
            fetchWallets();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Your Wallets</h2>
                    <p className="text-gray-500 mt-2 text-lg">Manage your accounts and balances.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 font-semibold transition-all hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    Add Wallet
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-20"><div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div></div>
            ) : wallets.length === 0 ? (
                <div className="bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200 p-20 text-center flex flex-col items-center shadow-sm">
                    <Wallet className="w-16 h-16 text-indigo-300 mb-6 drop-shadow-sm" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Wallets Found</h3>
                    <p className="text-gray-500 mb-8 max-w-sm">You haven't added any accounts to track yet. Create one to get started with your financial journey.</p>
                    <button onClick={() => setShowModal(true)} className="bg-white text-indigo-600 border border-indigo-100 px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-sm">
                        Create First Wallet
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wallets.map((wallet: any, idx: number) => (
                        <div key={wallet.id} className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
                            {/* Decorative shapes */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-12 -mb-12"></div>

                            <div className="relative z-10 flex justify-between items-start mb-16">
                                <div className="bg-white/20 p-3.5 rounded-2xl backdrop-blur-md shadow-inner">
                                    {idx % 2 === 0 ? <Banknote className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                                </div>
                                <div className="flex gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <p className="text-indigo-100/90 font-medium mb-1 drop-shadow-sm text-sm uppercase tracking-wider">{wallet.name}</p>
                                <h3 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
                                    ${parseFloat(wallet.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <h3 className="text-2xl font-extrabold text-gray-800 mb-6">Add New Wallet</h3>
                            <form onSubmit={handleCreateWallet}>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Wallet Name</label>
                                    <input
                                        type="text"
                                        required autoFocus
                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white text-gray-800 font-medium"
                                        placeholder="e.g., Main Checking, Cash, Savings"
                                        value={newWalletName}
                                        onChange={(e) => setNewWalletName(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-colors">
                                        Save Wallet
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
