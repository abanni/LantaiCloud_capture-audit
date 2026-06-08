import React, { useState } from 'react';
import { ArchiveItem, ProjectFilterCriteria } from './auditTypes';
import { ArchiveExplorer } from './ArchiveExplorer';
import { Filter, ChevronLeft, ChevronRight, Eye, Search } from 'lucide-react';
import { StatusBadge, ProjectFilter, filterArchives } from './Shared';

export const AuditProjectInfoView = ({ 
    archives 
}: { 
    archives: ArchiveItem[] 
}) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [showFilter, setShowFilter] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState<ProjectFilterCriteria>({});

    const registeredArchives = archives.filter(a => a.stage !== "REGISTER");
    const filteredList = filterArchives(registeredArchives, filterCriteria);

    const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredList.slice(startIndex, startIndex + itemsPerPage);

    const selectedArchive = archives.find(a => a.id === selectedId);

    if (selectedArchive) {
        return (
            <div className="h-full bg-white">
                <ArchiveExplorer
                    archive={selectedArchive}
                    readOnly={true} // Readonly mode
                    onBack={() => setSelectedId(null)}
                />
            </div>
        );
    }

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
                    <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#fcfdfe] text-slate-500 font-bold">
                            <tr>
                                <th className="p-4 w-16">序号</th>
                                <th className="p-4">项目名称</th>
                                <th className="p-4">建设单位</th>
                                <th className="p-4 w-28">分管审核</th>
                                <th className="p-4 w-28">审核状态</th>
                                <th className="p-4 w-24 text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-4 text-slate-500 font-bold">{startIndex + index + 1}</td>
                                        <td className="p-4 font-bold text-slate-800 max-w-xs truncate" title={item.projectInfo.projectName}>
                                            {item.projectInfo.projectName}
                                        </td>
                                        <td className="p-4 text-slate-600 max-w-xs truncate" title={item.projectInfo.constructionUnit}>
                                            {item.projectInfo.constructionUnit}
                                        </td>
                                        <td className="p-4 text-slate-600 font-medium">{item.projectInfo.projectManager || "-"}</td>
                                        <td className="p-4">
                                            <StatusBadge stage={item.stage} />
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => setSelectedId(item.id)}
                                                className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 text-xs font-bold px-3 py-1.5 bg-slate-100 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-slate-200/50 transition-all cursor-pointer"
                                            >
                                                <Eye size={13} /> 查看档案
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-450">
                                        暂时查阅不到相关的库藏归档项目案卷。
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="bg-white p-4 flex items-center justify-end gap-3 text-xs text-slate-650 shrink-0 select-none">
                <span>检索到 <strong>{filteredList.length}</strong> 卷库藏</span>
                <div className="flex items-center gap-1.5">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title="上一页"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <span className="px-3 py-1 bg-purple-600 text-white font-bold rounded-lg">{currentPage}</span>
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
        </div>
    );
};
