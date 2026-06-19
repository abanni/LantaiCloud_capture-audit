import React from 'react';
import { FileText, Download, Plus } from 'lucide-react';

const templates = [
    { name: '建设工程档案著录模板', version: 'v2.3', updated: '2026-05-20', category: '建筑工程' },
    { name: '市政基础设施档案模板', version: 'v1.8', updated: '2026-04-15', category: '市政工程' },
    { name: '竣工验收备案表模板', version: 'v3.0', updated: '2026-06-01', category: '竣工验收' },
    { name: '规划审批档案模板', version: 'v2.0', updated: '2026-03-10', category: '规划管理' },
    { name: '监理日志标准模板', version: 'v1.5', updated: '2026-02-28', category: '监理文档' },
];

const ArchiveTemplateTab: React.FC = () => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">档案馆模板管理</h2>
                    <p className="text-xs text-slate-400 mt-0.5">管理档案著录与审核所需的标准化模板</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-hover transition-all">
                    <Plus className="w-3.5 h-3.5" />新增模板
                </button>
            </div>

            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                {templates.map((t, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-800 truncate">{t.name}</div>
                            <div className="text-[11px] text-slate-400">{t.version} · {t.category} · 更新于 {t.updated}</div>
                        </div>
                        <button className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover font-semibold">
                            <Download className="w-3.5 h-3.5" />下载
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArchiveTemplateTab;
