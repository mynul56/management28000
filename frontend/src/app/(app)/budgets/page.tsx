'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Target } from 'lucide-react';

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        category: '',
        monthly_limit: '',
        month: new Date().toISOString().slice(0, 10)
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [budRes, catRes] = await Promise.all([
                api.get('/budgets/current/'),
                api.get('/transactions/categories/?type=expense')
            ]);
            setBudgets(budRes.data);
            setCategories(catRes.data.results || catRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payloadDate = new Date();
            payloadDate.setDate(1);

            await api.post('/budgets/', {
                category: formData.category,
                monthly_limit: parseFloat(formData.monthly_limit),
                month: payloadDate.toISOString().slice(0, 10)
            });
            setShowModal(false);
            setFormData({ category: '', monthly_limit: '', month: '' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Monthly Budgets</h2>
                    <p className="text-gray-500 mt-2 text-lg">Set limits and track your spending goals.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 font-semibold transition-all hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    Add Budget
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-20"><div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div></div>
            ) : budgets.length === 0 ? (
                <div className="bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200 p-20 text-center flex flex-col items-center shadow-sm">
                    <Target className="w-16 h-16 text-indigo-300 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Budgets Set</h3>
                    <p className="text-gray-500 mb-8 max-w-sm">Create a budget to keep your spending in check and achieve your goals.</p>
                    <button onClick={() => setShowModal(true)} className="bg-white text-indigo-600 border border-indigo-100 px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-50 shadow-sm transition-colors">
                        Set First Budget
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map((b: any) => {
                        const limit = parseFloat(b.monthly_limit);
                        const spent = b.spent || 0;
                        const percentage = Math.min((spent / limit) * 100, 100);
                        const isOver = spent > limit;

                        return (
                            <div key={b.id} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-extrabold text-xl text-gray-800 tracking-tight">{b.category_name}</h3>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${isOver ? 'bg-red-100 text-red-600' : percentage > 80 ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {percentage.toFixed(0)}% Used
                                    </span>
                                </div>

                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-1">Spent / Limit</p>
                                        <p className="text-3xl font-extrabold text-gray-800">
                                            ${spent.toFixed(2)} <span className="text-xl text-gray-400 font-bold">/ ${limit.toFixed(2)}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full bg-gray-100 rounded-full h-4 mb-3 overflow-hidden flex shadow-inner">
                                    <div
                                        className={`h-4 rounded-full transition-all duration-1000 bg-gradient-to-r ${isOver ? 'from-red-500 to-rose-600' : percentage > 80 ? 'from-yellow-400 to-amber-500' : 'from-indigo-500 to-purple-500'}`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                {isOver && <p className="text-sm font-bold text-red-500 mt-2">Exceeded by ${(spent - limit).toFixed(2)}</p>}
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">Create Budget</h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-gray-700 bg-gray-50 hover:bg-white focus:bg-white transition-colors">
                                    <option value="">Select Category</option>
                                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Limit</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-extrabold text-lg">$</span>
                                    <input type="number" step="0.01" required value={formData.monthly_limit} onChange={e => setFormData({ ...formData, monthly_limit: e.target.value })} className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-800 bg-gray-50 hover:bg-white focus:bg-white transition-colors text-lg" placeholder="0.00" />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-0.5">Save Budget</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
