import React, { useState } from 'react';
import {
    Edit3, ChevronLeft, ChevronRight, Filter, ShieldCheck, Info, Undo2, X
} from 'lucide-react';
import { ArchiveItem, WorkflowStage, ProjectFilterCriteria } from './auditTypes';
import { StatusBadge, ProjectFilter, filterArchives } from './Shared';

const MetaField = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-0.5">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-xs font-semibold text-slate-800 break-words">{value}</p>
    </div>
);

interface AuditProjectListProps {
    archives: ArchiveItem[];
    onSelect: (id: string) => void;
}

export const AuditProjectList: React.FC<AuditProjectListProps> = ({ archives, onSelect }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [showFilter, setShowFilter] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState<ProjectFilterCriteria>({});
    const [detailItem, setDetailItem] = useState<ArchiveItem | null>(null);

    const baseArchives = archives.filter(a => a.stage !== "REGISTER");
    const filteredArchives = filterArchives(baseArchives, filterCriteria)
        .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());

    const totalPages = Math.ceil(filteredArchives.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredArchives.slice(startIndex, startIndex + itemsPerPage);

    const getStageName = (stage: WorkflowStage) => {
        switch (stage) {
            case 'REGISTER': return '档案登记';
            case 'FIRST_REVIEW': return '窗口初审';
            case 'ACCEPTANCE_PRINT': return '验收意见打印';
            case 'SECOND_REVIEW': return '专家复审';
            case 'RECEIPT_PRINT': return '接收存证打印';
            case 'ARCHIVING': return '入库成功';
            case 'COMPLETED': return '档案入库';
            default: return stage;
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">

            {/* Filter Panel */}
            {showFilter && (
                <div className="px-4 pt-4 shrink-0">
                    <ProjectFilter 
                        onFilter={setCriteria => { setFilterCriteria(setCriteria); setCurrentPage(1); }} 
                        onReset={() => { setFilterCriteria({}); setCurrentPage(1); }}
                    />
                </div>
            )}

            {/* Table */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100/50 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#fcfdfe] text-slate-500 font-bold text-xs">
                            <tr>
                                <th className="p-4 w-12 text-center">审批号</th>
                                <th className="p-4">档案项目名称</th>
                                <th className="p-4 w-32">分管审核</th>
                                <th className="p-4">建设单位</th>
                                <th className="p-4 w-28">审核状态</th>
                                <th className="p-4 w-32">当前审核节点</th>
                                <th className="p-4 w-24 text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-4 text-center font-mono font-bold text-slate-500">
                                            {filteredArchives.length - (startIndex + index) + 1205}
                                        </td>
                                        <td className="p-4 font-bold text-slate-800 max-w-xs truncate" title={item.projectInfo.projectName}>
                                            {item.projectInfo.projectName}
                                        </td>
                                        <td className="p-4 font-semibold text-slate-600">{item.projectInfo.operator || '阮峰'}</td>
                                        <td className="p-4 text-slate-600 max-w-xs truncate" title={item.projectInfo.constructionUnit}>
                                            {item.projectInfo.constructionUnit}
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge stage={item.stage} />
                                        </td>
                                        <td className="p-4 text-slate-700 font-semibold">
                                            {getStageName(item.stage)}
                                        </td>
                                        <td className="p-4 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => setDetailItem(item)}
                                                    className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-600 text-[10px] font-bold px-2 py-1.5 bg-slate-50 rounded-lg hover:bg-emerald-50 transition-all cursor-pointer border border-slate-200 hover:border-emerald-200"
                                                    title="查看项目元数据"
                                                >
                                                    <Info size={11} /> 详情
                                                </button>
                                                <button
                                                    className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 text-[10px] font-bold px-2 py-1.5 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all cursor-pointer border border-amber-200 hover:border-amber-300"
                                                    title="退回上一审核节点"
                                                >
                                                    <Undo2 size={11} /> 撤回
                                                </button>
                                                <button
                                                    onClick={() => onSelect(item.id)}
                                                    className="inline-flex items-center gap-1 text-white bg-emerald-600 hover:bg-emerald-700 text-[10px] font-bold px-2 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs"
                                                >
                                                    <Edit3 size={11} /> 节点审核
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-slate-400 font-semibold text-xs">
                                        暂无满足当前核对标准的待审项目
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="bg-white p-4 flex items-center justify-end gap-3 text-xs text-slate-600 shrink-0 select-none">
                <span>总计 <strong>{filteredArchives.length}</strong> 条记录</span>
                <div className="flex items-center gap-1.5">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title="上一页"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <span className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg">{currentPage} / {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title="下一页"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Detail Modal */}
            {detailItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setDetailItem(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-slate-200" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                                <Info size={16} className="text-emerald-500" />
                                项目元数据
                            </h3>
                            <button onClick={() => setDetailItem(null)} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors" title="关闭">
                                <X size={16} className="text-slate-400" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <MetaField label="项目名称" value={detailItem.projectInfo.projectName} />
                                <MetaField label="项目编号" value={detailItem.projectInfo.projectCode} />
                                <MetaField label="施工许可证号" value={detailItem.projectInfo.permitNumber} />
                                <MetaField label="规划许可证号" value={detailItem.projectInfo.planningPermitNumber || '-'} />
                                <MetaField label="建设单位" value={detailItem.projectInfo.constructionUnit} />
                                <MetaField label="施工单位" value={detailItem.projectInfo.constructionCompany} />
                                <MetaField label="设计单位" value={detailItem.projectInfo.designUnit} />
                                <MetaField label="监理单位" value={detailItem.projectInfo.supervisorUnit} />
                                <MetaField label="项目地点" value={detailItem.projectInfo.location} />
                                <MetaField label="建筑面积" value={detailItem.projectInfo.totalArea ? `${detailItem.projectInfo.totalArea} ㎡` : '-'} />
                                <MetaField label="建筑数量" value={detailItem.projectInfo.buildingCount ? `${detailItem.projectInfo.buildingCount} 栋` : '-'} />
                                <MetaField label="总投资额" value={detailItem.projectInfo.totalCost ? `${detailItem.projectInfo.totalCost} 万元` : '-'} />
                                <MetaField label="档案登记号" value={detailItem.registrationNumber || '-'} />
                                <MetaField label="提交日期" value={detailItem.submissionDate} />
                                <MetaField label="当前节点" value={getStageName(detailItem.stage)} />
                                <MetaField label="审核状态" value={detailItem.stage} />
                            </div>
                        </div>
                        <div className="p-5 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => { setDetailItem(null); onSelect(detailItem.id); }}
                                className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                            >
                                进入节点审核
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
