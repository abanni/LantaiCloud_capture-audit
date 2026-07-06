import React from 'react';
import { GoogleGenAI } from '@google/genai';
import {
    FileText,
    FileJson,
    List,
    Download,
    Edit3,
    ArrowRight,
    AlertTriangle,
    Sparkles,
    FolderOpen,
    CheckCircle,
    XCircle,
    Lock,
    StickyNote,
} from 'lucide-react';
import { ArchiveNode, NodeStatus, ProjectInfo } from '../auditTypes';
import { ArchiveItem } from '../auditTypes';

interface ModificationIssue {
    id: string;
    nodeId: string;
    nodeName: string;
    reason: string;
    timestamp: string;
    source: 'MANUAL' | 'AI';
}

interface NodeDetailProps {
    selectedNode: ArchiveNode;
    archive: ArchiveItem;
    readOnly: boolean;
    onUpdateNode?: (archiveId: string, nodeId: string, status: NodeStatus, reason?: string) => void;
    viewMode: 'FILE' | 'METADATA';
    setViewMode: (mode: 'FILE' | 'METADATA') => void;
    modificationInput: string;
    setModificationInput: (val: string) => void;
    aiSuggestion: string | null;
    loadingAI: boolean;
    onAIAnalysis: () => void;
    onManualModification: () => void;
    onPassAndNext: () => void;
    onDownload: (node: ArchiveNode) => void;
    issuesLength: number;
    onShowIssues: () => void;
    metadataContent?: React.ReactNode;
}

export const NodeDetail: React.FC<NodeDetailProps> = ({
    selectedNode,
    archive,
    readOnly,
    onUpdateNode,
    viewMode,
    setViewMode,
    modificationInput,
    setModificationInput,
    aiSuggestion,
    loadingAI,
    onAIAnalysis,
    onManualModification,
    onPassAndNext,
    onDownload,
    issuesLength,
    onShowIssues,
    metadataContent,
}) => {
    const SimulatedAdministrativeLicensePDF = () => (
        <div className="bg-white w-full max-w-[720px] min-h-[960px] shadow-lg mx-auto p-12 relative text-slate-800 font-serif leading-relaxed select-text print:shadow-none border border-slate-200 rounded-lg">
            {/* Header */}
            <div className="text-center mb-8 space-y-3">
                <h1 className="text-2xl font-bold tracking-widest text-red-600 font-serif">常熟市行政审批局</h1>
                <h2 className="text-3xl font-bold mt-6 mb-3 font-serif tracking-normal text-slate-900">准予行政许可决定书</h2>
                <p className="text-right text-xs font-sans text-slate-500">苏常防许准字 [2025] 第 084 号</p>
            </div>

            {/* Recipient */}
            <div className="mb-6">
                <p className="font-bold underline underline-offset-4 decoration-slate-400 text-sm">昆山高新技术产业开发区管理委员会：</p>
            </div>

            {/* Body */}
            <div className="space-y-4 text-sm text-justify indent-8 font-serif leading-7 text-slate-800">
                <p>
                    你单位于 <span className="underline decoration-dotted underline-offset-4 font-sans px-1">2025</span> 年 <span className="underline decoration-dotted underline-offset-4 font-sans px-1">11</span> 月 <span className="underline decoration-dotted underline-offset-4 font-sans px-1">15</span> 日提出的关于 <span className="font-bold text-slate-950">生命健康产业园配套检测中心项目易地建设审批</span>行政许可申请，本机关已于 <span className="underline decoration-dotted underline-offset-4 font-sans px-1">2025</span> 年 <span className="underline decoration-dotted underline-offset-4 font-sans px-1">11</span> 月 <span className="underline decoration-dotted underline-offset-4 font-sans px-1">16</span> 日受理（受理通知书编号：苏常防许受字 [2025] 第 1029 号）。经技术科审查：<span className="font-bold block md:inline text-blue-800 bg-blue-50/50 px-1 rounded border border-blue-100">该项目档案构成件符合昆山及苏州市工程规划法规条件和标准</span>。
                </p>
                <p>
                    依照《中华人民共和国行政许可法》第三十八条第一款、苏防规[2022] 2 号文件防空地下室的易地建设审批标准，经人防档案馆审查核对，该项目的各套件图解及施工会审图谱签署承诺无误。建设单位按照国家规定缴纳易地建设费后，由人防主管部门进行易地修建和维护管理。本机关原则同意你单位<span className="font-bold">人防工程易地建设准批许可</span>。
                </p>
                <p>
                    核准本项目应建人防工程面积 14520.5 m² x 6% = 871.23 m²，收缴易地建设费已划入专户登记。在项目竣工交付后两周内，建设单位应主动配合档案大厅进行最终数字化双层实测图纸入卷登记。
                </p>
                <p>
                    本行政许可有效期自 <span className="underline decoration-dotted underline-offset-4 font-sans px-1">2025</span> 年 <span className="underline decoration-dotted underline-offset-4 font-sans px-1">11</span> 月 <span className="underline decoration-dotted underline-offset-4 font-sans px-1">20</span> 日至 <span className="underline decoration-dotted underline-offset-4 font-sans px-1">2026</span> 年 <span className="underline decoration-dotted underline-offset-4 font-sans px-1">11</span> 月 <span className="underline decoration-dotted underline-offset-4 font-sans px-1">19</span> 日。
                </p>
            </div>

            {/* Foot Contact */}
            <div className="mt-10 space-y-1 text-xs ml-4 text-slate-500 font-sans">
                <p>承办人：岑源</p>
                <p>复查组电话：0512-52823076</p>
                <p>综合监督单位：苏州市国家数字档案馆</p>
                <p>备案地点：昆山市张浦综合楼大厅二号窗口</p>
            </div>

            {/* Footer / Stamp */}
            <div className="mt-14 text-right relative pr-8">
                <div className="absolute right-4 -top-10 opacity-80 pointer-events-none select-none">
                    <div className="w-32 h-32 border-4 border-red-500 rounded-full flex items-center justify-center p-1.5 transform rotate-[-8deg] shadow-sm">
                        <div className="w-full h-full border border-red-500 rounded-full flex items-center justify-center relative bg-white/20">
                            <span className="text-red-500 font-bold text-[8px] absolute top-2 leading-none uppercase pr-0.5 scale-90">常熟市行政审批局</span>
                            <span className="text-red-500 font-bold text-xs leading-tight text-center">行政许可<br/>专用章</span>
                            <span className="text-red-500 text-[7px] absolute bottom-2 font-mono scale-90">3205810092831</span>
                            <span className="text-red-500 text-sm absolute bottom-9">★</span>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 font-bold text-sm">
                    <p className="text-slate-900 font-semibold text-base">常熟市行政审批局</p>
                    <p className="mt-2 text-xs font-sans text-slate-550">2025 年 11 月 20 日</p>
                </div>
            </div>
        </div>
    );

    const MetadataForm = () => (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3 uppercase tracking-wider">
                    <FileJson className="text-purple-500" size={18} /> 案卷元数据基本属性 (GB/T 11822)
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">卷内文件题名</label>
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 font-bold">
                            {selectedNode?.name}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">系统分配档号</label>
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 font-mono font-bold">
                            DAG-{archive.id.substring(0,6).toUpperCase()}-2026
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">主要责任主体</label>
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800">
                            {archive.projectInfo.constructionUnit}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">文件形成日期</label>
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800">
                            {archive.submissionDate.split(' ')[0]}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">原始密级</label>
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800">
                            内部受控 (限阅)
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">载体页次/页数</label>
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 font-mono">
                            共 4 页 (数字化生成)
                        </div>
                    </div>
                    <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">内容提要 (Abstract)</label>
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 min-h-[60px] leading-relaxed">
                            该材料属于项目确权阶段的核心报建审查原稿，包括该子项在规划大厅的预受理红线图、专家终审技术意见书以及加章电子回执。
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-slate-100 relative">
            {selectedNode ? (
                <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
                    {/* Interactive Toolbar */}
                    <div className="h-14 border-b border-slate-200 flex items-center justify-start px-4 bg-white shrink-0 shadow-sm z-10 gap-3">
                        {/* Toggle mode */}
                        <div className="bg-slate-100 p-0.5 rounded-lg flex items-center shrink-0">
                            <button
                                onClick={() => setViewMode('FILE')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
                                    viewMode === 'FILE'
                                        ? 'bg-white text-emerald-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <FileText size={13} /> 文件预览
                            </button>
                            <button
                                onClick={() => setViewMode('METADATA')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
                                    viewMode === 'METADATA'
                                        ? 'bg-white text-purple-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <List size={13} /> 元数据库
                            </button>
                        </div>

                        {/* Download */}
                        <button
                            onClick={() => onDownload(selectedNode)}
                            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="本地导出文件"
                        >
                            <Download size={14} />
                        </button>

                        <div className="w-px h-5 bg-slate-200" />

                        {/* Manual review controls */}
                        {!readOnly && (
                            <>
                                <div className="flex items-center gap-2 bg-slate-100 rounded-lg border border-slate-205 px-2.5 py-1 w-96 max-w-lg transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-300">
                                    <Edit3 size={13} className="text-slate-400 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="在此撰写需要退回的修改意见..."
                                        value={modificationInput}
                                        onChange={(e) => setModificationInput(e.target.value)}
                                        className="flex-1 bg-transparent border-none text-xs focus:ring-0 py-0.5 placeholder:text-slate-400 outline-none"
                                        onKeyDown={(e) => e.key === 'Enter' && onManualModification()}
                                    />
                                    <button
                                        onClick={onManualModification}
                                        disabled={!modificationInput.trim()}
                                        className="text-[10px] font-extrabold text-red-600 bg-red-50 hover:bg-red-100 hover:shadow px-2.5 py-1 rounded-md disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer transition-all"
                                    >
                                        批注驳回
                                    </button>
                                </div>

                                <button
                                    onClick={onPassAndNext}
                                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow-emerald-100"
                                    title="该文件预审核及格，自动流转至下一项"
                                >
                                    通过审核 <ArrowRight size={13} />
                                </button>

                                <div className="w-px h-5 bg-slate-200" />
                            </>
                        )}

                        {/* Question Drawer display */}
                        <button
                            onClick={onShowIssues}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                                issuesLength > 0
                                    ? 'bg-red-55 px-3 py-1.5 border-red-200 font-extrabold text-red-700 hover:bg-red-100'
                                    : 'bg-white text-slate-650 hover:bg-slate-50 border-slate-200'
                            }`}
                        >
                            <AlertTriangle size={13} /> 问题备忘
                            {issuesLength > 0 && (
                                <span className="bg-red-500 text-white rounded-full min-w-[16px] h-4 flex items-center justify-center text-[9px] px-1 animate-pulse">
                                    {issuesLength}
                                </span>
                            )}
                        </button>

                        {/* Intelligent Auto Review trigger */}
                        {!readOnly && selectedNode.type === 'FILE' && viewMode === 'FILE' && (
                            <button
                                onClick={onAIAnalysis}
                                disabled={loadingAI}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-emerald-100/40 opacity-90 hover:opacity-100 disabled:opacity-50 transition-all cursor-pointer"
                            >
                                <Sparkles size={13} />{' '}
                                {loadingAI ? '正在调用智审底座...' : 'AI 智审报告'}
                            </button>
                        )}
                    </div>

                    {/* Document viewport preview space */}
                    <div className="flex-1 overflow-y-auto bg-slate-100/50 p-6 custom-scrollbar">
                        {viewMode === 'FILE' ? (
                            <div className="flex flex-col items-center justify-start min-h-full">
                                {selectedNode.type === 'FILE' ? (
                                    selectedNode.name.includes('立项申请') ? (
                                        <SimulatedAdministrativeLicensePDF />
                                    ) : (
                                        <div className="text-center w-full max-w-lg mt-14">
                                            <div className="w-24 h-32 bg-white rounded-lg shadow-md border border-slate-200 mx-auto mb-5 flex flex-col items-center justify-center relative overflow-hidden group">
                                                <FileText
                                                    size={44}
                                                    className={
                                                        selectedNode.layerType === 'dual'
                                                            ? 'text-sky-500'
                                                            : 'text-orange-500'
                                                    }
                                                />
                                                <div className="absolute bottom-0 inset-x-0 bg-slate-550 text-center py-1 bg-slate-50 text-[10px] font-bold text-slate-550 border-t border-slate-100">
                                                    {selectedNode.layerType === 'dual' ? '双层 PDF' : '单层 PDF'}
                                                </div>
                                            </div>
                                            <h3 className="text-slate-800 font-bold text-xs mb-1 truncate">
                                                {selectedNode.name}
                                            </h3>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                                                DAG-{selectedNode.id.toUpperCase()}-SECURE-HASH.2026
                                            </p>

                                            {/* AI Suggested Response bubble overlay */}
                                            {aiSuggestion && (
                                                <div className="mt-6 bg-white p-4 rounded-xl shadow-lg border border-emerald-200 text-left animate-in zoom-in-95 duration-150">
                                                    <h5 className="text-xs font-extrabold text-emerald-700 uppercase mb-2 flex items-center gap-1">
                                                        <Sparkles size={13} /> 兰台云大模型工程审核核定书
                                                    </h5>
                                                    <p className="text-[11px] text-slate-705 leading-relaxed whitespace-pre-wrap font-sans">
                                                        {aiSuggestion}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center text-slate-400 mt-20">
                                        <FolderOpen size={48} className="mx-auto mb-3 opacity-40 text-blue-500" />
                                        <p className="text-xs font-semibold">
                                            您当前选中的是文件夹主类，请展开查看具体要审核的文件页。
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            metadataContent || <MetadataForm />
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-305 bg-slate-50">
                    <FolderOpen size={48} strokeWidth={1} className="mb-3 text-slate-400" />
                    <p className="font-semibold text-xs">请点击左侧案卷目录树，即可开启双芯在线智能审配大盘。</p>
                </div>
            )}
        </div>
    );
};
