import { useState, type FC } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    PieChart,
    Settings,
    Bell,
    Search,
    ChevronLeft,
    ChevronRight,
    User
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Briefcase, label: 'Opportunities', path: '/opportunities' },
    { icon: PieChart, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Layout: FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-[#0a0b10] text-[#f8fafc] overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn(
                    "relative flex flex-col border-r border-[#2e3244] bg-[#161821] transition-all duration-300 ease-in-out",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="flex items-center gap-3 p-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
                        V
                    </div>
                    {isSidebarOpen && (
                        <span className="text-xl font-bold tracking-tight">Velocity</span>
                    )}
                </div>

                <nav className="flex-1 space-y-2 px-3 py-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:bg-[#1e212d]",
                                isActive ? "bg-blue-600/10 text-blue-500" : "text-[#94a3b8]"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-[#2e3244] bg-[#161821] text-[#94a3b8] hover:text-white"
                >
                    {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>

                <div className="border-t border-[#2e3244] p-4">
                    <div className={cn(
                        "flex items-center gap-3 rounded-xl p-2",
                        isSidebarOpen ? "hover:bg-[#1e212d]" : "justify-center"
                    )}>
                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
                            <User size={16} />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-medium">Menno Drescher</span>
                                <span className="text-xs text-[#94a3b8] truncate">menno@example.com</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b border-[#2e3244] bg-[#161821]/50 px-8 backdrop-blur-md">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                className="w-full rounded-lg border border-[#2e3244] bg-[#0a0b10] py-2 pl-10 pr-4 text-sm text-[#f8fafc] focus:border-blue-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-[#94a3b8] hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 border-2 border-[#161821]"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
