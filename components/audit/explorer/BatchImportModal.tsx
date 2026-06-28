import React from 'react';
import { X, Upload, FileText, AlertTriangle } from 'lucide-react';

interface BatchImportItem {
    fileName: string;
    status: 'pending' | 'valid' | 'duplicate' | 'error';
    message?: string;
}

interface BatchImportModalProps {
    open: boolean;
    onClose: () => void;
    onImport: (files: string[]) => void;
    items?: BatchImportItem[];
}

/**
 * BatchImportModal — Modal for bulk importing archive files/nodes.
 * Extracted as a standalone component from ArchiveExplorer.tsx.
 * The original file did not contain this modal inline; this is a
 * clean extraction point ready for integration.
 */
export const BatchImportModal: React.FC<BatchImportModalProps> = ({
    open,
    onClose,
    onImport,
    items = [],
}) => {
    const [dragOver, setDragOver] = React.useState(false);
    const [batchNames, setBatchNames] = React.useState('');

    if (!open) return null;

    const handlePasteImport = () => {
        const names = batchNames
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);
        if (names.length === 0) return;
        onImport(names);
        setBatchNames('');
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-[480px] max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <Upload size={16} className="text-emerald-500" /> 批量导入节点
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        title="关闭"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Drag zone or text area */}
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                            const files = Array.from(e.dataTransfer.files);
                            const names = files.map((f) => f.name);
                            if (names.length > 0) {
                                onImport(names);
                            }
                        }}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                            dragOver
                                ? 'border-emerald-400 bg-emerald-50'
                                : 'border-slate-200 bg-slate-50'
                        }`}
                    >
                        <Upload size={28} className="mx-auto text-slate-400 mb-2" />
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                            拖拽文件到此处，或手动输入名称
                        </p>
                        <p className="text-[10px] text-slate-400">
                            支持批量粘贴，每行一个文件/文件夹名称
                        </p>
                    </div>

                    {/* Text input for batch names */}
                    <textarea
                        value={batchNames}
                        onChange={(e) => setBatchNames(e.target.value)}
                        placeholder={`文件立项申请.pdf\n施工图会审记录.pdf\n竣工验收报告.pdf`}
                        rows={5}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-none resize-none text-slate-800"
                    />

                    {/* Preview list */}
                    {items.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                导入预览 ({items.length})
                            </p>
                            <div className="max-h-[180px] overflow-y-auto space-y-1">
                                {items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                                    >
                                        <FileText size={12} className="text-slate-400 shrink-0" />
                                        <span className="flex-1 truncate text-slate-700">
                                            {item.fileName}
                                        </span>
                                        {item.status === 'valid' && (
                                            <span className="text-[9px] text-emerald-600 font-bold px-1.5 py-0.5 bg-emerald-50 rounded">
                                                有效
                                            </span>
                                        )}
                                        {item.status === 'duplicate' && (
                                            <span className="text-[9px] text-orange-600 font-bold px-1.5 py-0.5 bg-orange-50 rounded flex items-center gap-0.5">
                                                <AlertTriangle size={10} /> 重复
                                            </span>
                                        )}
                                        {item.status === 'error' && (
                                            <span className="text-[9px] text-red-600 font-bold px-1.5 py-0.5 bg-red-50 rounded">
                                                {item.message || '错误'}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 flex justify-end gap-2 text-xs">
                    <button
                        onClick={onClose}
                        className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold"
                    >
                        取消
                    </button>
                    <button
                        onClick={handlePasteImport}
                        disabled={!batchNames.trim()}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed shadow shadow-emerald-100"
                    >
                        确认导入
                    </button>
                </div>
            </div>
        </div>
    );
};
