'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import SummaryCards from '@/components/dashboard/SummaryCards';
import { IncomeExpenseBarChart, CategoryPieChart } from '@/components/dashboard/Charts';
import RecentTransactions from '@/components/dashboard/RecentTransactions';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        totalBalance: 0,
        monthlyReport: { total_income: 0, total_expense: 0, expense_by_category: [] },
        recentTransactions: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [walletsRes, reportRes, txRes] = await Promise.all([
                    api.get('/wallets/'),
                    api.get('/reports/monthly/'),
                    api.get('/transactions/')
                ]);

                const totalBalance = walletsRes.data.reduce((acc: number, w: any) => acc + parseFloat(w.balance), 0);

                setData({
                    totalBalance,
                    monthlyReport: reportRes.data,
                    recentTransactions: txRes.data.results || txRes.data
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Overview</h2>
                <p className="text-gray-500 mt-2 text-lg">Your financial snapshot for this month.</p>
            </div>

            <SummaryCards
                totalBalance={data.totalBalance}
                income={data.monthlyReport.total_income}
                expense={data.monthlyReport.total_expense}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <IncomeExpenseBarChart
                    income={data.monthlyReport.total_income}
                    expense={data.monthlyReport.total_expense}
                />
                <CategoryPieChart
                    data={data.monthlyReport.expense_by_category}
                />
            </div>

            <div className="mt-8">
                <RecentTransactions transactions={data.recentTransactions} />
            </div>

        </div>
    );
}
