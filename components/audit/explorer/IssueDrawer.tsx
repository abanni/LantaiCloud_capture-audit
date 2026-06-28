import React from 'react';
import { X, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

interface ModificationIssue {
    id: string;
    nodeId: string;
    nodeName: string;
    reason: string;
    timestamp: string;
    source: 'MANUAL' | 'AI';
}

interface IssueDrawerProps {
    open: boolean;
    issues: ModificationIssue[];
    onRemove: (id: string) => void;
    onClose: () => void;
}

/**
 * IssueDrawer — Sidebar drawer listing all detected modification issues.
 * Extracted from ArchiveExplorer.tsx lines 728-778.
 */
export const IssueDrawer: React.FC<IssueDrawerProps> = ({ open, issues, onRemove, onClose }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/15 z-50 flex justify-end">
            <div className="w-[360px] bg-white h-full shadow-2xl animate-in slide-in-from-right duration-200 flex flex-col">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-slate-800 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={16} /> 发现的工程审定报错 ({issues.length})
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600" title="关闭">
                        <X size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 custom-scrollbar">
                    {issues.length === 0 ? (
                        <div className="text-center text-slate-400 mt-16">
                            <CheckCircle size={36} className="mx-auto mb-2 text-slate-300" />
                            <p className="text-xs">暂无未核减的文件疑漏。</p>
                        </div>
                    ) : (
                        issues.map((issue) => (
                            <div
                                key={issue.id}
                                className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative group"
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <span
                                        className="text-[11px] font-bold text-slate-700 truncate max-w-[200px] block"
                                        title={issue.nodeName}
                                    >
                                        {issue.nodeName}
                                    </span>
                                    <span className="text-[9px] text-slate-400">
                                        {issue.timestamp}
                                    </span>
                                </div>
                                <p className="text-xs text-red-650 leading-relaxed font-medium">
                                    {issue.reason}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                            issue.source === 'AI'
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                : 'bg-orange-50 text-orange-600 border border-orange-100'
                                        }`}
                                    >
                                        {issue.source === 'AI' ? '系统智审' : '人工复检'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => onRemove(issue.id)}
                                    className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="删除问题"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-4 border-t border-slate-200 bg-white">
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 cursor-pointer"
                    >
                        关闭核减面板
                    </button>
                </div>
            </div>
        </div>
    );
};
