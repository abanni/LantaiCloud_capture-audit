import React from 'react';
import { ArrowLeft, ChevronRight, FileBadge } from 'lucide-react';
import { ArchiveType } from '../constants';

interface StepSubTypeProps {
    activeTypeObj: ArchiveType;
    onSelect: (subTypeId: string) => void;
    onBack: () => void;
}

const StepSubType: React.FC<StepSubTypeProps> = ({ activeTypeObj, onSelect, onBack }) => {
    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-6">
                <div
                    className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 bg-slate-100 rounded-full text-xs text-slate-500 cursor-pointer hover:bg-slate-200"
                    onClick={onBack}
                >
                    <ArrowLeft className="w-3 h-3" /> 返回上级：{activeTypeObj.label}
                </div>
                <h3 className="text-lg font-bold text-slate-800">请选择子类别</h3>
                <p className="text-slate-400 text-xs">进一步细分类型以适配接收元数据规范</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
                {activeTypeObj.children!.map((sub) => (
                    <div
                        key={sub.id}
                        onClick={() => onSelect(sub.id)}
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-orange-400 hover:shadow-md cursor-pointer transition-all flex items-center group animate-in zoom-in-95 duration-200"
                    >
                        <div className={`w-10 h-10 rounded-full ${activeTypeObj.bg} ${activeTypeObj.color} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0`}>
                            <FileBadge className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold text-slate-800 text-sm leading-tight">{sub.label}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">立项进行档案采集</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-primary transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepSubType;
