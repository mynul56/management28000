import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface SummaryCardsProps {
    totalBalance: number;
    income: number;
    expense: number;
}

export default function SummaryCards({ totalBalance, income, expense }: SummaryCardsProps) {
    const cards = [
        { title: 'Total Balance', amount: totalBalance, icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { title: 'Monthly Income', amount: income, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { title: 'Monthly Expense', amount: expense, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-100' },
        { title: 'Net Savings', amount: income - expense, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-100' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-gray-500 font-semibold text-sm tracking-wide">{card.title}</p>
                            <div className={`p-3 rounded-2xl ${card.bg} shadow-內 shadow-white/50`}>
                                <Icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
                            ${card.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                );
            })}
        </div>
    );
}
