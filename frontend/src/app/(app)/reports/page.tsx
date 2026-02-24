'use client';
import { DownloadCloud, FileText, Download } from 'lucide-react';
import api from '@/lib/api';

export default function ReportsPage() {
    const handleExportCSV = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:8000/api/reports/export/csv/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'transactions.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error(err);
        }
    };

    const handleExportPDF = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:8000/api/reports/export/pdf/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'transactions.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="mb-10">
                <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Data Export & Reports</h2>
                <p className="text-gray-500 mt-2 text-lg">Generate detailed financial statements and backup your data.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center group hover:shadow-lg transition-shadow">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <DownloadCloud className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">CSV Export</h3>
                    <p className="text-gray-500 mb-8 max-w-sm">Download your entire transaction history as a spreadsheet for use in Excel or Google Sheets.</p>
                    <button
                        onClick={handleExportCSV}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        Download CSV
                    </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center group hover:shadow-lg transition-shadow">
                    <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-10 h-10 text-rose-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">PDF Report</h3>
                    <p className="text-gray-500 mb-8 max-w-sm">Generate a clean, printable PDF statement containing all your categorized transactions.</p>
                    <button
                        onClick={handleExportPDF}
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30 transition-colors"
                    >
                        <FileText className="w-5 h-5" />
                        Generate PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
