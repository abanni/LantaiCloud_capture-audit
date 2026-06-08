import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, X, ArrowUpDown, Eye, FolderOpen, BookOpen, 
    Loader2, Play, Settings, Plus, CornerUpRight, Trash2, Printer,
    RotateCw
} from 'lucide-react';
import { ArchiveLevel, ArchiveProjectData, ArchiveVolume, ArchiveEngineering, ArchiveFile } from '../../../../types';
import { getFileIcon } from '../../../common/fileUtils';
import ArchiveSelectionModal from '../ArchiveSelectionModal';
import { INITIAL_CLOUD_FILES } from '../../../../data/mockCloudFiles';

interface VolumeFilePanelProps {
    data: ArchiveProjectData;
    selectedId: string;
    selectedType: ArchiveLevel;
    selectedObject: ArchiveProjectData | ArchiveEngineering | ArchiveVolume | null;
    onUpdateFiles: (volId: string, files: any[]) => void;
    onEditMetadata: (type?: ArchiveLevel) => void;
    onAddVolume: (unitId: string, title: string) => void;
}

const VolumeFilePanel: React.FC<VolumeFilePanelProps> = ({ 
    data, selectedId, selectedType, selectedObject, onUpdateFiles, onEditMetadata, onAddVolume
}) => {
    const [fileSearchTerm, setFileSearchTerm] = useState('');
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [previewFile, setPreviewFile] = useState<any | null>(null);
    const [isCompiling, setIsCompiling] = useState(false);
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);

    // Add Volume Modal State
    const [isAddingVolume, setIsAddingVolume] = useState(false);
    const [newVolumeName, setNewVolumeName] = useState('');
    const [targetUnitId, setTargetUnitId] = useState<string | null>(null);

    // Clear file selection when changing tree selection
    useEffect(() => {
        setSelectedFileId(null);
    }, [selectedId, selectedType]);

    // Get Breadcrumbs
    const breadcrumbs = useMemo(() => {
        const paths = [data.name];
        if (selectedType === 'engineering' || selectedType === 'volume') {
            const unit = data.units.find(u => u.id === selectedId || u.volumes.some(v => v.id === selectedId));
            if (unit) {
                paths.push(unit.name);
                if (selectedType === 'volume') {
                    const vol = unit.volumes.find(v => v.id === selectedId);
                    if (vol) paths.push(vol.title);
                }
            }
        }
        return paths;
    }, [data, selectedId, selectedType]);

    // Filter Files in Table
    const currentFiles = useMemo(() => {
        if (selectedType !== 'volume') return [];
        const files = (selectedObject as ArchiveVolume).files || [];
        if (!fileSearchTerm) return files;
        return files.filter(f => 
            f.name.toLowerCase().includes(fileSearchTerm.toLowerCase()) || 
            (f.code && f.code.toLowerCase().includes(fileSearchTerm.toLowerCase()))
        );
    }, [selectedObject, selectedType, fileSearchTerm]);

    // Actions
    const handleUpdateFile = (fileId: string, field: string, value: any) => {
        if (selectedType !== 'volume') return;
        const vol = selectedObject as ArchiveVolume;
        const newFiles = vol.files.map(f => f.id === fileId ? { ...f, [field]: value } : f);
        onUpdateFiles(vol.id, newFiles);
    };

    const handleDeleteFile = () => {
        if (selectedType !== 'volume' || !selectedFileId) return;
        const vol = selectedObject as ArchiveVolume;
        if (confirm("确定要删除选中的文件吗？")) {
            const newFiles = vol.files.filter(f => f.id !== selectedFileId);
            onUpdateFiles(vol.id, newFiles);
            setSelectedFileId(null);
        }
    };

    const handleStartCompiling = () => {
        if (selectedType !== 'volume') {
            alert("请先选择一个案卷进行组卷操作");
            return;
        }
        setIsSelectionModalOpen(true);
    };

    const handleConfirmSelection = (selectedIds: string[]) => {
        setIsSelectionModalOpen(false);
        const vol = selectedObject as ArchiveVolume;
        
        setIsCompiling(true);

        setTimeout(() => {
            const existingFiles = vol.files || [];
            
            const newFilesToAdd = INITIAL_CLOUD_FILES
                .filter(f => selectedIds.includes(f.id))
                .map(f => ({
                    id: `archived_${Date.now()}_${f.id}`,
                    seq: 0,
                    code: '',
                    name: f.name.split('.')[0],
                    pages: Math.floor(Math.random() * 5) + 1,
                    date: f.date,
                    endDate: f.date,
                    author: '建设单位',
                } as any));

            const mergedFiles = [...existingFiles, ...newFilesToAdd];

            mergedFiles.sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                if (dateA !== dateB) return dateA - dateB;
                return a.name.localeCompare(b.name);
            });

            let currentPage = 1;
            const processedFiles = mergedFiles.map((file, index) => {
                const pages = file.pages || 1;
                const start = currentPage;
                const end = currentPage + pages - 1;
                currentPage = end + 1;

                return {
                    ...file,
                    seq: index + 1,
                    pageStart: start,
                    pageEnd: end
                };
            });

            onUpdateFiles(vol.id, processedFiles);
            setIsCompiling(false);
        }, 1200);
    };

    const handleSortFiles = () => {
        if (selectedType !== 'volume') return;
        const vol = selectedObject as ArchiveVolume;
        if (!vol.files?.length) return;

        const sortedFiles = [...vol.files].sort((a, b) => {
            return (a.code || '').localeCompare(b.code || '');
        });
        onUpdateFiles(vol.id, sortedFiles);
    };

    const handleUpdatePageNumbers = () => {
        if (selectedType !== 'volume') return;
        const vol = selectedObject as ArchiveVolume;
        if (!vol.files?.length) return;

        let currentPage = 1;
        const processedFiles = vol.files.map((file) => {
            const pages = file.pages || 1;
            const start = currentPage;
            const end = currentPage + pages - 1;
            currentPage = end + 1;
            return {
                ...file,
                pageStart: start,
                pageEnd: end
            };
        });
        onUpdateFiles(vol.id, processedFiles);
    };

    // Add Volume
    const handleToolbarAddVolume = () => {
        let unitId = null;
        if (selectedType === 'engineering') {
            unitId = selectedId;
        } else if (selectedType === 'volume') {
            const unit = data.units.find(u => u.volumes.some(v => v.id === selectedId));
            if (unit) unitId = unit.id;
        }

        if (unitId) {
            setTargetUnitId(unitId);
            setNewVolumeName('新案卷');
            setIsAddingVolume(true);
        } else {
            alert("请先选择一个单位工程");
        }
    };

    const confirmAddVolume = () => {
        if (targetUnitId && newVolumeName.trim()) {
            onAddVolume(targetUnitId, newVolumeName);
            setIsAddingVolume(false);
        }
    };

    // Background click to deselect file
    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setSelectedFileId(null);
        }
    };

    // Dynamic Label for Attribute Button
    const getAttributeButtonLabel = () => {
        if (selectedFileId) return '文件元数据';
        if (selectedType === 'project') return '项目元数据';
        if (selectedType === 'engineering') return '工程元数据';
        if (selectedType === 'volume') return '案卷元数据';
        return '属性';
    };

    return (
        <div className="flex-1 flex flex-col min-w-0">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-slate-500 mb-4 px-2">
                <span className="text-primary cursor-pointer hover:underline">案卷</span>
                {breadcrumbs.map((segment, idx) => (
                    <React.Fragment key={idx}>
                        <span className="mx-2 text-slate-300">/</span>
                        <span className={idx === breadcrumbs.length - 1 ? 'text-slate-800' : ''}>{segment}</span>
                    </React.Fragment>
                ))}
            </div>

            <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleStartCompiling}
                            disabled={isCompiling}
                            className="flex items-center px-4 py-1.5 bg-primary text-white border border-primary rounded text-sm hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isCompiling ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Play className="w-4 h-4 mr-1.5" />}
                            {isCompiling ? '组卷中...' : '开始组卷'}
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                         
                        <button 
                            className="flex items-center px-4 py-1.5 bg-white text-slate-600 border border-slate-200 rounded text-sm hover:bg-slate-50 transition-colors"
                            onClick={() => onEditMetadata()}
                            title="查看选中对象的属性"
                        >
                            <Settings className="w-4 h-4 mr-1.5" /> 
                            {getAttributeButtonLabel()}
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

                        <button 
                            className="flex items-center px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-sm hover:bg-blue-100 transition-colors"
                            onClick={handleToolbarAddVolume}
                        >
                            <Plus className="w-4 h-4 mr-1.5" /> 新增案卷
                        </button>

                        <button 
                            className="flex items-center px-4 py-1.5 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded text-sm hover:bg-yellow-100 transition-colors"
                            onClick={() => alert("移动功能待实现")}
                        >
                            <CornerUpRight className="w-4 h-4 mr-1.5" /> 移动
                        </button>
                        <button 
                            className="flex items-center px-4 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded text-sm hover:bg-red-100 transition-colors"
                            onClick={handleDeleteFile}
                        >
                            <Trash2 className="w-4 h-4 mr-1.5" /> 删除
                        </button>
                        <button 
                            className="flex items-center px-4 py-1.5 bg-white text-slate-600 border border-slate-200 rounded text-sm hover:bg-slate-50 transition-colors"
                            onClick={() => alert("打印功能待实现")}
                        >
                            <Printer className="w-4 h-4 mr-1.5" /> 打印
                        </button>
                        
                        <button 
                            onClick={handleUpdatePageNumbers}
                            className="flex items-center px-4 py-1.5 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded text-sm hover:bg-yellow-100 transition-colors"
                        >
                            <RotateCw className="w-4 h-4 mr-1.5" /> 更新页次
                        </button>
                        <button 
                            onClick={handleSortFiles}
                            className="flex items-center px-4 py-1.5 bg-white text-slate-600 border border-slate-200 rounded text-sm hover:bg-slate-50 transition-colors"
                        >
                            <ArrowUpDown className="w-4 h-4 mr-1.5" /> 更新排序
                        </button>
                    </div>
                    
                    {/* Search */}
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

                {/* Content View */}
                <div className="flex-1 overflow-y-auto bg-white p-0" onClick={handleBackgroundClick}>
                    {selectedType === 'volume' ? (
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
                                    <th className="px-4 py-3 border-b border-slate-200 w-32">页次</th>
                                    <th className="px-4 py-3 border-b border-slate-200 w-24 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center justify-center">
                                            排序码 <ArrowUpDown className="w-3 h-3 ml-1 text-slate-400" />
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 border-b border-slate-200 w-24">责任者</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {currentFiles.map((f: any, idx: number) => {
                                    const isLastItem = idx === currentFiles.length - 1;
                                    const isSelected = f.id === selectedFileId;
                                    return (
                                        <tr 
                                            key={idx} 
                                            className={`${isSelected ? 'bg-blue-50' : 'hover:bg-blue-50'} transition-colors group cursor-pointer`}
                                            onClick={(e) => { e.stopPropagation(); setSelectedFileId(f.id); }}
                                            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedFileId(f.id); }}
                                        >
                                            <td className="px-4 py-3 text-center text-slate-500 border-b border-slate-100">
                                                <input type="checkbox" className="rounded border-slate-200 text-primary focus:ring-primary" title={f.name} />
                                            </td>
                                            <td className="px-4 py-3 border-b border-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <Eye 
                                                        className="w-4 h-4 text-slate-400 cursor-pointer hover:text-primary shrink-0" 
                                                        onClick={(e) => { e.stopPropagation(); setPreviewFile(f); }}
                                                    />
                                                    {getFileIcon('pdf', "w-4 h-4 shrink-0", false)}
                                                    <input 
                                                        type="text" 
                                                        className="flex-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-primary focus:bg-white rounded px-2 py-1 text-slate-700 font-medium w-full text-sm"
                                                        value={f.name}
                                                        onChange={(e) => handleUpdateFile(f.id, 'name', e.target.value)}
                                                        title="文件题名"
                                                        placeholder="输入文件题名"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 border-b border-slate-100">
                                                <input 
                                                    type="text" 
                                                    className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-primary focus:bg-white rounded px-2 py-1 text-slate-500 text-sm"
                                                    value={f.code}
                                                    placeholder="无"
                                                    onChange={(e) => handleUpdateFile(f.id, 'code', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 border-b border-slate-100">
                                                <input 
                                                    type="date" 
                                                    className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-primary focus:bg-white rounded px-1 py-1 text-slate-500 text-sm"
                                                    value={f.date}
                                                    onChange={(e) => handleUpdateFile(f.id, 'date', e.target.value)}
                                                    title="起始时间"
                                                />
                                            </td>
                                            <td className="px-4 py-3 border-b border-slate-100">
                                                <input 
                                                    type="date" 
                                                    className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-primary focus:bg-white rounded px-1 py-1 text-slate-500 text-sm"
                                                    value={f.endDate || ''}
                                                    onChange={(e) => handleUpdateFile(f.id, 'endDate', e.target.value)}
                                                    title="截止时间"
                                                />
                                            </td>
                                            <td className="px-4 py-3 border-b border-slate-100 text-slate-600 text-sm font-mono">
                                                {f.pageStart ? (
                                                    isLastItem 
                                                    ? (f.pageStart === f.pageEnd ? `${f.pageStart}` : `${f.pageStart}-${f.pageEnd}`)
                                                    : `${f.pageStart}`
                                                ) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center text-slate-600 border-b border-slate-100">{f.seq}</td>
                                            <td className="px-4 py-3 text-slate-600 border-b border-slate-100">{f.author}</td>
                                        </tr>
                                    );
                                })}
                                {(!currentFiles || currentFiles.length === 0) && (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center">
                                                <FolderOpen className="w-12 h-12 text-slate-200 mb-2" />
                                                <p>本卷暂无文件，请点击"开始组卷"从归档库移入文件</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <BookOpen className="w-16 h-16 text-slate-200 mb-4" />
                            <p>请选择左侧的"案卷"以查看卷内文件</p>
                            <p className="text-xs mt-2">当前选择：{(selectedObject as ArchiveProjectData | ArchiveEngineering)?.name}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Selection Modal */}
            <ArchiveSelectionModal 
                isOpen={isSelectionModalOpen}
                onClose={() => setIsSelectionModalOpen(false)}
                onConfirm={handleConfirmSelection}
                currentPath={`归档 / ${(selectedObject as any)?.title || '未命名案卷'}`}
                rootNodeName="归档"
                confirmText="确认组卷"
            />

            {/* Add Volume Modal */}
            {isAddingVolume && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-80 animate-in zoom-in-95">
                        <h3 className="font-bold mb-4 text-slate-800">新增案卷</h3>
                        <div className="mb-4">
                            <label className="block text-sm text-slate-500 mb-1">案卷名称</label>
                            <input 
                                className="w-full border border-slate-200 p-2 rounded focus:ring-primary focus:border-primary outline-none" 
                                placeholder="请输入案卷名称" 
                                value={newVolumeName}
                                onChange={e => setNewVolumeName(e.target.value)}
                                autoFocus
                                onKeyDown={e => { if(e.key === 'Enter') confirmAddVolume(); }}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsAddingVolume(false)} className="px-3 py-1.5 text-sm border border-slate-200 rounded text-slate-600 hover:bg-slate-50">取消</button>
                            <button onClick={confirmAddVolume} className="px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-hover shadow-sm">确定</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-10 animate-in fade-in">
                    <div className="bg-white rounded-lg w-full h-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl relative">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{previewFile.name}</h3>
                                <p className="text-xs text-slate-500">文件大小: {(previewFile.pages || 1) * 1.5}MB (估算) | 页数: {previewFile.pages || 1}</p>
                            </div>
                            <button onClick={() => setPreviewFile(null)} className="p-2 hover:bg-slate-100 rounded-full" title="关闭预览"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-auto p-4">
                             <div className="bg-white shadow-lg w-[800px] min-h-[1000px] p-10 relative">
                                <div className="text-center font-serif text-2xl font-bold mb-10 border-b-2 border-red-500 pb-4">
                                    {previewFile.name.replace(/\.[^/.]+$/, "")}
                                </div>
                                <div className="space-y-6 text-slate-600 leading-loose text-justify">
                                    <p>此处为文件预览内容...</p>
                                    <div className="h-64 bg-slate-50 border border-dashed border-slate-200 rounded flex items-center justify-center text-slate-400">
                                        [ 文件内容预览区域 ]
                                    </div>
                                    <p className="indent-8">
                                        根据《建设工程文件归档规范》(GB/T 50328-2014) 要求，本文件已完成数字化采集。
                                        <br/>
                                        文件编码: {previewFile.code || '待生成'}
                                        <br/>
                                        卷内顺序: {previewFile.seq ? `第 ${previewFile.seq} 件` : '未组卷'}
                                        <br/>
                                        页号范围: {previewFile.pageStart ? `${previewFile.pageStart} - ${previewFile.pageEnd}` : '未生成'}
                                        <br/>
                                        归档日期: {previewFile.date}
                                        <br/>
                                        截止日期: {previewFile.endDate}
                                    </p>
                                </div>
                                <div className="absolute bottom-10 right-10 opacity-50">
                                     <div className="w-32 h-32 border-4 border-red-500 rounded-full flex items-center justify-center text-red-500 font-bold rotate-[-15deg] text-xl">
                                        {previewFile.author || '已归档'}
                                     </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolumeFilePanel;
