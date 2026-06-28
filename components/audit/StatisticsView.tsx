import { 
    Layers, 
    Database, 
    FileText, 
    HardDrive, 
    Folder 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, subtext, icon, color }: any) => {
    return (
        <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-emerald-50/20 transition-transform group-hover:scale-110 opacity-70`}></div>
            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-slate-450 text-[10px] font-extrabold uppercase tracking-wider mb-1">{title}</p>
                    <h3 className={`text-2xl font-black text-slate-800 tracking-tight`}>{value}</h3>
                    {subtext && <p className="text-[10px] mt-2 font-bold text-slate-400 bg-slate-50 inline-block px-1.5 py-0.5 rounded-md border border-slate-100">{subtext}</p>}
                </div>
                <div className={`p-3 rounded-xl bg-emerald-50/50 text-emerald-600 shadow-inner`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

const MultiChartLine = () => {
    const chartData = [
        { month: '01月', 登记数: 22, 审核数: 18, 入库数: 12 },
        { month: '02月', 登记数: 35, 审核数: 28, 入库数: 20 },
        { month: '03月', 登记数: 40, 审核数: 32, 入库数: 25 },
        { month: '04月', 登记数: 68, 审核数: 45, 入库数: 38 },
        { month: '05月', 登记数: 72, 审核数: 52, 入库数: 45 },
        { month: '今日截止', 登记数: 128, 审核数: 96, 入库数: 82 },
    ];

    return (
        <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1890ff" stopOpacity={0.18} />
                            <stop offset="100%" stopColor="#1890ff" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.14} />
                            <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="gradC" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.14} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip
                        contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                    />
                    <Area type="monotone" dataKey="登记数" stroke="#1890ff" strokeWidth={2} fillOpacity={1} fill="url(#gradA)" dot={false} activeDot={{ r: 4, fill: '#1890ff' }} />
                    <Area type="monotone" dataKey="审核数" stroke="#f97316" strokeWidth={1.5} fillOpacity={1} fill="url(#gradB)" dot={false} activeDot={{ r: 4, fill: '#f97316' }} />
                    <Area type="monotone" dataKey="入库数" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#gradC)" dot={false} activeDot={{ r: 4, fill: '#10b981' }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export const StatisticsView = () => {
    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Scrollable contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                
                {/* 5 Indicator cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <StatCard title="入库项目" value="128 件" icon={<Layers size={20} />} />
                    <StatCard title="入库单位工程" value="342 份" icon={<HardDrive size={20} />} />
                    <StatCard title="入库案卷" value="1,892 卷" icon={<Folder size={20} />} />
                    <StatCard title="入库文件" value="12.5 万页" icon={<FileText size={20} />} />
                    <StatCard title="入库文件大小" value="1.8 TB" icon={<Database size={20} />} />
                </div>

                {/* Growth diagram */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest pl-2 border-l-4 border-emerald-600">
                            登记、审核、入库阶段趋势
                        </h3>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 select-none">
                            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span> 登记数</div>
                            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> 审核数</div>
                            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> 入库数</div>
                        </div>
                    </div>
                    <MultiChartLine />
                </div>

                {/* Bar charts removed */}

            </div>
        </div>
    );
};
