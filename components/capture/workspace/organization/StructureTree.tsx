import React, { useState, useMemo, useEffect } from 'react';
import { 
    Box, Building, Folder, Search, ListCollapse, 
    ChevronDown, ChevronRight
} from 'lucide-react';
import { ArchiveLevel, ArchiveProjectData, ArchiveEngineering } from '../../../../types';

interface StructureTreeProps {
    data: ArchiveProjectData;
    selectedId: string;
    selectedType: ArchiveLevel;
    onSelect: (id: string, type: ArchiveLevel) => void;
    onContextMenu: (e: React.MouseEvent, nodeId: string, nodeType: string) => void;
}

const StructureTree: React.FC<StructureTreeProps> = ({ 
    data, selectedId, selectedType, onSelect, onContextMenu 
}) => {
    const [treeSearchTerm, setTreeSearchTerm] = useState('');
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([data.id, ...data.units.map(u => u.id)]));

    const toggleNode = (id: string) => {
        const newSet = new Set(expandedNodes);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedNodes(newSet);
    };

    const collapseAll = () => setExpandedNodes(new Set());

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

    return (
        <div className="w-[320px] bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-lg">
                <span className="font-bold text-sm text-slate-700 flex items-center">
                    <ChevronDown className="w-4 h-4 mr-2 text-slate-500" /> 案卷目录
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
                        onContextMenu={(e) => onContextMenu(e, data.id, 'project')}
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
                                        onContextMenu={(e) => onContextMenu(e, unit.id, 'engineering')}
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
                                                    onContextMenu={(e) => onContextMenu(e, vol.id, 'volume')}
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
    );
};

export default StructureTree;
