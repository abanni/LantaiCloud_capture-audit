import React, { useState, useEffect, useMemo } from 'react';
import {
    Layers, Search, X, ChevronDown, ChevronRight, Box, FolderOpen,
    Folder, Plus, Edit3, Trash2, ListCollapse
} from 'lucide-react';
import { ArchiveProjectData } from '../../../../types';
import { TreeItem, STANDARD_CATEGORIES } from './constants';

interface ClassificationTreeProps {
    archiveData: ArchiveProjectData;
    selectedNode: string;
    onSelectNode: (id: string) => void;
    onAddUnit: (name: string, code: string) => void;
    onUpdateUnit: (id: string, name: string) => void;
    onDeleteUnit: (id: string) => void;
}

const ClassificationTree: React.FC<ClassificationTreeProps> = ({
    archiveData,
    selectedNode,
    onSelectNode,
    onAddUnit,
    onUpdateUnit,
    onDeleteUnit,
}) => {
    const [treeSearchTerm, setTreeSearchTerm] = useState('');
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, nodeId: string, nodeType: string } | null>(null);
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [isAddingUnit, setIsAddingUnit] = useState(false);
    const [newUnitName, setNewUnitName] = useState('');
    const [fileCounts, setFileCounts] = useState<Record<string, number>>({});

    // Tree data derived from archiveData
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

    // Expose setFileCounts externally via a setter (called from parent or FileAssignmentPanel)
    const updateFileCounts = (counts: Record<string, number>) => {
        setFileCounts(counts);
    };

    const toggleNode = (id: string) => {
        const newSet = new Set(expandedNodes);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedNodes(newSet);
    };

    const expandNode = (id: string) => {
        setExpandedNodes(prev => new Set(prev).add(id));
    };

    const collapseNode = (id: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const collapseAll = () => {
        setExpandedNodes(new Set());
    };

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

    // Count files per node based on external counts
    const nodeCounts = useMemo(() => {
        return fileCounts;
    }, [fileCounts]);

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
                    if (n.children) collectIds(n.children, set);
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
                            if (item.type === 'folder') onSelectNode(item.id);
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
                                onBlur={handleConfirmRename}
                                autoFocus
                                title="重命名"
                                placeholder="输入新名称"
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

    return (
        <div className="w-[320px] bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col shrink-0">
            {/* Header */}
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

            {/* Search */}
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

            {/* Tree */}
            <div className="flex-1 overflow-y-auto p-2">
                {renderTree(filteredTreeData)}
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <div 
                    className="fixed bg-white border border-slate-200 rounded shadow-lg py-1 z-50 text-sm min-w-[150px]"
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
                                onClick={() => { 
                                    handleRenameClick(contextMenu.nodeId, 
                                        treeData[0].children?.find(u => u.id === contextMenu.nodeId)?.label || ''
                                    ); 
                                    closeContextMenu(); 
                                }}
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

            {/* Add Unit Modal */}
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
        </div>
    );
};

export { ClassificationTree };
export type { ClassificationTreeProps };
