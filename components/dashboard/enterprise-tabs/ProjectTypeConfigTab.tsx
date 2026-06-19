import React from 'react';
import { FolderTree, Plus, Pencil } from 'lucide-react';

const types = [
    { code: 'A01', name: '房屋建筑工程' },
    { code: 'A02', name: '市政基础设施工程' },
    { code: 'A03', name: '交通建设工程' },
    { code: 'A04', name: '水利水电工程' },
    { code: 'A05', name: '园林绿化工程' },
    { code: 'A06', name: '环保环卫工程' },
];

const ProjectTypeConfigTab: React.FC = () => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">项目类型配置</h2>
                    <p className="text-xs text-slate-400 mt-0.5">管理档案项目中可选的工程类型分类</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-hover transition-all">
                    <Plus className="w-3.5 h-3.5" />新增类型
                </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-2.5 font-semibold text-slate-500">类型编码</th>
                            <th className="text-left px-4 py-2.5 font-semibold text-slate-500">类型名称</th>
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

export default ProjectTypeConfigTab;
