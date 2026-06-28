import React from 'react';
import { ShieldCheck, ArrowRight, Settings, Plus } from 'lucide-react';

const stages = [
    { name: '企业著录', role: '企业著录员', next: '档案馆登记', color: 'bg-purple-500' },
    { name: '档案馆登记', role: '档案馆登记员', next: '档案馆初审', color: 'bg-blue-500' },
    { name: '档案馆初审', role: '档案馆审核员', next: '档案馆复审', color: 'bg-indigo-500' },
    { name: '档案馆复审', role: '档案馆审核员', next: '归档入库', color: 'bg-orange-500' },
    { name: '归档入库', role: '系统自动', next: null, color: 'bg-emerald-500' },
];

const AuditFlowConfigTab: React.FC = () => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">审核流程配置</h2>
                    <p className="text-xs text-slate-400 mt-0.5">配置档案审核流转节点与角色权限</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-hover transition-all">
                    <Settings className="w-3.5 h-3.5" />流程设置
                </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-4 px-2">
                {stages.map((s, i) => (
                    <React.Fragment key={s.name}>
                        <div className="flex flex-col items-center gap-1.5 shrink-0">
                            <div className={`w-10 h-10 ${s.color} rounded-full flex items-center justify-center text-white shadow-xs`}>
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-semibold text-slate-700">{s.name}</span>
                            <span className="text-[10px] text-slate-400">{s.role}</span>
                        </div>
                        {s.next && (
                            <div className="flex items-center shrink-0">
                                <div className="h-px w-6 bg-slate-300" />
                                <ArrowRight className="w-4 h-4 text-slate-300" />
                                <div className="h-px w-6 bg-slate-300" />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-bold text-slate-700 mb-2">审核规则</h3>
                <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>初审通过后自动进入复审环节，不可跳过</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>复审不通过退回至企业著录阶段，并记录审核意见</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>归档入库后档案状态锁定，仅可查阅不可修改</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditFlowConfigTab;
