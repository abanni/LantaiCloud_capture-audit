import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, Database, PieChart as PieChartIcon, Briefcase, Activity } from 'lucide-react';

// --- Data: Collection Data Statistics ---
const DATA_BY_YEAR = [
  { year: '2022', value: 1250 },
  { year: '2023', value: 1480 },
  { year: '2024', value: 1620 },
  { year: '2025', value: 1850 },
  { year: '2026', value: 2100 },
];

const DATA_BY_CATEGORY = [
  { name: '竣工图纸', value: 1200 },
  { name: '文字卷宗', value: 850 },
  { name: '工程照片', value: 450 },
  { name: '光盘介质', value: 230 },
  { name: '缩微片张', value: 150 },
  { name: '其他载体', value: 120 },
];

const DATA_BY_SPECIFICATION = [
  { name: '1.5cm', value: 650 },
  { name: '2cm', value: 820 },
  { name: '3cm', value: 430 },
  { name: '5cm', value: 210 },
];

// --- Data: Archive Utilization ---
const DATA_METHOD_TREND = [
  { month: '1月', download: 120, print: 80 },
  { month: '2月', download: 132, print: 90 },
  { month: '3月', download: 301, print: 150 },
  { month: '4月', download: 234, print: 110 },
  { month: '5月', download: 290, print: 130 },
  { month: '6月', download: 330, print: 170 },
];

const DATA_USER_IDENTITY = [
  { name: '建设/施工单位', value: 350 },
  { name: '产权所有人', value: 420 },
  { name: '党政/司法机关', value: 180 },
  { name: '律师法律执业', value: 210 },
  { name: '物业单位', value: 120 },
];

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6'];

export const CollectionStatsCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full animate-in fade-in duration-300">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800 font-sans">馆藏数据统计</span>
        </div>
        <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 rounded-md py-0.5 px-1.5 font-bold">同步实时</span>
      </div>

      <div className="p-4.5 space-y-5">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
            <span className="text-[10px] text-slate-500 block font-bold leading-none mb-1">馆藏汇总卷数</span>
            <span className="text-base font-black text-blue-700 font-mono">6,284 卷</span>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
            <span className="text-[10px] text-slate-500 block font-bold leading-none mb-1">本年新增入库</span>
            <span className="text-base font-black text-emerald-700 font-mono">2,100 卷</span>
          </div>
        </div>

        {/* Chart 1: Donut chart for Carrier distribution */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold text-slate-700 block flex items-center gap-1">
            <PieChartIcon className="w-3.5 h-3.5 text-blue-500" />
            馆藏载体类型占比
          </span>
          <div className="h-40 flex items-center justify-between border border-slate-100 p-2 rounded-xl bg-slate-50/50">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DATA_BY_CATEGORY}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={45}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {DATA_BY_CATEGORY.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 flex flex-col gap-1 overflow-hidden pl-2">
              {DATA_BY_CATEGORY.slice(0, 4).map((entry, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] font-bold">
                  <div className="flex items-center gap-1 text-slate-500 truncate">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 bg-[${CHART_COLORS[i % CHART_COLORS.length]}]`}></div>
                    <span className="truncate">{entry.name}</span>
                  </div>
                  <span className="font-mono text-slate-800">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Annual storage growth area chart */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold text-slate-700 block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            历年累计入库趋势 (卷)
          </span>
          <div className="h-32 border border-slate-100 p-2.5 rounded-xl bg-slate-50/50">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA_BY_YEAR} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorYearStats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorYearStats)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500">
        <span>统计周期：2026年数据</span>
        <span className="font-mono text-blue-600">区块链分布式同步</span>
      </div>
    </div>
  );
};

export const UtilizationStatsCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full animate-in fade-in duration-300">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-slate-800">档案利用统计</span>
        </div>
        <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 rounded-md py-0.5 px-1.5 font-bold">同步实时</span>
      </div>

      <div className="p-4.5 space-y-5">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="bg-primary/10/50 border border-primary/20 rounded-xl p-3">
            <span className="text-[10px] text-slate-500 block font-bold leading-none mb-1">本月借阅流转</span>
            <span className="text-base font-black text-primary font-mono">1,284 人次</span>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3">
            <span className="text-[10px] text-slate-500 block font-bold leading-none mb-1">无纸化出证率</span>
            <span className="text-base font-black text-amber-700 font-mono">92.4 %</span>
          </div>
        </div>

        {/* Chart 1: Utilization Trend split */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold text-slate-700 block flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-primary" />
            近期利用服务趋势
          </span>
          <div className="h-40 border border-slate-100 p-2.5 rounded-xl bg-slate-50/50">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA_METHOD_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDownloadStats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} />
                <Tooltip />
                <Area type="monotone" dataKey="download" name="副本下载" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorDownloadStats)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: User distribution bar list */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold text-slate-700 block flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-amber-500" />
            服务利用人结构占比
          </span>
          <div className="border border-slate-150 p-2.5 rounded-xl bg-slate-50/50 space-y-2">
            {DATA_USER_IDENTITY.slice(0, 3).map((entry, idx) => {
              const maxVal = Math.max(...DATA_USER_IDENTITY.map(d => d.value));
              const percentage = Math.round((entry.value / maxVal) * 100);
              const color = CHART_COLORS[idx % CHART_COLORS.length];
              
              return (
                <div key={idx} className="space-y-0.5 text-[10px] font-bold">
                  <div className="flex justify-between items-center text-slate-650">
                    <span>{entry.name}</span>
                    <span className="font-mono text-slate-800">{entry.value} 人</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 w-[${percentage}%] bg-[${color}]`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500">
        <span>核验机制：有效电子身份证件</span>
        <span className="font-mono text-emerald-600">已连兰台链</span>
      </div>
    </div>
  );
};
