
import React, { useState } from 'react';
import { 
    X, Search, ChevronDown, ChevronRight, Folder
} from 'lucide-react';
import { INITIAL_CLOUD_FILES } from '../../../data/mockCloudFiles';
import { getFileIcon } from '../../common/fileUtils';

interface ArchiveSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedIds: string[]) => void;
    currentPath: string;
    title?: string;
    rootNodeName?: string;
    confirmText?: string;
}

const ArchiveSelectionModal: React.FC<ArchiveSelectionModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    currentPath,
    title = "选择文件",
    rootNodeName = "云盘",
    confirmText = "确认归档"
}) => {
    const [filterEmpty, setFilterEmpty] = useState(true);
    const [filterSelected, setFilterSelected] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isExpanded, setIsExpanded] = useState(true);

    if (!isOpen) return null;

    // Filter Files strictly by Type (PDF/OFD/Folder)
    const filteredFiles = INITIAL_CLOUD_FILES.filter(file => {
        // Strict Type Filter
        if (file.type !== 'folder' && file.type !== 'pdf' && file.type !== 'ofd') return false;
        // Search Filter
        if (searchText && !file.name.toLowerCase().includes(searchText.toLowerCase())) return false;
        return true;
    });

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleConfirm = () => {
        onConfirm(Array.from(selectedIds));
        setSelectedIds(new Set());
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredFiles.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filteredFiles.map(f => f.id)));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg w-[800px] h-[600px] flex flex-col shadow-xl animate-in zoom-in-95">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
                    <X className="w-5 h-5 cursor-pointer text-slate-400 hover:text-slate-600" onClick={onClose} />
                </div>
                <div className="px-6 py-3 bg-slate-50 text-sm text-slate-500 border-b border-slate-200 break-words">{currentPath}</div>
                <div className="px-6 py-3 space-y-3 border-b border-slate-100">
                    <div className="flex items-center gap-6 text-sm text-slate-600">
                         <label className="flex items-center cursor-pointer hover:text-primary select-none"><input type="checkbox" className="rounded text-primary focus:ring-primary mr-2" checked={filterEmpty} onChange={e => setFilterEmpty(e.target.checked)}/>过滤空文件夹</label>
                         <label className="flex items-center cursor-pointer hover:text-primary select-none"><input type="checkbox" className="rounded text-primary focus:ring-primary mr-2" checked={filterSelected} onChange={e => setFilterSelected(e.target.checked)}/>过滤已选</label>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded text-sm focus:ring-primary focus:border-primary" placeholder="请输入筛选内容" value={searchText} onChange={e => setSearchText(e.target.value)}/>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="mb-1">
                        <div className="flex items-center py-1.5 px-2 hover:bg-slate-50 rounded cursor-pointer select-none text-sm text-slate-700 font-medium" onClick={() => setIsExpanded(!isExpanded)}>
                            <span className="mr-2 text-slate-400">{isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</span>
                            <input type="checkbox" className="mr-3 rounded text-primary focus:ring-primary cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleSelectAll(); }} checked={filteredFiles.length > 0 && selectedIds.size === filteredFiles.length} readOnly title="全选"/>
                            <Folder className="w-5 h-5 text-slate-400 mr-2" />
                            <span>{rootNodeName} ({filteredFiles.length})</span>
                        </div>
                    </div>
                    {isExpanded && (
                        <div className="pl-6 ml-3 border-l border-slate-200">
                             {filteredFiles.map(file => (
                                <div key={file.id} className="flex items-center py-2 px-2 hover:bg-blue-50 rounded cursor-pointer border border-transparent hover:border-blue-100 group transition-colors select-none" onClick={() => toggleSelection(file.id)}>
                                    <input type="checkbox" className="mr-3 rounded text-primary focus:ring-primary cursor-pointer pointer-events-none" checked={selectedIds.has(file.id)} readOnly title={file.name}/>
                                    {getFileIcon(file.type, "w-4 h-4 mr-2", file.isDoubleLayer)}
                                    <span className="text-sm text-slate-700 flex-1 truncate pr-4">{file.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 border-t flex justify-end gap-3 bg-slate-50">
                    <div className="mr-auto text-xs text-slate-500 flex items-center">已选择 <span className="font-bold text-primary mx-1">{selectedIds.size}</span> 个文件</div>
                    <button onClick={onClose} className="px-5 py-2 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-100 transition-colors">取消</button>
                    <button onClick={handleConfirm} className="px-5 py-2 bg-primary text-white rounded text-sm hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={selectedIds.size === 0}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

export default ArchiveSelectionModal;
