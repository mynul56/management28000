'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';

export function IncomeExpenseBarChart({ income, expense }: { income: number, expense: number }) {
    const data = [
        { name: 'Income', amount: income, fill: '#10b981' }, // emerald-500
        { name: 'Expense', amount: expense, fill: '#f43f5e' } // rose-500
    ];

    return (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Income vs Expense</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontWeight: 600 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} tickFormatter={(val) => `$${val}`} />
                        <RechartsTooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];

export function CategoryPieChart({ data }: { data: any[] }) {
    const hasData = data && data.length > 0 && data.some(d => d.total > 0);

    return (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Expense by Category</h3>
            {!hasData ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 font-medium">
                    No expenses this month.
                </div>
            ) : (
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius="65%"
                                outerRadius="90%"
                                paddingAngle={4}
                                dataKey="total"
                                nameKey="category__name"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.category__color || COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip
                                formatter={(value: number) => `$${value.toFixed(2)}`}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend iconType="circle" />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
