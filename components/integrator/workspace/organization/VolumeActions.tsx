import React from 'react';
import { 
    Play, Loader2, Settings, Plus, CornerUpRight, Trash2, Printer,
    RotateCw, ArrowUpDown
} from 'lucide-react';
import { ArchiveLevel } from '../../../../types';

interface VolumeActionsProps {
    selectedType: ArchiveLevel;
    selectedFileId: string | null;
    isCompiling: boolean;
    onStartCompiling: () => void;
    onEditMetadata: () => void;
    onAddVolume: () => void;
    onDeleteFile: () => void;
    onUpdatePageNumbers: () => void;
    onSortFiles: () => void;
}

const VolumeActions: React.FC<VolumeActionsProps> = ({
    selectedType,
    selectedFileId,
    isCompiling,
    onStartCompiling,
    onEditMetadata,
    onAddVolume,
    onDeleteFile,
    onUpdatePageNumbers,
    onSortFiles,
}) => {
    const getAttributeButtonLabel = () => {
        if (selectedFileId) return '文件元数据';
        if (selectedType === 'project') return '项目元数据';
        if (selectedType === 'engineering') return '工程元数据';
        if (selectedType === 'volume') return '案卷元数据';
        return '属性';
    };

    return (
        <div className="flex items-center gap-2">
            {/* Primary Actions */}
            <button 
                onClick={onStartCompiling}
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
                onClick={onEditMetadata}
                title="查看选中对象的属性"
            >
                <Settings className="w-4 h-4 mr-1.5" /> 
                {getAttributeButtonLabel()}
            </button>

            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

            <button 
                className="flex items-center px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-sm hover:bg-blue-100 transition-colors"
                onClick={onAddVolume}
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
                onClick={onDeleteFile}
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
                onClick={onUpdatePageNumbers}
                className="flex items-center px-4 py-1.5 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded text-sm hover:bg-yellow-100 transition-colors"
            >
                <RotateCw className="w-4 h-4 mr-1.5" /> 更新页次
            </button>
            <button 
                onClick={onSortFiles}
                className="flex items-center px-4 py-1.5 bg-white text-slate-600 border border-slate-200 rounded text-sm hover:bg-slate-50 transition-colors"
            >
                <ArrowUpDown className="w-4 h-4 mr-1.5" /> 更新排序
            </button>
        </div>
    );
};

export default VolumeActions;
