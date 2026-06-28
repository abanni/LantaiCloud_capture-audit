import React from 'react';
import { BookOpen, FileText, HelpCircle, CheckCircle } from 'lucide-react';

export const ArchiveGuidance = () => {
    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-sm font-bold mb-4 text-slate-800 flex items-center gap-2">
                        <FileText size={16} className="text-emerald-600"/>
                        国家标准移交组卷基本标准汇总
                    </h3>
                    <ul className="space-y-4 text-slate-650 text-xs leading-relaxed">
                        <li className="flex items-start gap-2 border-b border-slate-50 pb-2">
                            <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span><strong>组卷厚度界限:</strong> 专业图纸包不宜超40mm，文字一类综合立卷案卷厚度硬性控制在20mm以内。</span>
                        </li>
                        <li className="flex items-start gap-2 border-b border-slate-50 pb-2">
                            <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span><strong>页号标记章印:</strong> 卷内文件需逐页编写页号，一律使用黑色碳素水笔，在页角右下方标写，不得漏编或跳页。</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span><strong>双层PDF标准:</strong> 严格遵守GB/T 33190国标，图像辨别度不应低于300DPI，电子签名哈希与物理印章哈希具有等效法律认定力。</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-sm font-bold mb-4 text-slate-800 flex items-center gap-2">
                        <HelpCircle size={16} className="text-orange-500"/>
                        大厅窗口常见疑难问答解答 (FAQ)
                    </h3>
                    <div className="space-y-3">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="font-bold text-xs text-slate-800 mb-1">Q: 单体工程及施工日志是否需要编制独立档号？</p>
                            <p className="text-slate-600 text-[11px] leading-relaxed">A: 施工日志原则上不单独编号，通常与质量记录合并放置于C类案卷进行整体数字化归目建卷。</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="font-bold text-xs text-slate-800 mb-1">Q: 文件审批中的人防异地审批费等数据需要写入元数据吗？</p>
                            <p className="text-slate-600 text-[11px] leading-relaxed">A: 是的，在元数据报建属性、工程预算造价等要素中必须如实回填，由窗口审计专家二次核减校验。</p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};
