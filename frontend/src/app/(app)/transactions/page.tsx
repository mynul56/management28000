'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        wallet: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        note: ''
    });

    const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchData();
    }, [filterMonth, filterYear]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [txRes, catRes, walRes] = await Promise.all([
                api.get(`/transactions/?month=${filterMonth}&year=${filterYear}`),
                api.get('/transactions/categories/'),
                api.get('/wallets/')
            ]);
            setTransactions(txRes.data.results || txRes.data);
            setCategories(catRes.data.results || catRes.data);
            setWallets(walRes.data.results || walRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/transactions/', {
                ...formData,
                amount: parseFloat(formData.amount),
                category: formData.category || null,
            });
            setShowModal(false);
            setFormData({ ...formData, amount: '', note: '' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            try {
                await api.delete(`/transactions/${id}/`);
                fetchData();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Transactions</h2>
                    <p className="text-gray-500 mt-1">View and manage your income and expenses.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-1">
                        <select
                            className="bg-transparent border-none focus:ring-0 text-gray-600 font-bold cursor-pointer pl-4 pr-8 py-2.5 outline-none hover:text-indigo-600 transition-colors appearance-none"
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>{format(new Date(2000, m - 1, 1), 'MMMM')}</option>
                            ))}
                        </select>
                        <div className="w-px bg-gray-200 mx-2 my-2"></div>
                        <select
                            className="bg-transparent border-none focus:ring-0 text-gray-600 font-bold cursor-pointer pl-4 pr-8 py-2.5 outline-none hover:text-indigo-600 transition-colors appearance-none"
                            value={filterYear}
                            onChange={(e) => setFilterYear(parseInt(e.target.value))}
                        >
                            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 font-bold transition-all hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" />
                        Add New
                    </button>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50/80 text-gray-500 text-xs font-bold uppercase tracking-widest">
                                <th className="px-6 py-4 rounded-tl-2xl">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Wallet</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                                        <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500 font-medium">
                                        No transactions found for this period. Try changing a filter or add a new transaction.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-gray-500 font-medium whitespace-nowrap">{format(new Date(tx.date), 'MMM dd, yyyy')}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-800">{tx.note || 'No description'}</p>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase mt-1.5 ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-semibold">{tx.category_name || '-'}</td>
                                        <td className="px-6 py-4 text-gray-500 font-semibold">{tx.wallet_name}</td>
                                        <td className={`px-6 py-4 text-right font-extrabold whitespace-nowrap text-lg ${tx.type === 'income' ? 'text-emerald-500' : 'text-gray-800'}`}>
                                            {tx.type === 'income' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDelete(tx.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 hover:scale-110">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md transition-opacity">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/20">
                        <div className="p-8">
                            <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">Add Transaction</h3>
                            <form onSubmit={handleSubmit} className="space-y-5">

                                <div className="flex bg-gray-100/80 p-1.5 rounded-2xl shadow-inner">
                                    <button type="button" onClick={() => setFormData({ ...formData, type: 'expense' })} className={`flex-1 py-3 font-black tracking-wide rounded-xl transition-all duration-300 ${formData.type === 'expense' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-rose-500' : 'text-gray-400 hover:text-gray-600'}`}>EXPENSE</button>
                                    <button type="button" onClick={() => setFormData({ ...formData, type: 'income' })} className={`flex-1 py-3 font-black tracking-wide rounded-xl transition-all duration-300 ${formData.type === 'income' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-emerald-500' : 'text-gray-400 hover:text-gray-600'}`}>INCOME</button>
                                </div>

                                <div className="grid grid-cols-2 gap-5 mt-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Amount</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-extrabold text-lg">$</span>
                                            <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-bold text-gray-800 bg-gray-50 hover:bg-white focus:bg-white text-lg" placeholder="0.00" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                                        <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-bold text-gray-700 bg-gray-50 hover:bg-white focus:bg-white" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Wallet</label>
                                        <select required value={formData.wallet} onChange={e => setFormData({ ...formData, wallet: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white focus:bg-white font-bold text-gray-700 appearance-none">
                                            <option value="">Select Wallet</option>
                                            {wallets.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white focus:bg-white font-bold text-gray-700 appearance-none">
                                            <option value="">No Category</option>
                                            {categories.filter((c: any) => c.type === formData.type).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Note / Description</label>
                                    <input type="text" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-400 font-semibold text-gray-700 bg-gray-50 hover:bg-white focus:bg-white" placeholder="Dinner with friends..." />
                                </div>

                                <div className="flex gap-4 pt-4 mt-8 border-t border-gray-100">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-0.5">Save Transaction</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
