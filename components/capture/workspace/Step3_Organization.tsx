import React, { useState, useMemo, useEffect } from 'react';
import { 
    Box, Building, Folder, Edit3, Search, ListCollapse, 
    ChevronDown, ChevronRight, Plus, Trash2, Printer, 
    Settings, Layers, ArrowUpDown, BookOpen, Play, Send,
    RefreshCw, CornerUpRight, RotateCw, Eye, FileText, ChevronsRight,
    X, FolderOpen, Loader2, Info
} from 'lucide-react';
import { ArchiveLevel, ArchiveProjectData, ArchiveVolume, ArchiveEngineering, ArchiveFile } from '../../../types';
import { getFileIcon } from '../../common/fileUtils';
import ArchiveSelectionModal from './ArchiveSelectionModal';
import { INITIAL_CLOUD_FILES } from '../../../data/mockCloudFiles';

interface OrganizationViewProps {
    data: ArchiveProjectData;
    selectedId: string;
    selectedType: ArchiveLevel;
    onSelect: (id: string, type: ArchiveLevel) => void;
    updateFiles: (volId: string, files: any[]) => void;
    onEditMetadata: (type: ArchiveLevel) => void;
    onAddVolume: (unitId: string, title: string) => void;
}

const OrganizationView: React.FC<OrganizationViewProps> = ({ 
    data, selectedId, selectedType, onSelect, updateFiles, onEditMetadata, onAddVolume
}) => {
    // State
    const [treeSearchTerm, setTreeSearchTerm] = useState('');
    const [fileSearchTerm, setFileSearchTerm] = useState('');
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([data.id, ...data.units.map(u => u.id)]));
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, nodeId: string, nodeType: string } | null>(null);
    const [previewFile, setPreviewFile] = useState<any | null>(null);
    const [isCompiling, setIsCompiling] = useState(false);
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
    
    // Add Volume Modal State
    const [isAddingVolume, setIsAddingVolume] = useState(false);
    const [newVolumeName, setNewVolumeName] = useState('');
    const [targetUnitId, setTargetUnitId] = useState<string | null>(null);

    // File Selection State (Local to this view)
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    // Helpers for Tree
    const toggleNode = (id: string) => {
        const newSet = new Set(expandedNodes);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedNodes(newSet);
    };

    const expandNode = (id: string) => setExpandedNodes(prev => new Set(prev).add(id));
    const collapseNode = (id: string) => setExpandedNodes(prev => { const s = new Set(prev); s.delete(id); return s; });
    const collapseAll = () => setExpandedNodes(new Set());

    // Context Menu Logic
    const handleContextMenu = (e: React.MouseEvent, nodeId: string, nodeType: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, nodeId, nodeType });
    };

    const handleFileContextMenu = (e: React.MouseEvent, fileId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedFileId(fileId); // Also select the file
        setContextMenu({ x: e.clientX, y: e.clientY, nodeId: fileId, nodeType: 'file' });
    };

    useEffect(() => {
        const closeMenu = () => setContextMenu(null);
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, []);

    // Clear file selection when changing tree selection
    useEffect(() => {
        setSelectedFileId(null);
    }, [selectedId, selectedType]);

    // Filter Tree Data
    const filteredUnits = useMemo(() => {
        if (!treeSearchTerm) return data.units;
        return data.units.map(unit => {
            const unitMatch = unit.name.toLowerCase().includes(treeSearchTerm.toLowerCase());
            const filteredVolumes = unit.volumes.filter(v => v.title.toLowerCase().includes(treeSearchTerm.toLowerCase()));
            if (unitMatch) return unit;
            if (filteredVolumes.length > 0) return { ...unit, volumes: filteredVolumes };
            return null;
        }).filter(Boolean) as any[];
    }, [data.units, treeSearchTerm]);

    // Get Current Object
    const selectedObject = useMemo(() => {
        if (selectedType === 'project') return data;
        for (const unit of data.units) {
            if (selectedType === 'engineering' && unit.id === selectedId) return unit;
            for (const vol of unit.volumes) {
                if (selectedType === 'volume' && vol.id === selectedId) return vol;
            }
        }
        return null;
    }, [data, selectedId, selectedType]);

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

    // Actions
    const handleUpdateFile = (fileId: string, field: string, value: any) => {
        if (selectedType !== 'volume') return;
        const vol = selectedObject as ArchiveVolume;
        const newFiles = vol.files.map(f => f.id === fileId ? { ...f, [field]: value } : f);
        updateFiles(vol.id, newFiles);
    };

    const handleDeleteFile = () => {
        if (selectedType !== 'volume' || !selectedFileId) return;
        const vol = selectedObject as ArchiveVolume;
        if (confirm("确定要删除选中的文件吗？")) {
            const newFiles = vol.files.filter(f => f.id !== selectedFileId);
            updateFiles(vol.id, newFiles);
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

        // Simulate async processing (Adding files + Compiling/Ordering)
        setTimeout(() => {
            // 1. Get existing files
            const existingFiles = vol.files || [];
            
            // 2. Map selected mock cloud files to ArchiveFile structure
            const newFilesToAdd = INITIAL_CLOUD_FILES
                .filter(f => selectedIds.includes(f.id))
                .map(f => ({
                    id: `archived_${Date.now()}_${f.id}`,
                    seq: 0, // Will be recalculated
                    code: '', // Needs to be generated or filled
                    name: f.name.split('.')[0],
                    pages: Math.floor(Math.random() * 5) + 1, // Mock page count
                    date: f.date,
                    endDate: f.date, // Default end date
                    author: '建设单位', // Default author
                } as any));

            // 3. Merge files
            const mergedFiles = [...existingFiles, ...newFilesToAdd];

            // 4. Sort by Date (Ascending) then by Name for initial order
            mergedFiles.sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                if (dateA !== dateB) return dateA - dateB;
                return a.name.localeCompare(b.name);
            });

            // 5. Assign Sequence and Page Numbers (Compiling Logic)
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

            updateFiles(vol.id, processedFiles);
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
        updateFiles(vol.id, sortedFiles);
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
        updateFiles(vol.id, processedFiles);
    };

    // Add Volume Logic
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

    const handleContextMenuAddVolume = () => {
        if (contextMenu && contextMenu.nodeType === 'engineering') {
            setTargetUnitId(contextMenu.nodeId);
            setNewVolumeName('新案卷');
            setIsAddingVolume(true);
            setContextMenu(null);
        }
    };

    const confirmAddVolume = () => {
        if (targetUnitId && newVolumeName.trim()) {
            onAddVolume(targetUnitId, newVolumeName);
            setIsAddingVolume(false);
            if (!expandedNodes.has(targetUnitId)) {
                expandNode(targetUnitId);
            }
        }
    };

    // Open Metadata Modal Wrapper
    const openMetadata = (type?: ArchiveLevel) => {
        // If context menu is open, use its context
        if (contextMenu) {
            onEditMetadata(contextMenu.nodeType as ArchiveLevel);
            setContextMenu(null);
        } else {
            // Use selectedFileId if present for toolbar clicks
            if (selectedFileId && !type) {
                onEditMetadata('file');
            } else {
                 // Otherwise use selected item or explicit type
                 onEditMetadata(type || selectedType);
            }
        }
    };

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

    // Handle background click to deselect file
    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
             setSelectedFileId(null);
        }
    }

    // Dynamic Label for Attribute Button
    const getAttributeButtonLabel = () => {
        if (selectedFileId) return '文件元数据';
        if (selectedType === 'project') return '项目元数据';
        if (selectedType === 'engineering') return '工程元数据';
        if (selectedType === 'volume') return '案卷元数据';
        return '属性';
    };

    return (
        <div className="flex h-full bg-[#f0f2f5] gap-4 p-4 relative">
             {/* Context Menu */}
             {contextMenu && (
                <div 
                    className={`fixed bg-white border border-slate-200 rounded shadow-lg py-1 z-50 text-sm min-w-[150px] left-[${contextMenu.x}px] top-[${contextMenu.y}px]`}
                >
                    {contextMenu.nodeType === 'engineering' && (
                        <div 
                            className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center"
                            onClick={handleContextMenuAddVolume}
                        >
                            <Plus className="w-4 h-4 mr-2 text-primary" /> 新增案卷
                        </div>
                    )}
                    {(contextMenu.nodeType === 'volume' || contextMenu.nodeType === 'file') && (
                        <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center">
                            <Edit3 className="w-4 h-4 mr-2 text-slate-600" /> 重命名
                        </div>
                    )}
                    {/* Metadata Context Menu Item */}
                    <div 
                        className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center"
                        onClick={() => openMetadata()}
                    >
                        <Info className="w-4 h-4 mr-2 text-blue-500" /> 
                        {contextMenu.nodeType === 'project' ? '项目级元数据' : 
                         contextMenu.nodeType === 'engineering' ? '工程级元数据' :
                         contextMenu.nodeType === 'volume' ? '案卷级元数据' : '文件元数据'}
                    </div>

                    {(contextMenu.nodeType === 'volume' || contextMenu.nodeType === 'engineering') && (
                        <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" /> 删除
                        </div>
                    )}
                    
                    {['project', 'engineering', 'volume'].includes(contextMenu.nodeType) && (
                        <>
                            <div className="border-t border-slate-100 my-1"></div>
                            <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center" onClick={() => { expandNode(contextMenu.nodeId); setContextMenu(null); }}>
                                <ChevronDown className="w-4 h-4 mr-2 text-slate-500" /> 展开
                            </div>
                            <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center" onClick={() => { collapseNode(contextMenu.nodeId); setContextMenu(null); }}>
                                <ChevronRight className="w-4 h-4 mr-2 text-slate-500" /> 收起
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Left Sidebar: Tree */}
            <div className="w-[320px] bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col shrink-0">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-lg">
                    <span className="font-bold text-sm text-slate-700 flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 text-slate-500" /> 案卷目录
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="text-xs text-slate-500 hover:text-primary" onClick={collapseAll} title="全部折叠">
                            <ListCollapse className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
                
                <div className="p-2 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input 
                            type="text" 
                            className="w-full pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="筛选案卷..."
                            value={treeSearchTerm}
                            onChange={(e) => setTreeSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 select-none">
                    {/* Project Root */}
                    <div>
                        <div 
                            className={`flex items-center py-1.5 px-2 cursor-pointer text-sm rounded transition-colors ${selectedId === data.id ? 'bg-blue-50 text-primary font-medium' : 'hover:bg-slate-50 text-slate-700'}`}
                            onClick={() => { onSelect(data.id, 'project'); toggleNode(data.id); }}
                            onContextMenu={(e) => handleContextMenu(e, data.id, 'project')}
                        >
                            <span className="mr-1.5 opacity-60">
                                {expandedNodes.has(data.id) ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                            </span>
                            <Box className="w-4 h-4 mr-2 text-slate-500" />
                            <span className="truncate flex-1">{data.name}</span>
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-1 rounded ml-2">项</span>
                        </div>

                        {/* Units */}
                        {expandedNodes.has(data.id) && (
                            <div className="pl-4">
                                {filteredUnits.map((unit: any) => (
                                    <div key={unit.id}>
                                        <div 
                                            className={`flex items-center py-1.5 px-2 cursor-pointer text-sm rounded transition-colors ${selectedId === unit.id ? 'bg-blue-50 text-primary font-medium' : 'hover:bg-slate-50 text-slate-700'}`}
                                            onClick={() => { onSelect(unit.id, 'engineering'); toggleNode(unit.id); }}
                                            onContextMenu={(e) => handleContextMenu(e, unit.id, 'engineering')}
                                        >
                                            <span className="mr-1.5 opacity-60">
                                                {unit.volumes.length > 0 ? (expandedNodes.has(unit.id) ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />) : <span className="w-3.5 inline-block"/>}
                                            </span>
                                            <Building className="w-4 h-4 mr-2 text-yellow-500" />
                                            <span className="truncate flex-1">{unit.name}</span>
                                            <span className="text-[10px] bg-slate-200 text-slate-600 px-1 rounded ml-2">工</span>
                                        </div>

                                        {/* Volumes */}
                                        {expandedNodes.has(unit.id) && (
                                            <div className="pl-4">
                                                {unit.volumes.map((vol: any) => (
                                                    <div 
                                                        key={vol.id}
                                                        className={`flex items-center py-1.5 px-2 cursor-pointer text-sm rounded transition-colors ${selectedId === vol.id ? 'bg-blue-50 text-primary font-medium' : 'hover:bg-slate-50 text-slate-700'}`}
                                                        onClick={(e) => { e.stopPropagation(); onSelect(vol.id, 'volume'); }}
                                                        onContextMenu={(e) => handleContextMenu(e, vol.id, 'volume')}
                                                    >
                                                        <span className="w-3.5 mr-1.5 inline-block"></span>
                                                        <Folder className={`w-4 h-4 mr-2 ${vol.fileCount > 0 ? 'text-yellow-600' : 'text-yellow-400'}`} />
                                                        <span className="truncate flex-1">{vol.title}</span>
                                                        {vol.fileCount > 0 && <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 rounded-full ml-auto">{vol.fileCount}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Main Content */}
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
                            {/* Primary Actions */}
                            <button 
                                onClick={handleStartCompiling}
                                disabled={isCompiling}
                                className="flex items-center px-4 py-1.5 bg-primary text-white border border-primary rounded text-sm hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isCompiling ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Play className="w-4 h-4 mr-1.5" />}
                                {isCompiling ? '组卷中...' : '开始组卷'}
                            </button>
                            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                             
                             {/* Context Aware Metadata Button */}
                            <button 
                                className="flex items-center px-4 py-1.5 bg-white text-slate-600 border border-slate-200 rounded text-sm hover:bg-slate-50 transition-colors"
                                onClick={() => openMetadata()}
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
                            
                            {/* Operation Actions */}
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
                                                onContextMenu={(e) => handleFileContextMenu(e, f.id)}
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
                                                        title="文图号"
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
                                                        title="截止时间"
                                                        onChange={(e) => handleUpdateFile(f.id, 'endDate', e.target.value)}
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
                                                    <p>本卷暂无文件，请点击“开始组卷”从归档库移入文件</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <BookOpen className="w-16 h-16 text-slate-200 mb-4" />
                                <p>请选择左侧的“案卷”以查看卷内文件</p>
                                <p className="text-xs mt-2">当前选择：{(selectedObject as ArchiveProjectData | ArchiveEngineering)?.name}</p>
                            </div>
                        )}
                    </div>
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
                             {/* Mock Preview Content */}
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

export default OrganizationView;