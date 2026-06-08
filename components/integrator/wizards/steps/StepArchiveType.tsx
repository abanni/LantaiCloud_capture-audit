import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ArchiveType } from '../constants';

interface StepArchiveTypeProps {
    filteredTypes: ArchiveType[];
    archiveName: string;
    useExternalArchive: boolean;
    onSelect: (typeId: string, hasChildren: boolean) => void;
    onBack: () => void;
}

const StepArchiveType: React.FC<StepArchiveTypeProps> = ({
    filteredTypes,
    archiveName,
    useExternalArchive,
    onSelect,
    onBack,
}) => {
    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-6">
                <div
                    className="inline-flex items-center gap-1 mb-2 px-2.5 py-1 bg-slate-100 rounded-full text-xs text-slate-500 cursor-pointer hover:bg-slate-200"
                    onClick={onBack}
                >
                    <ArrowLeft className="w-3 h-3" /> 返回上级：选择关联
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1.5">请选择档案大类</h3>
                <p className="text-slate-400 text-xs">
                    {useExternalArchive ? `正在加载【${archiveName}】所允许的接收类别规范` : '正使用本地兰台全景目录（无类型受限）'}
                </p>
            </div>
            <div className="grid grid-cols-3 gap-6">
                {filteredTypes.map((type) => (
                    <div
                        key={type.id}
                        onClick={() => {
                            const hasChildren = !!(type.children && type.children.length > 0);
                            onSelect(type.id, hasChildren);
                        }}
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-orange-400 hover:shadow-md cursor-pointer transition-all flex flex-col items-center text-center group"
                    >
                        <div className={`w-12 h-12 rounded-full ${type.bg} ${type.color} flex items-center justify-center mb-4.5 group-hover:scale-108 transition-transform`}>
                            <type.icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{type.label}</h4>
                        <p className="text-xs text-slate-400 font-normal">{type.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepArchiveType;
