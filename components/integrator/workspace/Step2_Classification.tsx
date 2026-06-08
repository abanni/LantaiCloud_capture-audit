
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Layers, Search, X, ChevronDown, ChevronRight, Box, FolderOpen,
    Folder, Plus, Edit3, Trash2, ListCollapse, Cloud, ArrowUpDown,
    CornerUpRight, Eye
} from 'lucide-react';
import { ArchiveProjectData } from '../../../types';
import ArchiveSelectionModal from './ArchiveSelectionModal';
import { INITIAL_CLOUD_FILES } from '../../../data/mockCloudFiles';
import { getFileIcon } from '../../common/fileUtils';

interface TreeItem {
    id: string;
    label: string;
    type: 'project' | 'unit' | 'category' | 'folder'; 
    children?: TreeItem[];
    expanded?: boolean;
}

const STANDARD_CATEGORIES = [
    {
        id: 'cat_A', label: 'A 工程准备阶段文件', children: [
            { id: 'sub_A_desc', label: '情况说明' },
            { id: 'sub_A1', label: 'A1 立项文件' },
            { id: 'sub_A2', label: 'A2 建设用地文件' },
            { id: 'sub_A3', label: 'A3 勘察、测绘、设计文件' },
            { id: 'sub_A4', label: 'A4 招投标文件' },
            { id: 'sub_A5', label: 'A5 开工审批文件' },
        ]
    },
    {
        id: 'cat_B', label: 'B 工程监理文件', children: [
            { id: 'sub_B1', label: 'B1 监理管理资料' },
            { id: 'sub_B2', label: 'B2 进度控制资料' },
        ]
    },
    {
        id: 'cat_C', label: 'C 施工文件', children: [
            { id: 'sub_C1', label: 'C1 施工管理文件' },
        ]
    }
];

interface ClassificationViewProps {
    archiveData: ArchiveProjectData;
    onAddUnit: (name: string, code: string) => void;
    onUpdateUnit: (id: string, name: string) => void;
    onDeleteUnit: (id: string) => void;
}

const ClassificationView: React.FC<ClassificationViewProps> = ({ archiveData, onAddUnit, onUpdateUnit, onDeleteUnit }) => {
    // State
    const [selectedNode, setSelectedNode] = useState<string>('sub_A_desc');
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [treeSearchTerm, setTreeSearchTerm] = useState('');
    const [fileSearchTerm, setFileSearchTerm] = useState('');
    
    // Context Menu State
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, nodeId: string, nodeType: string } | null>(null);
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [isAddingUnit, setIsAddingUnit] = useState(false);
    const [newUnitName, setNewUnitName] = useState('');

    const treeData: TreeItem[] = useMemo(() => {
        return [
            {
                id: archiveData.id,
                label: archiveData.name,
                type: 'project',
                children: archiveData.units.map(unit => ({
                    id: unit.id,
                    label: unit.name,
                    type: 'unit',
                    children: STANDARD_CATEGORIES.map(cat => ({
                        id: `${unit.id}_${cat.id}`,
                        label: cat.label,
                        type: 'category',
                        children: cat.children.map(sub => ({
                            id: `${unit.id}_${sub.id}`,
                            label: sub.label,
                            type: 'folder'
                        }))
                    }))
                }))
            }
        ];
    }, [archiveData]);

    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
        const initial = new Set<string>();
        initial.add(archiveData.id);
        archiveData.units.forEach(u => initial.add(u.id));
        return initial;
    });

    const toggleNode = (id: string) => {
        const newSet = new Set(expandedNodes);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedNodes(newSet);
    };

    const expandNode = (id: string) => {
        setExpandedNodes(prev => new Set(prev).add(id));
    }

    const collapseNode = (id: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }

    const collapseAll = () => {
        setExpandedNodes(new Set());
    }
    
    // Local Files State (Simulated)
    const [filedFiles, setFiledFiles] = useState<any[]>([
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
            folderId: `${archiveData.units[0]?.id}_sub_A_desc` // Match dynamic ID
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

    const handleContextMenu = (e: React.MouseEvent, nodeId: string, nodeType: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, nodeId, nodeType });
    };

    const closeContextMenu = () => setContextMenu(null);

    useEffect(() => {
        const handleClick = () => closeContextMenu();
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    const handleAddUnitClick = () => {
        setIsAddingUnit(true);
        setNewUnitName('新单位工程');
    };

    const handleConfirmAddUnit = () => {
        if (newUnitName.trim()) {
            onAddUnit(newUnitName, `GC-${Date.now()}`);
            setIsAddingUnit(false);
        }
    };

    const handleRenameClick = (id: string, currentName: string) => {
        setEditingNodeId(id);
        setEditName(currentName);
    };

    const handleConfirmRename = () => {
        if (editingNodeId && editName.trim()) {
            onUpdateUnit(editingNodeId, editName);
            setEditingNodeId(null);
        }
    };

    const nodeCounts = useMemo(() => {
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
        treeData.forEach(node => countFiles(node));
        return counts;
    }, [treeData, filedFiles]);

    const filteredTreeData = useMemo(() => {
        if (!treeSearchTerm.trim()) return treeData;
        const filterNodes = (nodes: TreeItem[]): TreeItem[] => {
            return nodes.reduce<TreeItem[]>((acc, node) => {
                const matches = node.label.toLowerCase().includes(treeSearchTerm.toLowerCase());
                const filteredChildren = node.children ? filterNodes(node.children) : [];
                if (matches || filteredChildren.length > 0) {
                    acc.push({ ...node, children: filteredChildren.length > 0 ? filteredChildren : node.children });
                }
                return acc;
            }, []);
        };
        return filterNodes(treeData);
    }, [treeData, treeSearchTerm]);

    useEffect(() => {
        if (treeSearchTerm) {
            const collectIds = (nodes: TreeItem[], set: Set<string>) => {
                nodes.forEach(n => {
                    set.add(n.id);
                    if(n.children) collectIds(n.children, set);
                });
            };
            const newSet = new Set<string>(expandedNodes);
            collectIds(filteredTreeData, newSet);
            setExpandedNodes(newSet);
        }
    }, [treeSearchTerm, filteredTreeData]); 

    const renderTree = (items: TreeItem[], level = 0) => {
        return items.map(item => {
            const count = nodeCounts[item.id] || 0;
            const isExpanded = expandedNodes.has(item.id);
            const isEditing = editingNodeId === item.id;

            return (
                <div key={item.id} className="select-none">
                    <div 
                        className={`
                            flex items-center py-1.5 px-2 cursor-pointer text-sm rounded transition-colors relative
                            ${selectedNode === item.id ? 'bg-blue-50 text-primary font-medium' : 'hover:bg-slate-50 text-slate-700'}
                            [padding-left:${level * 16 + 8}px]
                        `}
                        onClick={() => {
                            if (item.type === 'folder') setSelectedNode(item.id);
                            else toggleNode(item.id);
                        }}
                        onContextMenu={(e) => handleContextMenu(e, item.id, item.type)}
                    >
                        <span className="mr-1.5 opacity-60 hover:opacity-100" onClick={(e) => { e.stopPropagation(); toggleNode(item.id); }}>
                            {item.children && item.children.length > 0 ? (
                                isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
                            ) : <span className="w-3.5 inline-block"></span>}
                        </span>
                        
                        {item.type === 'project' && <Box className="w-4 h-4 mr-2 text-slate-500" />}
                        {item.type === 'unit' && <FolderOpen className="w-4 h-4 mr-2 text-yellow-500" />}
                        {item.type === 'category' && <Folder className="w-4 h-4 mr-2 text-yellow-500" />}
                        {item.type === 'folder' && <FolderOpen className={`w-4 h-4 mr-2 ${selectedNode === item.id ? 'text-primary' : 'text-slate-400'}`} />}
                        
                        {isEditing ? (
                            <input 
                                type="text" 
                                className="flex-1 border border-blue-300 rounded px-1 py-0.5 text-xs outline-none bg-white"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                onKeyDown={e => { if(e.key === 'Enter') handleConfirmRename(); }}
                                title="重命名"
                                placeholder="输入新名称"
                                onBlur={handleConfirmRename}
                                autoFocus
                                onClick={e => e.stopPropagation()}
                            />
                        ) : (
                            <span className="truncate mr-2">{item.label}</span>
                        )}
                        
                        {count > 0 && <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 rounded-full ml-auto mr-1">{count}</span>}
                        {item.type === 'project' && <span className={`${count > 0 ? 'ml-1' : 'ml-auto'} text-[10px] bg-slate-200 text-slate-600 px-1 rounded`}>项</span>}
                        {item.type === 'unit' && <span className={`${count > 0 ? 'ml-1' : 'ml-auto'} text-[10px] bg-slate-200 text-slate-600 px-1 rounded`}>工</span>}
                    </div>
                    {item.children && isExpanded && (
                        <div>{renderTree(item.children, level + 1)}</div>
                    )}
                </div>
            );
        });
    };

    const handleArchiveFiles = (selectedIds: string[]) => {
        const selectedFiles = INITIAL_CLOUD_FILES.filter(f => selectedIds.includes(f.id));
        const newFiledFiles = selectedFiles.map(f => ({
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

    return (
        <div className="flex h-full bg-[#f0f2f5] gap-4 p-4 relative">
             {contextMenu && (
                <div 
                    className={`fixed bg-white border border-slate-200 rounded shadow-lg py-1 z-50 text-sm min-w-[150px] left-[${contextMenu.x}px] top-[${contextMenu.y}px]`}
                >
                    {contextMenu.nodeType === 'project' && (
                        <div 
                            className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center"
                            onClick={() => { handleAddUnitClick(); closeContextMenu(); }}
                        >
                            <Plus className="w-4 h-4 mr-2 text-primary" /> 新增单位工程
                        </div>
                    )}
                    {contextMenu.nodeType === 'unit' && (
                        <>
                            <div 
                                className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center"
                                onClick={() => { handleRenameClick(contextMenu.nodeId, 
                                    treeData[0].children?.find(u => u.id === contextMenu.nodeId)?.label || ''
                                ); closeContextMenu(); }}
                            >
                                <Edit3 className="w-4 h-4 mr-2 text-slate-600" /> 重命名
                            </div>
                            <div 
                                className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center text-red-600"
                                onClick={() => { onDeleteUnit(contextMenu.nodeId); closeContextMenu(); }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> 删除工程
                            </div>
                        </>
                    )}
                    <div className="border-t border-slate-100 my-1"></div>
                    <div 
                        className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center"
                        onClick={() => { expandNode(contextMenu.nodeId); closeContextMenu(); }}
                    >
                         <ChevronDown className="w-4 h-4 mr-2 text-slate-500" /> 展开当前节点
                    </div>
                    <div 
                        className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center"
                        onClick={() => { collapseNode(contextMenu.nodeId); closeContextMenu(); }}
                    >
                         <ChevronRight className="w-4 h-4 mr-2 text-slate-500" /> 收起当前节点
                    </div>
                </div>
            )}

            {isAddingUnit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-80 animate-in zoom-in-95">
                        <h3 className="font-bold mb-4">新增单位工程</h3>
                        <input 
                            className="w-full border p-2 rounded mb-4" 
                            placeholder="如：19#楼" 
                            value={newUnitName}
                            onChange={e => setNewUnitName(e.target.value)}
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsAddingUnit(false)} className="px-3 py-1 text-sm border rounded">取消</button>
                            <button onClick={handleConfirmAddUnit} className="px-3 py-1 text-sm bg-primary text-white rounded">确定</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-[320px] bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col shrink-0">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-lg">
                    <span className="font-bold text-sm text-slate-700 flex items-center">
                        <Layers className="w-4 h-4 mr-2 text-slate-500" /> 归档目录规则
                    </span>
                    <div className="flex items-center gap-2">
                        <button 
                            className="text-xs text-slate-500 hover:text-primary flex items-center"
                            title="全部折叠"
                            onClick={collapseAll}
                        >
                            <ListCollapse className="w-3.5 h-3.5" />
                        </button>
                        <button className="text-xs text-primary hover:underline">刷新</button>
                    </div>
                </div>
                <div className="p-2 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input 
                            type="text" 
                            className="w-full pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="筛选目录..."
                            value={treeSearchTerm}
                            onChange={(e) => setTreeSearchTerm(e.target.value)}
                        />
                        {treeSearchTerm && (
                            <X 
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600"
                                onClick={() => setTreeSearchTerm('')}
                            />
                        )}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {renderTree(filteredTreeData)}
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
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

                <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
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
                                                        <p>暂无文件，请点击“开始归档”从云盘选择</p>
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
            </div>

            <ArchiveSelectionModal 
                isOpen={isArchiveModalOpen}
                onClose={() => setIsArchiveModalOpen(false)}
                onConfirm={handleArchiveFiles}
                currentPath={breadcrumbString}
            />
        </div>
    );
};

export default ClassificationView;
