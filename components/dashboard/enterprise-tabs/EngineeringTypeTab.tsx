import React from 'react';
import { Layers, Plus, Pencil } from 'lucide-react';

const types = [
    { code: 'B01', name: '地基与基础工程' },
    { code: 'B02', name: '主体结构工程' },
    { code: 'B03', name: '建筑装饰装修工程' },
    { code: 'B04', name: '建筑屋面工程' },
    { code: 'B05', name: '建筑给排水工程' },
    { code: 'B06', name: '建筑电气工程' },
    { code: 'B07', name: '智能建筑工程' },
    { code: 'B08', name: '通风与空调工程' },
    { code: 'B09', name: '电梯工程' },
];

const EngineeringTypeTab: React.FC = () => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">工程类型管理</h2>
                    <p className="text-xs text-slate-400 mt-0.5">管理各单位工程的专业分类</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-hover transition-all">
                    <Plus className="w-3.5 h-3.5" />新增工程类型
                </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-2.5 font-semibold text-slate-500">编码</th>
                            <th className="text-left px-4 py-2.5 font-semibold text-slate-500">工程类型名称</th>
                            <th className="text-right px-4 py-2.5 font-semibold text-slate-500">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {types.map(t => (
                            <tr key={t.code} className="hover:bg-slate-50">
                                <td className="px-4 py-2.5 font-mono text-slate-600">{t.code}</td>
                                <td className="px-4 py-2.5 font-medium text-slate-800">{t.name}</td>
                                <td className="px-4 py-2.5 text-right">
                                    <button className="text-primary hover:text-primary-hover font-semibold flex items-center gap-1 ml-auto">
                                        <Pencil className="w-3 h-3" />编辑
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EngineeringTypeTab;
