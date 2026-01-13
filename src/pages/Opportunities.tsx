import type { FC } from 'react';
import { Search, Filter, Plus, Clock, Shield, Target, DollarSign } from 'lucide-react';

const opportunities = [
    {
        id: 1,
        title: "Quantum Growth Fund - Series B",
        category: "Financial Technology",
        risk: "Moderate",
        expectedReturn: "12-15%",
        minInvestment: "$50,000",
        status: "Active",
        daysLeft: 14
    },
    {
        id: 2,
        title: "Eco-Energy Infrastructure Project",
        category: "Real Estate / ESG",
        risk: "Low",
        expectedReturn: "8-10%",
        minInvestment: "$25,000",
        status: "Closing Soon",
        daysLeft: 3
    },
    {
        id: 3,
        title: "AI Logistics Optimization",
        category: "Automation / Software",
        risk: "High",
        expectedReturn: "22-28%",
        minInvestment: "$100,000",
        status: "Active",
        daysLeft: 21
    },
    {
        id: 4,
        title: "Strategic Land Acquisition - Berlin",
        category: "Real Estate",
        risk: "Low",
        expectedReturn: "9%",
        minInvestment: "$75,000",
        status: "Under Review",
        daysLeft: 0
    }
];

export const Opportunities: FC = () => {
    return (
        <div className="space-y-8 fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#f8fafc]">Investment Opportunities</h1>
                    <p className="mt-1 text-[#94a3b8]">Explore and manage curated high-yield opportunities.</p>
                </div>
                <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-colors">
                    <Plus size={18} />
                    <span>New Opportunity</span>
                </button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                    <input
                        type="text"
                        placeholder="Search by name, sector, or ID..."
                        className="w-full rounded-xl border border-[#2e3244] bg-[#161821] py-3 pl-10 pr-4 text-sm text-[#f8fafc] focus:border-blue-500 focus:outline-none transition-colors"
                    />
                </div>
                <button className="flex items-center gap-2 rounded-xl border border-[#2e3244] bg-[#161821] px-4 py-3 text-sm font-medium text-[#f8fafc] hover:bg-[#1e212d] transition-colors">
                    <Filter size={18} />
                    <span>Filters</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {opportunities.map((opp) => (
                    <div key={opp.id} className="group relative rounded-2xl border border-[#2e3244] bg-[#161821] p-6 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5">
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">{opp.category}</span>
                                <h3 className="mt-1 text-xl font-bold text-[#f8fafc] group-hover:text-blue-400 transition-colors">{opp.title}</h3>
                            </div>
                            <div className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${opp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                                opp.status === 'Closing Soon' ? 'bg-amber-500/10 text-amber-500' :
                                    'bg-slate-500/10 text-slate-400'
                                }`}>
                                {opp.status}
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-[#94a3b8]" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-[#94a3b8]">Risk Level</p>
                                    <p className="text-sm font-medium">{opp.risk}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-[#94a3b8]" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-[#94a3b8]">Exp. Return</p>
                                    <p className="text-sm font-medium text-emerald-500">{opp.expectedReturn}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-[#94a3b8]" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-[#94a3b8]">Min Investment</p>
                                    <p className="text-sm font-medium">{opp.minInvestment}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-[#94a3b8]" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-[#94a3b8]">Time Left</p>
                                    <p className="text-sm font-medium">{opp.daysLeft} days</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            <button className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors">
                                View Details
                            </button>
                            <button className="rounded-xl border border-[#2e3244] bg-[#1e212d] px-4 py-2.5 text-sm font-bold text-[#f8fafc] hover:bg-[#2e3244] transition-colors">
                                Save
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
