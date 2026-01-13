import type { FC, ElementType } from 'react';
import {
    TrendingUp,
    Briefcase,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Calendar
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
];

const barData = [
    { name: 'Strategy A', value: 45 },
    { name: 'Strategy B', value: 25 },
    { name: 'Strategy C', value: 15 },
    { name: 'Strategy D', value: 10 },
    { name: 'Strategy E', value: 5 },
];

const COLORS = ['#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#f43f5e'];

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    icon: ElementType;
}

const StatCard = ({ title, value, change, trend, icon: Icon }: StatCardProps) => (
    <div className="rounded-2xl border border-[#2e3244] bg-[#161821] p-6 shadow-sm">
        <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Icon size={24} />
            </div>
            <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend === 'up' ? "text-emerald-500" : trend === 'down' ? "text-rose-500" : "text-slate-400"
            )}>
                {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {change}
            </div>
        </div>
        <div className="mt-4">
            <p className="text-sm font-medium text-[#94a3b8]">{title}</p>
            <h3 className="mt-1 text-2xl font-bold text-[#f8fafc]">{value}</h3>
        </div>
    </div>
);

// Helper for class names since we are in a standalone file
const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export const Dashboard: FC = () => {
    return (
        <div className="space-y-8 fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#f8fafc]">Executive Dashboard</h1>
                    <p className="mt-1 text-[#94a3b8]">Welcome back, Menno. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 rounded-xl border border-[#2e3244] bg-[#161821] px-4 py-2 text-sm font-medium text-[#f8fafc] hover:bg-[#1e212d] transition-colors">
                        <Calendar size={16} />
                        <span>Jan 13, 2026 - Jan 20, 2026</span>
                    </button>
                    <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-colors">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Portfolio Value"
                    value="$1,284,430"
                    change="+12.5%"
                    trend="up"
                    icon={DollarSign}
                />
                <StatCard
                    title="Active Opportunities"
                    value="42"
                    change="+3 new"
                    trend="up"
                    icon={Briefcase}
                />
                <StatCard
                    title="Avg. Return Rate"
                    value="18.4%"
                    change="-0.5%"
                    trend="down"
                    icon={TrendingUp}
                />
                <StatCard
                    title="System Health"
                    value="99.9%"
                    change="Stable"
                    trend="neutral"
                    icon={Activity}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Chart */}
                <div className="rounded-2xl border border-[#2e3244] bg-[#161821] p-6 shadow-sm lg:col-span-2">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-bold">Growth Analysis</h3>
                        <select className="bg-[#0a0b10] border border-[#2e3244] rounded-lg px-2 py-1 text-sm text-[#94a3b8] outline-none">
                            <option>Last 6 months</option>
                            <option>Last year</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2e3244" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#161821', border: '1px solid #2e3244', borderRadius: '8px' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Chart */}
                <div className="rounded-2xl border border-[#2e3244] bg-[#161821] p-6 shadow-sm">
                    <h3 className="mb-6 text-lg font-bold">Strategy Allocation</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#2e3244" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    width={80}
                                />
                                <Tooltip
                                    cursor={{ fill: '#1e212d' }}
                                    contentStyle={{ backgroundColor: '#161821', border: '1px solid #2e3244', borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {barData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        {barData.map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-[#94a3b8]">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    {item.name}
                                </div>
                                <span className="font-medium text-[#f8fafc]">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
