import React from 'react';
import { 
    Files, 
    Archive, 
    Clock, 
    ArrowRight, 
    CheckCircle, 
    AlertCircle, 
    PlusCircle, 
    Search, 
    BookOpen, 
    Bell, 
    Layers,
    Database,
    FileText,
    HardDrive
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArchiveItem } from './auditTypes';
import { StatusBadge } from './Shared';



const QuickActionCard = ({ icon, label, desc, onClick, color }: any) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-start p-4 bg-white rounded-2xl hover:shadow-lg hover:bg-slate-50 transition-all duration-200 group text-left w-full cursor-pointer border border-slate-100/50"
    >
        <div className={`p-2.5 rounded-xl bg-emerald-50 text-emerald-600 mb-3 group-hover:scale-105 transition-transform`}>
            {icon}
        </div>
        <h4 className="font-bold text-slate-800 text-xs mb-1">{label}</h4>
        {desc && <p className="text-[10px] text-slate-400 leading-normal">{desc}</p>}
    </button>
);

const StatMiniCard = ({ label, value, icon, color = 'emerald' }: any) => (
    <div className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-slate-100/50">
        <div>
            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">{label}</p>
            <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-emerald-50/50 text-emerald-600`}>
            {icon}
        </div>
    </div>
);

const DistributionChart = ({ data }: { data: { name: string, value: number, color: string, dotClass: string }[] }) => {
    const total = data.reduce((acc, cur) => acc + cur.value, 0);
    let cumulativePercent = 0;

    return (
        <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 shrink-0">
                <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full select-none">
                    {data.map((item, index) => {
                        const percent = item.value / total;
                        const dashArray = percent * 251.2; // 2 * 3.14 * 40
                        const dashOffset = -cumulativePercent * 251.2;
                        cumulativePercent += percent;
                        
                        return (
                            <circle
                                key={index}
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke={item.color}
                                strokeWidth="12"
                                strokeDasharray={`${dashArray} ${252 - dashArray}`}
                                strokeDashoffset={dashOffset}
                                className="transition-all duration-300 hover:stroke-[16px] cursor-pointer"
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                    <span className="text-[9px] text-slate-450 font-bold uppercase tracking-widest">库存总规分</span>
                    <span className="text-lg font-black text-slate-800">{total}</span>
                </div>
            </div>
            <div className="flex-1 space-y-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${item.dotClass}`}></span>
                            <span className="text-slate-600 font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold text-slate-800">{item.value} 案</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const NoticeItem = ({ tag, title, date }: any) => (
    <div className="py-2.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors cursor-pointer flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[9px] font-bold rounded-md border border-red-100">{tag}</span>
            <span className="text-[10px] text-slate-400 font-medium font-mono ml-auto">{date}</span>
        </div>
        <p className="text-xs font-semibold text-slate-750 line-clamp-1">{title}</p>
    </div>
);

// Clean professional chart using Recharts
const MonthlyGrowthTrend = () => {
    const chartData = [
        { month: '01月', value: 22 },
        { month: '02月', value: 35 },
        { month: '03月', value: 40 },
        { month: '04月', value: 68 },
        { month: '05月', value: 72 },
        { month: '今日/本周', value: 128 },
    ];

    return (
        <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1890ff" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#1890ff" stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip
                        contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                        formatter={(value: number) => [`${value} 件`, '移交入库']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#1890ff" strokeWidth={2} fillOpacity={1} fill="url(#trendGradient)" dot={{ r: 0 }} activeDot={{ r: 4, fill: '#1890ff', stroke: 'white', strokeWidth: 2 }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export const AuditDashboard = ({ 
    archives, 
    onNavigate 
}: { 
    archives: ArchiveItem[], 
    onNavigate: (tab: string, projectId?: string) => void 
}) => {
    // Stage division counters
    const pendingReview = archives.filter(a => ["FIRST_REVIEW", "SECOND_REVIEW"].includes(a.stage));
    const pendingRegister = archives.filter(a => a.stage === "REGISTER");
    const completed = archives.filter(a => a.stage === "COMPLETED");
    const activeAuditsCount = pendingReview.length;

    // Static inventory distributions
    const distributionData = [
        { name: '轻工工业厂房类', value: 145, color: '#3b82f6', dotClass: 'bg-blue-500' },
        { name: '住宅商办房建', value: 85, color: '#10b981', dotClass: 'bg-emerald-500' },
        { name: '市政配套基础设施', value: 42, color: '#f97316', dotClass: 'bg-orange-500' },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Scroll view wrapper */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        
                        {/* Left column charts and tables */}
                        <div className="lg:col-span-3 space-y-6">
                            
                            {/* Counter widgets */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatMiniCard label="档案登记" value={pendingRegister.length} icon={<Files size={18} />} />
                                <StatMiniCard label="审核中" value={pendingReview.length} icon={<Clock size={18} />} />
                                <StatMiniCard label="已退回" value="1" icon={<AlertCircle size={18} />} />
                                <StatMiniCard label="已入库" value={completed.length + 104} icon={<Archive size={18} />} />
                            </div>

                            {/* Monthly trend diagram */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100/50">
                                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest pl-2 mb-6 border-l-4 border-emerald-500 flex items-center justify-between">
                                    <span>数字档案移交入库环比增长态势</span>
                                    <span className="text-[10px] text-slate-400 font-mono normal-case">单位/件数</span>
                                </h3>
                                <MonthlyGrowthTrend />
                            </div>

                            {/* Pending active assignments table checklist */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100/50 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                                        <CheckCircle className="text-emerald-500" size={16} /> 待审核档案项目 ({pendingReview.length})
                                    </h3>
                                    <button 
                                        onClick={() => onNavigate("audit")}
                                        className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5"
                                    >
                                        处理待办 <ArrowRight size={13} />
                                    </button>
                                </div>
                                <div className="divide-y divide-slate-100 text-xs">
                                    {pendingReview.length > 0 ? (
                                        pendingReview.slice(0, 4).map(item => (
                                            <div key={item.id} className="p-4 hover:bg-slate-50 flex items-center justify-between group transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 mb-0.5 truncate max-w-[280px] md:max-w-xs">{item.projectInfo.projectName}</h4>
                                                        <p className="text-[10px] text-slate-400">
                                                            申报人: {item.projectInfo.operator || '岑源'} · 提交挂载: {item.submissionDate}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <StatusBadge stage={item.stage} />
                                                    <button 
                                                        onClick={() => onNavigate("audit-projects", item.projectInfo.id)}
                                                        className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-700 hover:shadow shadow-emerald-100 text-[10px] cursor-pointer"
                                                    >
                                                        档案审核
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-10 text-center text-slate-400">
                                            <CheckCircle size={32} className="mx-auto mb-1.5 text-emerald-300" />
                                            <p className="font-semibold">窗口待办处于净空状态，系统健康无负荷。</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Right column bento widgets */}
                        <div className="space-y-6">
                            
                            {/* Direct shortcuts */}
                            <div className="grid grid-cols-2 gap-4">
                                <QuickActionCard 
                                    icon={<PlusCircle size={16} />} 
                                    label="档案登记" 
                                    onClick={() => onNavigate("registration")} 
                                />
                                <QuickActionCard 
                                    icon={<Search size={16} />} 
                                    label="项目信息" 
                                    onClick={() => onNavigate("projectInfo")} 
                                />
                            </div>

                            {/* Inventory donut representation */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100/50 p-5">
                                <h3 className="font-bold text-slate-800 mb-4 text-[11px] uppercase tracking-wider">正在审核案卷分布结构</h3>
                                <DistributionChart data={distributionData} />
                            </div>

                            {/* Broad notifications panel */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100/50 p-5">
                                <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-3">
                                    <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">系统要目公告</h3>
                                    <span className="text-[10px] text-emerald-600 hover:underline cursor-pointer">更多</span>
                                </div>
                                <div className="space-y-0.5">
                                    <NoticeItem tag="重大" title="关于开展数字双层PDF红外套色数字签名核算标准的通知" date="06-03" />
                                    <NoticeItem tag="规程" title="常熟/昆山分设档案窗口纸质文件去皮去钉数字化归档大纲" date="05-28" />
                                    <NoticeItem tag="锁定" title="底层区块链数字契印加密协议进行版本更新的系统报告" date="05-15" />
                                </div>
                            </div>

                        </div>
                    </div>
            </div>
        </div>
    );
};
export default AuditDashboard;
