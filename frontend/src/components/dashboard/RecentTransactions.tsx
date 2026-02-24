import { format } from 'date-fns';

interface Transaction {
    id: number;
    wallet_name: string;
    category_name: string | null;
    amount: string;
    type: string;
    date: string;
}

export default function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-white/50">
                <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
            </div>

            {transactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500 font-medium">
                    No recent transactions found.
                </div>
            ) : (
                <div className="divide-y divide-gray-50">
                    {transactions.slice(0, 5).map((tx) => (
                        <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                                    }`}>
                                    {tx.type === 'income' ? '+' : '-'}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{tx.category_name || 'Uncategorized'}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <span>{tx.wallet_name}</span>
                                        <span>•</span>
                                        <span>{format(new Date(tx.date), 'MMM dd, yyyy')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-extrabold text-lg ${tx.type === 'income' ? 'text-emerald-500' : 'text-gray-800'}`}>
                                    {tx.type === 'income' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
