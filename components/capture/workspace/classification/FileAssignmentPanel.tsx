import React, { useState, useMemo } from 'react';
import {
    Search, X, Cloud, Plus, ArrowUpDown, CornerUpRight, Trash2,
    FolderOpen, Eye
} from 'lucide-react';
import { ArchiveProjectData } from '../../../../types';
import { TreeItem } from './constants';
import { INITIAL_CLOUD_FILES } from '../../../../data/mockCloudFiles';
import { getFileIcon } from '../../../common/fileUtils';
import ArchiveSelectionModal from '../ArchiveSelectionModal';

interface FileEntry {
    id: string;
    code: string;
    name: string;
    type: string;
    sortCode: number;
    owner: string;
    status: string;
    startTime: string;
    endTime: string;
    isDoubleLayer: boolean;
    folderId: string;
}

interface FileAssignmentPanelProps {
    archiveData: ArchiveProjectData;
    selectedNode: string;
    treeData: TreeItem[];
    onFileCountsChange: (counts: Record<string, number>) => void;
}

const FileAssignmentPanel: React.FC<FileAssignmentPanelProps> = ({
    archiveData,
    selectedNode,
    treeData,
    onFileCountsChange,
}) => {
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [fileSearchTerm, setFileSearchTerm] = useState('');
    const [filedFiles, setFiledFiles] = useState<FileEntry[]>([
        { 
            id: 'f1', 
            code: '', 
            name: '工程设计变更汇总表', 
            type: 'pdf', 
            sortCode: 1, 
            owner: '徐旋旋',
            status: 'ok',
            startTime: '2024-03-01',
            endTime: '2024-03-01',
            isDoubleLayer: true,
            folderId: `${archiveData.units[0]?.id}_sub_A_desc`
        },
        { 
            id: 'f2', 
            code: '', 
            name: '工程技术核定单汇总表', 
            type: 'pdf', 
            sortCode: 2, 
            owner: '徐旋旋',
            status: 'ok',
            startTime: '2024-03-02',
            endTime: '2024-03-02',
            isDoubleLayer: false,
            folderId: `${archiveData.units[0]?.id}_sub_A_desc` 
        },
    ]);

    // Compute breadcrumb from selectedNode
    const getNodePath = (id: string, items: TreeItem[]): { name: string, path: string[] } | null => {
        for (const item of items) {
            if (item.id === id) return { name: item.label, path: [item.label] };
            if (item.children) {
                const result = getNodePath(id, item.children);
                if (result) return { name: result.name, path: [item.label, ...result.path] };
            }
        }
        return null;
    };

    const nodeInfo = getNodePath(selectedNode, treeData) || { name: '未知', path: [] };
    const breadcrumbString = `归档 / ${nodeInfo.path.join(' / ')}`;

    const currentViewFiles = filedFiles.filter(f => {
        const matchesFolder = f.folderId === selectedNode;
        const matchesSearch = !fileSearchTerm || 
            f.name.toLowerCase().includes(fileSearchTerm.toLowerCase()) || 
            (f.code && f.code.toLowerCase().includes(fileSearchTerm.toLowerCase()));
        return matchesFolder && matchesSearch;
    });

    // Compute file counts for all nodes and notify parent
    const computeFileCounts = (items: TreeItem[]): Record<string, number> => {
        const counts: Record<string, number> = {};
        const countFiles = (node: TreeItem): number => {
            let count = 0;
            if (node.type === 'folder') {
                count = filedFiles.filter(f => f.folderId === node.id).length;
            } else if (node.children) {
                node.children.forEach(child => { count += countFiles(child); });
            }
            counts[node.id] = count;
            return count;
        };
        items.forEach(node => countFiles(node));
        return counts;
    };

    // Update file counts whenever filedFiles or treeData changes
    const fileCounts = useMemo(() => computeFileCounts(treeData), [treeData, filedFiles]);
    
    // Notify parent of counts on every render
    const prevCountsRef = React.useRef<string>('');
    const countsKey = JSON.stringify(fileCounts);
    if (countsKey !== prevCountsRef.current) {
        prevCountsRef.current = countsKey;
        // Use setTimeout to avoid setState during render
        setTimeout(() => onFileCountsChange(fileCounts), 0);
    }

    const handleArchiveFiles = (selectedIds: string[]) => {
        const selectedFiles = INITIAL_CLOUD_FILES.filter(f => selectedIds.includes(f.id));
        const newFiledFiles: FileEntry[] = selectedFiles.map(f => ({
            id: `filed_${Date.now()}_${f.id}`,
            code: '',
            name: f.name.split('.')[0],
            type: f.type,
            sortCode: filedFiles.filter(ff => ff.folderId === selectedNode).length + 1,
            owner: '我',
            status: 'new',
            startTime: f.date,
            endTime: f.date,
            isDoubleLayer: f.isDoubleLayer,
            folderId: selectedNode 
        }));
        setFiledFiles([...filedFiles, ...newFiledFiles]);
        setIsArchiveModalOpen(false);
    };

    const handleUpdateFile = (id: string, field: string, value: any) => {
        setFiledFiles(prev => prev.map(f => {
            if (f.id === id) return { ...f, [field]: value };
            return f;
        }));
    };

    return (
        <div className="flex-1 flex flex-col min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-slate-500 mb-4 px-2">
                <span className="text-primary cursor-pointer hover:underline">归档</span>
                {nodeInfo.path.map((segment, idx) => (
                    <React.Fragment key={idx}>
                        <span className="mx-2 text-slate-300">/</span>
                        <span className={idx === nodeInfo.path.length - 1 ? 'text-slate-800' : 'cursor-pointer hover:text-primary'}>
                            {segment}
                        </span>
                    </React.Fragment>
                ))}
            </div>

            {/* File Panel */}
            <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsArchiveModalOpen(true)}
                            className="flex items-center px-4 py-1.5 bg-primary text-white border border-primary rounded text-sm hover:bg-primary-hover transition-colors shadow-sm"
                        >
                            <Cloud className="w-4 h-4 mr-1.5" /> 开始归档
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                        <button className="flex items-center px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-sm hover:bg-blue-100 transition-colors">
                            <Plus className="w-4 h-4 mr-1.5" /> 新增文件夹
                        </button>
                        <button className="flex items-center px-4 py-1.5 bg-white text-slate-600 border border-slate-200 rounded text-sm hover:bg-slate-50 transition-colors">
                            <ArrowUpDown className="w-4 h-4 mr-1.5" /> 更新排序
                        </button>
                        <button className="flex items-center px-4 py-1.5 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded text-sm hover:bg-yellow-100 transition-colors">
                            <CornerUpRight className="w-4 h-4 mr-1.5" /> 移动
                        </button>
                        <button className="flex items-center px-4 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded text-sm hover:bg-red-100 transition-colors">
                            <Trash2 className="w-4 h-4 mr-1.5" /> 删除
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            className="pl-9 pr-8 py-1.5 border border-slate-200 rounded text-sm focus:ring-primary focus:border-primary w-64 transition-all"
                            placeholder="搜索文件名 / 文图号..."
                            value={fileSearchTerm}
                            onChange={(e) => setFileSearchTerm(e.target.value)}
                        />
                        {fileSearchTerm && (
                            <X 
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600"
                                onClick={() => setFileSearchTerm('')}
                            />
                        )}
                    </div>
                </div>
                
                {/* File Table */}
                <div className="flex-1 overflow-y-auto bg-white">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-[#f5f7fa] sticky top-0 z-10 text-slate-500 text-xs font-bold">
                            <tr>
                                <th className="px-4 py-3 w-10 text-center border-b border-slate-200">
                                    <input type="checkbox" className="rounded border-slate-200 text-primary focus:ring-primary" title="全选" />
                                </th>
                                <th className="px-4 py-3 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center">
                                        文件题名 <ArrowUpDown className="w-3 h-3 ml-1 text-slate-400" />
                                    </div>
                                </th>
                                <th className="px-4 py-3 border-b border-slate-200 w-32 cursor-pointer hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center">
                                        文图号 <ArrowUpDown className="w-3 h-3 ml-1 text-slate-400" />
                                    </div>
                                </th>
                                <th className="px-4 py-3 border-b border-slate-200 w-32">形成起始时间</th>
                                <th className="px-4 py-3 border-b border-slate-200 w-32">形成截止时间</th>
                                <th className="px-4 py-3 border-b border-slate-200 w-24 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center justify-center">
                                        排序码 <ArrowUpDown className="w-3 h-3 ml-1 text-slate-400" />
                                    </div>
                                </th>
                                <th className="px-4 py-3 border-b border-slate-200 w-24">所有者</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {currentViewFiles.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-slate-400">
                                        <div className="flex flex-col items-center">
                                            {fileSearchTerm ? (
                                                <>
                                                    <Search className="w-12 h-12 text-slate-200 mb-2" />
                                                    <p>未找到匹配 "{fileSearchTerm}" 的文件</p>
                                                </>
                                            ) : (
                                                <>
                                                    <FolderOpen className="w-12 h-12 text-slate-200 mb-2" />
                                                    <p>暂无文件，请点击"开始归档"从云盘选择</p>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                currentViewFiles.map((file, idx) => (
                                    <tr key={file.id} className="hover:bg-blue-50 group transition-colors">
                                        <td className="px-4 py-3 text-center border-b border-slate-100">
                                            <input type="checkbox" className="rounded border-slate-200 text-primary focus:ring-primary" title={file.name} />
                                        </td>
                                        <td className="px-4 py-3 border-b border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <Eye className="w-4 h-4 text-slate-400 shrink-0 cursor-pointer hover:text-primary" />
                                                {getFileIcon(file.type, "w-4 h-4 shrink-0", file.isDoubleLayer)}
                                                <input 
                                                    type="text" 
                                                    className="flex-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-primary focus:bg-white rounded px-2 py-1 text-slate-700 font-medium w-full text-sm"
                                                    value={file.name}
                                                    onChange={(e) => handleUpdateFile(file.id, 'name', e.target.value)}
                                                    title="文件题名"
                                                    placeholder="输入文件题名"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-b border-slate-100">
                                            <input 
                                                type="text" 
                                                className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-primary focus:bg-white rounded px-2 py-1 text-slate-500 text-sm"
                                                value={file.code}
                                                placeholder="无"
                                                onChange={(e) => handleUpdateFile(file.id, 'code', e.target.value)}
                                                title="文图号"
                                            />
                                        </td>
                                        <td className="px-4 py-3 border-b border-slate-100">
                                            <input 
                                                type="date" 
                                                className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-primary focus:bg-white rounded px-1 py-1 text-slate-500 text-sm"
                                                value={file.startTime}
                                                onChange={(e) => handleUpdateFile(file.id, 'startTime', e.target.value)}
                                                title="起始时间"
                                            />
                                        </td>
                                        <td className="px-4 py-3 border-b border-slate-100">
                                            <input 
                                                type="date" 
                                                className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-primary focus:bg-white rounded px-1 py-1 text-slate-500 text-sm"
                                                value={file.endTime}
                                                onChange={(e) => handleUpdateFile(file.id, 'endTime', e.target.value)}
                                                title="截止时间"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-600 border-b border-slate-100">{file.sortCode}</td>
                                        <td className="px-4 py-3 text-slate-600 border-b border-slate-100">{file.owner}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Archive Selection Modal */}
            <ArchiveSelectionModal 
                isOpen={isArchiveModalOpen}
                onClose={() => setIsArchiveModalOpen(false)}
                onConfirm={handleArchiveFiles}
                currentPath={breadcrumbString}
            />
        </div>
    );
};

export { FileAssignmentPanel };
export type { FileAssignmentPanelProps, FileEntry };
