import React, { useState } from 'react';
import { 
    ChevronDown, 
    ChevronRight, 
    Folder, 
    FileText, 
    CheckCircle, 
    XCircle, 
    Lock, 
    Search, 
    RotateCcw 
} from 'lucide-react';
import { ArchiveNode, NodeStatus, WorkflowStage, ProjectFilterCriteria, ArchiveItem } from './auditTypes';

export const StatusBadge = ({ stage }: { stage: WorkflowStage }) => {
    const map: Record<WorkflowStage, { label: string, color: string }> = {
        "REGISTER": { label: "待登记", color: "bg-slate-100 text-slate-600 border-slate-200" },
        "FIRST_REVIEW": { label: "初审中", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
        "ACCEPTANCE_PRINT": { label: "待打意见", color: "bg-yellow-100 text-yellow-700 border-yellow-250" },
        "SECOND_REVIEW": { label: "复审中", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
        "RECEIPT_PRINT": { label: "待打凭证", color: "bg-orange-100 text-orange-700 border-orange-200" },
        "ARCHIVING": { label: "待入库", color: "bg-purple-100 text-purple-700 border-purple-200" },
        "COMPLETED": { label: "已归档", color: "bg-emerald-100 text-emerald-700 border-emerald-200" }
    };

    const s = map[stage] || { label: stage, color: "bg-slate-100 text-slate-700 border-slate-200" };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.color}`}>
            {s.label}
        </span>
    );
};

export const TreeNode: React.FC<{
    node: ArchiveNode;
    selectedId?: string;
    onSelect?: (node: ArchiveNode) => void;
    onContextMenu?: (e: React.MouseEvent, node: ArchiveNode) => void;
    depth?: number;
    readOnly?: boolean;
    expandTrigger?: { action: 'EXPAND' | 'COLLAPSE', targetId?: string }; 
    defaultExpanded?: boolean;
    hasMemo?: boolean;
    memoContent?: string;
}> = ({ 
    node, 
    selectedId, 
    onSelect, 
    onContextMenu, 
    depth = 0, 
    readOnly = false, 
    expandTrigger, 
    defaultExpanded = true, 
    hasMemo, 
    memoContent 
}) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    React.useEffect(() => {
        if (expandTrigger) {
            if (expandTrigger.targetId === undefined) {
                setExpanded(expandTrigger.action === 'EXPAND');
            } else if (expandTrigger.targetId === node.id) {
                setExpanded(expandTrigger.action === 'EXPAND');
            }
        }
    }, [expandTrigger, node.id]);

    const isSelected = selectedId === node.id;
    const hasChildren = node.children && node.children.length > 0;

    const childExpandTrigger = React.useMemo(() => {
        if (!expandTrigger) return undefined;
        if (expandTrigger.targetId === undefined) return expandTrigger; 
        if (expandTrigger.targetId === node.id) {
            return { action: expandTrigger.action };
        }
        return expandTrigger; 
    }, [expandTrigger, node.id]);

    const getFileCount = (n: ArchiveNode): number => {
        if (n.type === "FILE") return 1;
        return n.children ? n.children.reduce((acc, child) => acc + getFileCount(child), 0) : 0;
    };
    const fileCount = React.useMemo(() => getFileCount(node), [node]);

    const getIconColor = () => {
        if (isSelected) return 'text-emerald-600'; 
        if (node.type === "FILE") {
            const isPdfOrOfd = node.name.toLowerCase().endsWith('.pdf') || node.name.toLowerCase().endsWith('.ofd');
            if (isPdfOrOfd) {
                if (node.layerType === 'dual') return 'text-sky-500';
                if (node.layerType === 'single') return 'text-orange-500';
            }
        }
        return 'text-slate-500';
    };

    return (
        <div className="select-none">
            <div
                onClick={() => {
                    if (onSelect) onSelect(node);
                    if (hasChildren) setExpanded(!expanded);
                }}
                onContextMenu={(e) => {
                    if (onContextMenu) onContextMenu(e, node);
                }}
                className={`
                    flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors text-sm relative group
                    ${isSelected ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-100 text-slate-705'}
                `}
                style={{ paddingLeft: depth * 14 + 8 }}
            >
                <div className="w-4 h-4 flex items-center justify-center text-slate-400">
                    {hasChildren && (
                        expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    )}
                </div>

                {node.type === "FOLDER" ? (
                    <Folder size={16} className={`shrink-0 ${isSelected ? 'text-emerald-500 fill-emerald-50' : 'text-slate-400'}`} />
                ) : (
                    <FileText size={16} className={`shrink-0 ${getIconColor()}`} />
                )}

                <span className="truncate flex-1 mr-2 text-xs">
                    {node.name}
                    {node.type === "FOLDER" && <span className="text-[11px] text-slate-400 ml-1">({fileCount})</span>}
                </span>

                {hasMemo && (
                    <div className="flex-shrink-0 w-4 h-4 bg-red-100 text-red-600 rounded flex items-center justify-center text-[10px] font-bold border border-red-200 mr-1 shadow-sm" title={memoContent}>
                        💡
                    </div>
                )}

                {!readOnly && (
                    <div className="flex items-center gap-1">
                        {node.status === "PASSED" && <CheckCircle size={12} className="text-emerald-500" />}
                        {node.status === "FAILED" && <XCircle size={12} className="text-red-500" />}
                        {node.status === "LOCKED" && <Lock size={12} className="text-slate-400" />}
                    </div>
                )}
            </div>

            {hasChildren && expanded && (
                <div>
                    {(node.children ?? []).map(child => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            selectedId={selectedId}
                            onSelect={onSelect}
                            onContextMenu={onContextMenu}
                            depth={depth + 1}
                            readOnly={readOnly}
                            expandTrigger={childExpandTrigger}
                            hasMemo={hasMemo}
                            memoContent={memoContent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const TreeNodeWithMemos: React.FC<{
    node: ArchiveNode;
    selectedId?: string;
    onSelect?: (node: ArchiveNode) => void;
    onContextMenu?: (e: React.MouseEvent, node: ArchiveNode) => void;
    depth?: number;
    readOnly?: boolean;
    expandTrigger?: { action: 'EXPAND' | 'COLLAPSE', targetId?: string };
    memos: Record<string, string>;
}> = ({ 
    node, 
    selectedId, 
    onSelect, 
    onContextMenu, 
    depth = 0, 
    readOnly = false, 
    expandTrigger, 
    memos 
}) => {
    const [expanded, setExpanded] = useState(true);

    React.useEffect(() => {
        if (expandTrigger) {
            if (expandTrigger.targetId === undefined) {
                setExpanded(expandTrigger.action === 'EXPAND');
            } else if (expandTrigger.targetId === node.id) {
                setExpanded(expandTrigger.action === 'EXPAND');
            }
        }
    }, [expandTrigger, node.id]);

    const isSelected = selectedId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const memo = memos[node.id];

    const childExpandTrigger = React.useMemo(() => {
        if (!expandTrigger) return undefined;
        if (expandTrigger.targetId === undefined) return expandTrigger; 
        if (expandTrigger.targetId === node.id) {
            return { action: expandTrigger.action };
        }
        return expandTrigger; 
    }, [expandTrigger, node.id]);

    const getFileCount = (n: ArchiveNode): number => {
        if (n.type === "FILE") return 1;
        return n.children ? n.children.reduce((acc, child) => acc + getFileCount(child), 0) : 0;
    };
    const fileCount = React.useMemo(() => getFileCount(node), [node]);

    const getIconColor = () => {
        if (isSelected) return 'text-emerald-600'; 
        if (node.type === "FILE") {
            const isPdfOrOfd = node.name.toLowerCase().endsWith('.pdf') || node.name.toLowerCase().endsWith('.ofd');
            if (isPdfOrOfd) {
                if (node.layerType === 'dual') return 'text-emerald-500'; // Dual layer -> Emerald
                if (node.layerType === 'single') return 'text-orange-500'; // Single layer -> Orange
            }
        }
        return 'text-slate-500';
    };

    return (
        <div className="select-none">
            <div
                onClick={() => {
                    if (onSelect) onSelect(node);
                    if (hasChildren) setExpanded(!expanded);
                }}
                onContextMenu={(e) => {
                    if (onContextMenu) onContextMenu(e, node);
                }}
                className={`
                    flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors text-xs relative
                    ${isSelected ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'hover:bg-slate-100 text-slate-700'}
                `}
                style={{ paddingLeft: depth * 14 + 8 }}
            >
                <div className="w-4 h-4 flex items-center justify-center text-slate-400">
                    {hasChildren && (
                        expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    )}
                </div>

                {node.type === "FOLDER" ? (
                    <Folder size={16} className={`shrink-0 ${isSelected ? 'text-emerald-600 fill-emerald-50' : 'text-slate-400'}`} />
                ) : (
                    <FileText size={16} className={`shrink-0 ${getIconColor()}`} />
                )}

                <span className="truncate flex-1 mr-2">
                    {node.name}
                    {node.type === "FOLDER" && <span className="text-[10px] text-slate-400 ml-1">({fileCount})</span>}
                </span>

                {memo && (
                    <div className="flex-shrink-0 w-5 h-5 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-[10px] font-bold border border-yellow-200 mr-1 shadow-sm" title={memo}>
                        ✍️
                    </div>
                )}

                {!readOnly && (
                    <div className="flex items-center gap-1">
                        {node.status === "PASSED" && <CheckCircle size={12} className="text-emerald-500" />}
                        {node.status === "FAILED" && <XCircle size={12} className="text-red-500" />}
                        {node.status === "LOCKED" && <Lock size={12} className="text-slate-400" />}
                    </div>
                )}
            </div>

            {hasChildren && expanded && (
                <div>
                    {(node.children ?? []).map(child => (
                        <TreeNodeWithMemos
                            key={child.id}
                            node={child}
                            selectedId={selectedId}
                            onSelect={onSelect}
                            onContextMenu={onContextMenu}
                            depth={depth + 1}
                            readOnly={readOnly}
                            expandTrigger={childExpandTrigger}
                            memos={memos}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const InfoRow = ({ label, value }: { label: string, value?: string | number | null }) => (
    <div className="flex items-start gap-4 py-1.5 border-b border-slate-100 last:border-b-0">
        <span className="text-xs text-slate-450 w-24 shrink-0 text-right font-medium">{label}</span>
        <span className="text-xs font-semibold text-slate-850 break-all flex-1">{value != null ? String(value) : "/"}</span>
    </div>
);

export const StatBox = ({ label, value }: { label: string, value?: number }) => (
    <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center shadow-sm">
        <div className="text-lg font-bold text-slate-800">{value || 0}</div>
        <div className="text-[10px] text-slate-500 font-semibold uppercase">{label}</div>
    </div>
);

export const TimelineItem = ({ 
    title, 
    date, 
    desc, 
    status 
}: { 
    title: string, 
    date: string, 
    desc: string, 
    status: "PENDING" | "COMPLETED" | "CURRENT" 
}) => (
    <div className="relative pl-6 pb-6 border-l border-slate-200 last:border-0 last:pb-0">
        <div className={`absolute -left-[5.5px] top-1 w-2.5 h-2.5 rounded-full border-2 
            ${status === "COMPLETED" ? "border-emerald-500 bg-emerald-500" : status === "CURRENT" ? "border-emerald-500 bg-white" : "border-slate-200 bg-white"}`}
        ></div>
        <div>
            <div className="flex items-center justify-between mb-1">
                <h4 className={`text-xs font-bold ${status === "COMPLETED" || status === "CURRENT" ? "text-slate-800" : "text-slate-400"}`}>{title}</h4>
                <span className="text-[10px] text-slate-400">{date !== "-" ? date.split(' ')[0] : ''}</span>
            </div>
            {desc && <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">{desc}</p>}
        </div>
    </div>
);

interface ProjectFilterProps {
    onFilter: (criteria: ProjectFilterCriteria) => void;
    onReset: () => void;
    className?: string;
}

export const ProjectFilter = ({ onFilter, onReset, className }: ProjectFilterProps) => {
    const [criteria, setCriteria] = useState<ProjectFilterCriteria>({});

    const handleChange = (field: keyof ProjectFilterCriteria, value: string) => {
        setCriteria(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onFilter(criteria);
    };

    const handleReset = () => {
        setCriteria({});
        onReset();
    };

    return (
        <div className={`p-4 bg-white border border-slate-200 rounded-xl shadow-sm ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                
                {/* Field matches */}
                <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500 font-semibold whitespace-nowrap w-20 text-right">项目名称</label>
                    <input 
                        type="text" 
                        className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-slate-800" 
                        placeholder="请输入项目名称"
                        value={criteria.projectName || ''}
                        onChange={(e) => handleChange('projectName', e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500 font-semibold whitespace-nowrap w-20 text-right">许可证号</label>
                    <input 
                        type="text" 
                        className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-slate-800" 
                        placeholder="请输入施工许可证"
                        value={criteria.permitNumber || ''}
                        onChange={(e) => handleChange('permitNumber', e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500 font-semibold whitespace-nowrap w-20 text-right">质监注册号</label>
                    <input 
                        type="text" 
                        className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-slate-800" 
                        placeholder="请输入质监号"
                        value={criteria.qualityNumber || ''}
                        onChange={(e) => handleChange('qualityNumber', e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500 font-semibold whitespace-nowrap w-20 text-right">建设主体</label>
                    <input 
                        type="text" 
                        className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-slate-800" 
                        placeholder="建设单位关键字"
                        value={criteria.constructionUnit || ''}
                        onChange={(e) => handleChange('constructionUnit', e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-3">
                <button 
                    onClick={handleSubmit}
                    className="flex items-center gap-1.5 px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                    <Search size={14} /> 搜索
                </button>
                <button 
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                    <RotateCcw size={14} /> 重置
                </button>
            </div>
        </div>
    );
};

export const filterArchives = (archives: ArchiveItem[], criteria: ProjectFilterCriteria): ArchiveItem[] => {
    return archives.filter(item => {
        const info = item.projectInfo;
        
        if (criteria.projectName && !info.projectName.toLowerCase().includes(criteria.projectName.toLowerCase())) return false;
        if (criteria.permitNumber && !info.permitNumber.toLowerCase().includes(criteria.permitNumber.toLowerCase())) return false;
        if (criteria.qualityNumber && !info.qualityNumber.toLowerCase().includes(criteria.qualityNumber.toLowerCase())) return false;
        if (criteria.location && !info.location.toLowerCase().includes(criteria.location.toLowerCase())) return false;
        if (criteria.constructionUnit && !info.constructionUnit.toLowerCase().includes(criteria.constructionUnit.toLowerCase())) return false;
        if (criteria.constructionCompany && !info.constructionCompany.toLowerCase().includes(criteria.constructionCompany.toLowerCase())) return false;
        
        return true;
    });
};
