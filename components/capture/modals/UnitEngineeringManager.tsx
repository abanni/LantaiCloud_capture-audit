import React, { useState, useEffect } from 'react';
import { X, Edit3 } from 'lucide-react';
import { Project, ArchiveEngineering } from '../../../types';

interface UnitEngineeringManagerProps {
    project: Project;
    onClose: () => void;
    onAddUnit: (projectId: string, unit: Omit<ArchiveEngineering, 'id'>) => void;
    onEditUnit: (projectId: string, unitId: string, name: string, code: string) => void;
}

const UnitEngineeringManager: React.FC<UnitEngineeringManagerProps> = ({
    project,
    onClose,
    onAddUnit,
    onEditUnit,
}) => {
    const [unitFormMode, setUnitFormMode] = useState<'add' | 'edit'>('add');
    const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
    const [unitFormName, setUnitFormName] = useState('');
    const [unitFormCode, setUnitFormCode] = useState('');

    // Reset form when project changes
    useEffect(() => {
        setUnitFormMode('add');
        setEditingUnitId(null);
        setUnitFormName('');
        setUnitFormCode('');
    }, [project.id]);

    const handleAddUnit = () => {
        if (!unitFormName.trim() || !unitFormCode.trim()) return;

        onAddUnit(project.id, {
            name: unitFormName.trim(),
            code: unitFormCode.trim(),
            volumes: [],
            stage: '整理中',
        });

        setUnitFormName('');
        setUnitFormCode('');
    };

    const handleEditUnit = () => {
        if (!editingUnitId || !unitFormName.trim() || !unitFormCode.trim()) return;

        onEditUnit(project.id, editingUnitId, unitFormName.trim(), unitFormCode.trim());

        setUnitFormMode('add');
        setEditingUnitId(null);
        setUnitFormName('');
        setUnitFormCode('');
    };

    const startEdit = (u: ArchiveEngineering) => {
        setUnitFormMode('edit');
        setEditingUnitId(u.id);
        setUnitFormName(u.name);
        setUnitFormCode(u.code);
    };

    const cancelEdit = () => {
        setUnitFormMode('add');
        setEditingUnitId(null);
        setUnitFormName('');
        setUnitFormCode('');
    };

    const units = project.units || [];

    const getUnitBadgeClass = (stage?: string) => {
        if (stage === '整理中') return 'bg-amber-50 border-amber-200 text-amber-700';
        if (stage === '审核中') return 'bg-blue-50 border-blue-200 text-blue-700';
        if (stage === '已入库') return 'bg-emerald-50 border-emerald-200 text-emerald-700';
        return 'bg-stone-50 border-stone-200 text-stone-600';
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-4xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header bar */}
                <div className="bg-[#001529] px-6 py-4 flex items-center justify-between text-white border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🏗️</span>
                        <div>
                            <h3 className="font-bold text-sm">单位工程与单体工程管理</h3>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5">项目: {project.name}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10"
                        title="关闭"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Split Body Layout */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-[400px]">
                    {/* Left Column: Units List/Table */}
                    <div className="flex-1 p-6 overflow-y-auto border-r border-slate-100 flex flex-col space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                已登记单位工程 ({units.length})
                            </h4>
                            <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 align-middle self-center">
                                依据城建档案法规：单位工程不得任意删除
                            </span>
                        </div>

                        <div className="border border-slate-100 rounded-xl overflow-hidden bg-white flex-1 min-h-[220px]">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                                        <th className="py-2.5 px-3">序号</th>
                                        <th className="py-2.5 px-3">单位工程(单体)名称</th>
                                        <th className="py-2.5 px-3 font-mono">质量监督号/编号</th>
                                        <th className="py-2.5 px-3">状态</th>
                                        <th className="py-2.5 px-3 text-right">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {units.length > 0 ? (
                                        units.map((u, idx) => {
                                            const unitBadge = getUnitBadgeClass(u.stage);
                                            const isCurrentlyEditingThis = editingUnitId === u.id;

                                            return (
                                                <tr 
                                                    key={u.id}
                                                    className={`hover:bg-slate-50/50 transition-colors ${isCurrentlyEditingThis ? 'bg-primary/[0.08]' : ''}`}
                                                >
                                                    <td className="py-3 px-3 text-slate-400 font-mono font-bold">{idx + 1}</td>
                                                    <td className="py-3 px-3 text-slate-800 font-bold">{u.name}</td>
                                                    <td className="py-3 px-3 text-slate-600 font-mono font-semibold">{u.code || '-'}</td>
                                                    <td className="py-3 px-3">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${unitBadge}`}>
                                                            {u.stage || '整理中'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-3 text-right">
                                                        <button
                                                            onClick={() => startEdit(u)}
                                                            className="px-2.5 py-1 bg-slate-50 hover:bg-primary/10 hover:text-primary text-slate-600 border border-slate-200 hover:border-primary/20 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                                                        >
                                                            <Edit3 className="w-3" />
                                                            修改名称与编号
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-slate-400 text-xs font-semibold">
                                                📂 暂无任何子单位工程，请在右侧登记新增
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Column: Manage Form Panel */}
                    <div className="w-full md:w-80 bg-slate-50/50 p-6 flex flex-col justify-between overflow-y-auto border-t md:border-t-0 border-slate-100">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                                <h4 className="font-bold text-slate-700 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                                    {unitFormMode === 'add' ? '🏗️ 登记新单位工程' : '🔧 修改工程信息'}
                                </h4>
                                {unitFormMode === 'edit' && (
                                    <button
                                        onClick={cancelEdit}
                                        className="text-[10px] text-slate-500 hover:text-slate-800 font-bold hover:underline cursor-pointer"
                                    >
                                        切回登记新增
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3.5 text-xs font-semibold">
                                <div className="space-y-1.5">
                                    <label className="text-slate-600 font-bold block">单位工程(单体)名称</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
                                        value={unitFormName}
                                        onChange={(e) => setUnitFormName(e.target.value)}
                                        placeholder="例如：6#住宅楼、配电房"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-slate-600 font-bold block">质监/监管编号 (或设计编码)</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white font-mono"
                                        value={unitFormCode}
                                        onChange={(e) => setUnitFormCode(e.target.value)}
                                        placeholder="例如：ZJ-2026-991"
                                    />
                                </div>

                                {unitFormMode === 'add' ? (
                                    <button
                                        onClick={handleAddUnit}
                                        disabled={!unitFormName.trim() || !unitFormCode.trim()}
                                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl cursor-pointer transition-colors text-center text-xs"
                                    >
                                        确认登记新增
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={cancelEdit}
                                            className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 font-bold cursor-pointer transition-colors text-center text-xs"
                                        >
                                            取消
                                        </button>
                                        <button
                                            onClick={handleEditUnit}
                                            disabled={!unitFormName.trim() || !unitFormCode.trim()}
                                            className="flex-1 py-2.5 bg-primary hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl cursor-pointer transition-colors text-center text-xs"
                                        >
                                            保存修改
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-medium leading-relaxed italic">
                            提示：按照城建档案信息化安全守则，已登记的实体单位工程不允许任意删除，以保证全生命周期数据追溯链路之完整性。
                        </div>
                    </div>
                </div>

                {/* Footer bar */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono">区块链统一数字确权标识：LantaiCloud-UID-SM9</span>
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
                    >
                        关闭
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnitEngineeringManager;
