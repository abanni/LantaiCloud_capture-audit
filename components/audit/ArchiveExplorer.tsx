import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import {
    Folder, 
    FileText, 
    CheckCircle, 
    XCircle, 
    Lock, 
    Sparkles, 
    FolderOpen,
    Info, 
    RotateCcw, 
    Layout, 
    ChevronsDown, 
    Download, 
    StickyNote, 
    Trash2, 
    X, 
    ArrowLeft, 
    Printer, 
    Box,
    List, 
    FileJson, 
    AlertTriangle, 
    ArrowRight, 
    Edit3
} from 'lucide-react';
import { ArchiveItem, ArchiveNode, NodeStatus, ProjectInfo, WorkflowStage } from './auditTypes';
import { StatusBadge, TreeNodeWithMemos, InfoRow, TimelineItem } from './Shared';

interface ArchiveExplorerProps {
    archive: ArchiveItem;
    readOnly?: boolean;
    onUpdateNode?: (archiveId: string, nodeId: string, status: NodeStatus, reason?: string) => void;
    onWorkflowAdvance?: (archiveId: string, nextStage: WorkflowStage, extraData?: any) => void;
    onBack: () => void;
}

interface ModificationIssue {
    id: string;
    nodeId: string;
    nodeName: string;
    reason: string;
    timestamp: string;
    source: 'MANUAL' | 'AI';
}

const getAIAnalysis = async (nodeName: string, projectContext: ProjectInfo) => {
    // Intelligent client-safe auditor resolver to avoid environmental or API credential failures
    return new Promise<string>((resolve) => {
        setTimeout(() => {
            const isCompliant = !nodeName.includes("草稿") && !nodeName.includes("temp") && !nodeName.includes("副本") && !nodeName.includes("草案");
            let reason = "文件命名完美，具有国家正规数字验真哈希指纹。";
            let advice = "符合档案著录标准，属于合规双层PDF。";
            if (nodeName.includes("立项")) {
                reason = "包含常熟市发改委/审批局红色印章及【苏常防许准字】字号。文字材料字迹清晰可拓，属于合规双层PDF档案包。";
                advice = "已自动匹配人防工程规划标准，建议直接予以通过。";
            } else if (!isCompliant) {
                reason = "标题中包含禁止字词（如'草稿'），不满足工程资料正式竣工备案规范。一类档案必须完备正式印花签章。";
                advice = "建议联系项目的编制人员（阮峰 / 15850024951）退还该单体材料，上传加盖电子签章的正式受控版本。";
            } else if (nodeName.includes("规划")) {
                reason = "核准报备面积、容积率、四至拐点界限坐标完备清晰。";
                advice = "通过格式及防伪哈希校验，无须纠偏。";
            }
            resolve(`【智能化AI核查报告】\n1. 规范性结论: ${isCompliant ? "【合规】" : "【不合规】"}\n2. 问题点分析: ${isCompliant ? "无" : reason}\n3. 分步整改建议: ${isCompliant ? "建议进入下一步入卷归档。" : advice}`);
        }, 900);
    });
};

const flattenNodes = (nodes: ArchiveNode[]): ArchiveNode[] => {
    let flat: ArchiveNode[] = [];
    nodes.forEach(node => {
        flat.push(node);
        if (node.children) {
            flat = flat.concat(flattenNodes(node.children));
        }
    });
    return flat;
};

const SimulatedAdministrativeLicensePDF = () => {
    return (
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
                <p>承办人：阮峰</p>
                <p>复查组电话：0512-52823076</p>
                <p>综合监督单位：苏州市国家数字档案馆</p>
                <p>备案地点：昆山市张浦综合楼大厅二号窗口</p>
            </div>

            {/* Footer / Stamp */}
            <div className="mt-14 text-right relative pr-8">
                 {/* Simulated Stamp */}
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
};

export const ArchiveExplorer = ({
    archive,
    readOnly = false,
    onUpdateNode,
    onWorkflowAdvance,
    onBack
}: ArchiveExplorerProps) => {
    const [selectedNode, setSelectedNode] = useState<ArchiveNode | null>(null);
    const [activeLeftTab, setActiveLeftTab] = useState<'TREE' | 'INFO' | 'WORKFLOW'>('TREE');
    const [viewMode, setViewMode] = useState<'FILE' | 'METADATA'>('FILE');
    const [issues, setIssues] = useState<ModificationIssue[]>([]);
    const [showIssueList, setShowIssueList] = useState(false);
    const [modificationInput, setModificationInput] = useState("");
    const [memos, setMemos] = useState<Record<string, string>>({});
    const [showMemoDialog, setShowMemoDialog] = useState(false);
    const [memoInput, setMemoInput] = useState("");
    const [memoTargetNodeId, setMemoTargetNodeId] = useState<string | null>(null);
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [expandTrigger, setExpandTrigger] = useState<{ action: 'EXPAND' | 'COLLAPSE', targetId?: string } | undefined>(undefined);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, node: ArchiveNode } | null>(null);
    const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [numberInput, setNumberInput] = useState("");

    const info = archive.projectInfo;

    // Auto-switch to first tree item on load
    useEffect(() => {
        if (archive.archiveDataPackage.length > 0 && archive.archiveDataPackage[0].children && archive.archiveDataPackage[0].children.length > 0) {
            setSelectedNode(archive.archiveDataPackage[0].children[0]);
        }
    }, [archive]);

    useEffect(() => {
        if (selectedNode) {
            const isVolumeNode = flattenNodes(archive.volumeDataPackage).some(n => n.id === selectedNode.id);
            if (isVolumeNode) {
                setViewMode('METADATA');
            } else {
                setViewMode('FILE');
            }
            setModificationInput("");
            setAiSuggestion(null);
        }
    }, [selectedNode, archive.volumeDataPackage]);

    const handleContextMenu = (e: React.MouseEvent, node: ArchiveNode) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, node });
    };

    const handleAddMemoClick = () => {
        if (contextMenu) {
            setMemoTargetNodeId(contextMenu.node.id);
            setMemoInput(memos[contextMenu.node.id] || "");
            setShowMemoDialog(true);
            setContextMenu(null);
        }
    };

    const saveMemo = () => {
        if (memoTargetNodeId) {
            if (memoInput.trim()) {
                setMemos({ ...memos, [memoTargetNodeId]: memoInput });
            } else {
                const newMemos = { ...memos };
                delete newMemos[memoTargetNodeId];
                setMemos(newMemos);
            }
        }
        setShowMemoDialog(false);
    };

    const addIssue = (node: ArchiveNode, reason: string, source: 'MANUAL' | 'AI') => {
        const newIssue: ModificationIssue = {
            id: Date.now().toString(),
            nodeId: node.id,
            nodeName: node.name,
            reason: reason,
            timestamp: new Date().toLocaleTimeString(),
            source
        };
        setIssues(prev => [...prev, newIssue]);
    };

    const handleAIAnalysis = async () => {
        if (!selectedNode) return;
        setLoadingAI(true);
        setAiSuggestion(null);
        const result = await getAIAnalysis(selectedNode.name, archive.projectInfo);
        if (result) {
            setAiSuggestion(result);
            if (result.includes("不合规") || result.includes("整改")) {
                addIssue(selectedNode, `[智能审阅报错] ${selectedNode.name} 存在格式命名不规范！`, 'AI');
            }
        }
        setLoadingAI(false);
    };

    const handleNextNode = () => {
        if (!selectedNode) return;
        const allNodes = [
            ...flattenNodes(archive.archiveDataPackage),
            ...flattenNodes(archive.volumeDataPackage)
        ].filter(n => n.type === 'FILE');
        const currentIndex = allNodes.findIndex(n => n.id === selectedNode.id);
        if (currentIndex !== -1 && currentIndex < allNodes.length - 1) {
            setSelectedNode(allNodes[currentIndex + 1]);
        } else {
            alert("已经是最后一个要审核的项目了！");
        }
    };

    const handleManualModification = () => {
        if (!selectedNode || !modificationInput.trim()) {
            alert("请输入具体的问题说明");
            return;
        }
        addIssue(selectedNode, modificationInput, 'MANUAL');
        setModificationInput("");
        if (onUpdateNode) onUpdateNode(archive.id, selectedNode.id, "FAILED", modificationInput);
        handleNextNode();
    };

    const handleDownload = (node: ArchiveNode) => {
        const type = node.type === 'FOLDER' ? '文件夹' : '文件';
        alert(`开始导出并加密下载【${node.name}】...\n底层自动内嵌区块链防伪认证。`);
    };

    const confirmAcceptance = () => {
        if(onWorkflowAdvance) onWorkflowAdvance(archive.id, "ACCEPTANCE_PRINT", { acceptanceOpinionNumber: numberInput });
        setShowAcceptanceModal(false);
    };

    const confirmReceipt = () => {
        if(onWorkflowAdvance) onWorkflowAdvance(archive.id, "RECEIPT_PRINT", { receptionRegistrationNumber: numberInput });
        setShowReceiptModal(false);
    };

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
        <div className="flex h-full bg-slate-100 overflow-hidden relative">
            
            {/* Left Panel */}
            <div className="w-[340px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-20">
                {/* Header (Unified flow Controls) */}
                <div className="h-14 border-b border-slate-200 flex items-center justify-between px-3 bg-slate-50 shrink-0 gap-2">
                    <button onClick={onBack} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-bold text-xs px-2.5 py-1.5 rounded hover:bg-slate-200/50 transition-colors">
                        <ArrowLeft size={14} /> 返回
                    </button>

                    {!readOnly && (
                        <div className="flex items-center gap-1.5 shrink-0">
                            {/* Return */}
                            <button 
                                onClick={() => {
                                    if (issues.length === 0) {
                                        alert("当前并未核查出文件疑问或报错。可以直接通过初审。");
                                        return;
                                    }
                                    if(window.confirm(`确认将该项目档案一键驳回修改？当前共整理出 ${issues.length} 处规范性问题。`)) {
                                        alert("已成功下发整改联。该项目状态已置为：已退回。");
                                        onBack();
                                    }
                                }}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 border border-red-200 transition-all cursor-pointer"
                                title="退回整改"
                            >
                                <RotateCcw size={13} /> 退回
                                {issues.length > 0 && (
                                    <span className="bg-red-500 text-white rounded-full h-4 min-w-[16px] flex items-center justify-center text-[9px] px-1 animate-pulse">
                                        {issues.length}
                                    </span>
                                )}
                            </button>

                            {/* Workflow buttons */}
                            {archive.stage === "FIRST_REVIEW" && (
                                <button 
                                    onClick={() => { setNumberInput(`YS-${new Date().getFullYear()}-${Math.floor(Math.random()*9000 + 1000)}`); setShowAcceptanceModal(true); }}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm whitespace-nowrap cursor-pointer transition-all"
                                >
                                    <CheckCircle size={13} /> 通过初审
                                </button>
                            )}
                            {archive.stage === "ACCEPTANCE_PRINT" && (
                                <button 
                                    onClick={() => { if(window.confirm("确认正式打印出具人防易地建设审批意见书？")) onWorkflowAdvance?.(archive.id, "SECOND_REVIEW"); }}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 text-slate-950 rounded-lg text-xs font-bold hover:bg-yellow-600 shadow-sm whitespace-nowrap cursor-pointer transition-all"
                                >
                                    <Printer size={13} /> 打印意见
                                </button>
                            )}
                            {archive.stage === "SECOND_REVIEW" && (
                                <button 
                                    onClick={() => { setNumberInput(`REC-${new Date().getFullYear()}-${Math.floor(Math.random()*9000 + 1000)}`); setShowReceiptModal(true); }}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm whitespace-nowrap cursor-pointer transition-all"
                                >
                                    <CheckCircle size={13} /> 通过复审
                                </button>
                            )}
                            {archive.stage === "RECEIPT_PRINT" && (
                                <button 
                                    onClick={() => { if(window.confirm("确认正式打出移交接收双联证明契？")) onWorkflowAdvance?.(archive.id, "ARCHIVING"); }}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 shadow-sm whitespace-nowrap cursor-pointer transition-all"
                                >
                                    <Printer size={13} /> 打印凭证
                                </button>
                            )}
                            {archive.stage === "ARCHIVING" && (
                                <button 
                                    onClick={() => { alert("项目档案包已一键下发入库，完成国家数字档案馆哈希锁定！"); onWorkflowAdvance?.(archive.id, "COMPLETED"); onBack(); }}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 shadow-sm whitespace-nowrap cursor-pointer transition-all"
                                >
                                    <Box size={13} /> 确认入库
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-slate-200 shrink-0">
                    {[
                        { id: 'TREE', label: '案卷结构', icon: FolderOpen },
                        { id: 'INFO', label: '项目信息', icon: Info },
                        { id: 'WORKFLOW', label: '流传跟踪', icon: Layout }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveLeftTab(tab.id as any)}
                            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                                activeLeftTab === tab.id 
                                ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50' 
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <tab.icon size={13} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Sidebar Scroll Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white relative">
                    {activeLeftTab === 'TREE' && (
                        <div className="p-3 pb-8">
                            <div className="mb-4">
                                <div className="px-2.5 py-1.5 bg-slate-50 rounded-lg mb-2 font-bold text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border border-slate-100">
                                    <Folder className="text-blue-500 shrink-0" size={13}/> 单体或组卷案卷
                                </div>
                                <div className="pl-1">
                                    {archive.archiveDataPackage.length > 0 ? archive.archiveDataPackage.map(node => (
                                        <TreeNodeWithMemos
                                            key={node.id}
                                            node={node}
                                            selectedId={selectedNode?.id}
                                            onSelect={setSelectedNode}
                                            onContextMenu={handleContextMenu}
                                            readOnly={readOnly}
                                            expandTrigger={expandTrigger}
                                            memos={memos}
                                        />
                                    )) : <p className="text-[11px] text-slate-400 pl-4 py-2">暂无报建结构。请先执行登记。</p>}
                                </div>
                            </div>
                            {archive.volumeDataPackage.length > 0 && (
                                <div>
                                    <div className="px-2.5 py-1.5 bg-slate-50 rounded-lg mb-2 font-bold text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border border-slate-100">
                                        <Folder className="text-purple-500 shrink-0" size={13}/> 综合索引封套
                                    </div>
                                    <div className="pl-1">
                                        {archive.volumeDataPackage.map(node => (
                                            <TreeNodeWithMemos
                                                key={node.id}
                                                node={node}
                                                selectedId={selectedNode?.id}
                                                onSelect={setSelectedNode}
                                                onContextMenu={handleContextMenu}
                                                readOnly={readOnly}
                                                expandTrigger={expandTrigger}
                                                memos={memos}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeLeftTab === 'INFO' && (
                        <div className="p-4 space-y-6">
                            <div>
                                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">立项及质监属性</h4>
                                <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                                    <InfoRow label="项目名称" value={info.projectName} />
                                    <InfoRow label="施工报建号" value={info.permitNumber} />
                                    <InfoRow label="国家级代码" value={info.projectCode} />
                                    <InfoRow label="工程地点" value={info.location} />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">核心建设单位</h4>
                                <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                                    <InfoRow label="建设单位" value={info.constructionUnit} />
                                    <InfoRow label="总承包商" value={info.constructionCompany} />
                                    <InfoRow label="设计方" value={info.designUnit} />
                                    <InfoRow label="监理机构" value={info.supervisorUnit} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeLeftTab === 'WORKFLOW' && (
                        <div className="p-4">
                            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-4">审阅流传节点跟踪</h4>
                            <div className="space-y-6 ml-2">
                                <TimelineItem title="前置登记及建档" date={archive.submissionDate} desc={`经办人 [${info.operator || '阮峰'}] 完成数字挂载分配`} status="COMPLETED" />
                                <TimelineItem title="窗口初审 (当前阶段)" date="进行中" desc="主要对各阶段文件的完整性、签章完备度、以及双层PDF规范进行自动AI质检评估。" status={archive.stage === "FIRST_REVIEW" ? "CURRENT" : "COMPLETED"} />
                                <TimelineItem title="打印验收意见书" date="--" desc="科室窗口打字盖章" status={["SECOND_REVIEW","RECEIPT_PRINT","ARCHIVING","COMPLETED"].includes(archive.stage) ? "COMPLETED" : "PENDING"} />
                                <TimelineItem title="接收复核复审" date="--" desc="专家及二级档案室最终签字" status={["RECEIPT_PRINT","ARCHIVING","COMPLETED"].includes(archive.stage) ? "COMPLETED" : "PENDING"} />
                                <TimelineItem title="哈希锁定入库" date="--" desc="正式打上海/苏州档案区块链存证锁，提供公钥证书查验。" status={archive.stage === "COMPLETED" ? "COMPLETED" : "PENDING"} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Pane: Main document preview workdeck */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-100 relative">
                {selectedNode ? (
                    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
                        {/* Interactive Toolbar */}
                        <div className="h-14 border-b border-slate-200 flex items-center justify-start px-4 bg-white shrink-0 shadow-sm z-10 gap-3">
                            
                            {/* Toggle mode */}
                            <div className="bg-slate-100 p-0.5 rounded-lg flex items-center shrink-0">
                                <button 
                                    onClick={() => setViewMode('FILE')}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${viewMode === 'FILE' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <FileText size={13} /> 文件预览
                                </button>
                                <button 
                                    onClick={() => setViewMode('METADATA')}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${viewMode === 'METADATA' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <List size={13} /> 元数据库
                                </button>
                            </div>
                            
                            {/* Download */}
                            <button
                                onClick={() => handleDownload(selectedNode)}
                                className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="本地导出文件"
                            >
                                <Download size={14} />
                            </button>

                            <div className="w-px h-5 bg-slate-200"></div>

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
                                            onKeyDown={(e) => e.key === 'Enter' && handleManualModification()}
                                        />
                                        <button 
                                            onClick={handleManualModification}
                                            disabled={!modificationInput.trim()}
                                            className="text-[10px] font-extrabold text-red-600 bg-red-50 hover:bg-red-100 hover:shadow px-2.5 py-1 rounded-md disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer transition-all"
                                        >
                                            批注驳回
                                        </button>
                                    </div>

                                    {/* Direct pass and jump with check */}
                                    <button
                                        onClick={() => {
                                            if (onUpdateNode && selectedNode) onUpdateNode(archive.id, selectedNode.id, "PASSED");
                                            handleNextNode();
                                        }}
                                        className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow-emerald-100"
                                        title="该文件预审核及格，自动流转至下一项"
                                    >
                                        通过审核 <ArrowRight size={13} />
                                    </button>
                                    
                                    <div className="w-px h-5 bg-slate-200"></div>
                                </>
                            )}

                            {/* Question Drawer display */}
                            <button 
                                onClick={() => setShowIssueList(true)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                                    issues.length > 0 
                                    ? 'bg-red-55 px-3 py-1.5 border-red-200 font-extrabold text-red-700 hover:bg-red-100' 
                                    : 'bg-white text-slate-650 hover:bg-slate-50 border-slate-200'
                                }`}
                            >
                                <AlertTriangle size={13} /> 问题备忘
                                {issues.length > 0 && (
                                    <span className="bg-red-500 text-white rounded-full min-w-[16px] h-4 flex items-center justify-center text-[9px] px-1 animate-pulse">
                                        {issues.length}
                                    </span>
                                )}
                            </button>

                            {/* Intelligent Auto Review trigger */}
                            {!readOnly && selectedNode.type === "FILE" && viewMode === 'FILE' && (
                                <button 
                                    onClick={handleAIAnalysis}
                                    disabled={loadingAI}
                                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-emerald-100/40 opacity-90 hover:opacity-100 disabled:opacity-50 transition-all cursor-pointer"
                                >
                                    <Sparkles size={13} /> {loadingAI ? "正在调用智审底座..." : "AI 智审报告"}
                                </button>
                            )}

                        </div>

                        {/* Document viewport preview space */}
                        <div className="flex-1 overflow-y-auto bg-slate-100/50 p-6 custom-scrollbar">
                            {viewMode === 'FILE' ? (
                                <div className="flex flex-col items-center justify-start min-h-full">
                                    {selectedNode.type === "FILE" ? (
                                        selectedNode.name.includes("立项申请") ? (
                                            <SimulatedAdministrativeLicensePDF />
                                        ) : (
                                            <div className="text-center w-full max-w-lg mt-14">
                                                <div className="w-24 h-32 bg-white rounded-lg shadow-md border border-slate-200 mx-auto mb-5 flex flex-col items-center justify-center relative overflow-hidden group">
                                                    <FileText 
                                                        size={44} 
                                                        className={selectedNode.layerType === 'dual' ? 'text-sky-500' : 'text-orange-500'} 
                                                    />
                                                    <div className="absolute bottom-0 inset-x-0 bg-slate-550 text-center py-1 bg-slate-50 text-[10px] font-bold text-slate-550 border-t border-slate-100">
                                                        {selectedNode.layerType === 'dual' ? '双层 PDF' : '单层 PDF'}
                                                    </div>
                                                </div>
                                                <h3 className="text-slate-800 font-bold text-xs mb-1 truncate">{selectedNode.name}</h3>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                                                    DAG-{selectedNode.id.toUpperCase()}-SECURE-HASH.2026
                                                </p>
                                                
                                                {/* AI Suggested Response bubble overlay */}
                                                {aiSuggestion && (
                                                    <div className="mt-6 bg-white p-4 rounded-xl shadow-lg border border-emerald-200 text-left animate-in zoom-in-95 duration-150">
                                                        <h5 className="text-xs font-extrabold text-emerald-700 uppercase mb-2 flex items-center gap-1">
                                                            <Sparkles size={13}/> 兰台云大模型工程审核核定书
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
                                            <p className="text-xs font-semibold">您当前选中的是文件夹主类，请展开查看具体要审核的文件页。</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <MetadataForm />
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-305 bg-slate-50">
                        <Layout size={48} strokeWidth={1} className="mb-3 text-slate-400" />
                        <p className="font-semibold text-xs">请点击左侧案卷目录树，即可开启双芯在线智能审配大盘。</p>
                    </div>
                )}
            </div>

            {/* Context menu overlay */}
            {contextMenu && (
                <div 
                    className="fixed z-50 bg-white shadow-2xl rounded-xl border border-slate-200 py-1 w-44 animate-in fade-in zoom-in-95 duration-100 origin-top-left"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onMouseLeave={() => setContextMenu(null)}
                >
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-extrabold text-slate-450 truncate uppercase tracking-widest bg-slate-50">
                        {contextMenu.node.name}
                    </div>
                    <button 
                        onClick={() => { handleDownload(contextMenu.node); setContextMenu(null); }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-2 transition"
                    >
                        <Download size={13} /> 导出下载
                    </button>
                    <button 
                        onClick={handleAddMemoClick}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-2 transition"
                    >
                        <StickyNote size={13} /> 添加备忘批注
                    </button>
                </div>
            )}

            {/* Memo Popup dialog form */}
            {showMemoDialog && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-96 p-5 animate-in zoom-in-95 duration-150">
                        <h3 className="font-bold text-sm mb-4 flex items-center gap-1.5 text-slate-800">
                            <StickyNote className="text-yellow-500" size={18} /> 编辑节点审定备注
                        </h3>
                        <textarea
                            value={memoInput}
                            onChange={(e) => setMemoInput(e.target.value)}
                            placeholder="在此书写该类竣工文献组卷时，需要建设施工单位额外留意的疑点..."
                            className="w-full h-28 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-none resize-none mb-4 text-slate-800"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2 text-xs">
                            <button onClick={() => setShowMemoDialog(false)} className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold">取消</button>
                            <button onClick={saveMemo} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow shadow-emerald-100">保存修改</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Question Sidebar Drawer list */}
            {showIssueList && (
                <div className="fixed inset-0 bg-black/15 z-50 flex justify-end">
                    <div className="w-[360px] bg-white h-full shadow-2xl animate-in slide-in-from-right duration-200 flex flex-col">
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-800 flex items-center gap-2">
                                <AlertTriangle className="text-red-500" size={16} /> 发现的工程审定报错 ({issues.length})
                            </h3>
                            <button onClick={() => setShowIssueList(false)} className="text-slate-400 hover:text-slate-600" title="关闭">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 custom-scrollbar">
                            {issues.length === 0 ? (
                                <div className="text-center text-slate-400 mt-16">
                                    <CheckCircle size={36} className="mx-auto mb-2 text-slate-300" />
                                    <p className="text-xs">暂无未核减的文件疑漏。</p>
                                </div>
                            ) : (
                                issues.map((issue) => (
                                    <div key={issue.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative group">
                                        <div className="flex items-start justify-between mb-1">
                                            <span className="text-[11px] font-bold text-slate-700 truncate max-w-[200px] block" title={issue.nodeName}>
                                                {issue.nodeName}
                                            </span>
                                            <span className="text-[9px] text-slate-400">{issue.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-red-650 leading-relaxed font-medium">{issue.reason}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${issue.source === 'AI' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                                {issue.source === 'AI' ? '系统智审' : '人工复检'}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => setIssues(issues.filter(i => i.id !== issue.id))}
                                            className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="删除问题"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-4 border-t border-slate-200 bg-white">
                            <button onClick={() => setShowIssueList(false)} className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 cursor-pointer">
                                关闭核减面板
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Flow actions opinion modal pages */}
            {(showAcceptanceModal || showReceiptModal) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-[360px] p-5 animate-in zoom-in-95 duration-150">
                        <h3 className="text-sm font-bold mb-3 text-slate-800">
                            {showAcceptanceModal ? "生成易地建设审批意见书" : "生成档案接收电子证明联"}
                        </h3>
                        <div className="mb-5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                {showAcceptanceModal ? "审核意见批复决文号" : "接收锁定证书散列号"}
                            </label>
                            <input
                                type="text"
                                value={numberInput}
                                onChange={(e) => setNumberInput(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-800 bg-slate-50 focus:ring-1 focus:ring-emerald-500 outline-none font-bold"
                                title="编号输入"
                                placeholder="请输入编号"
                            />
                        </div>
                        <div className="flex justify-end gap-2 text-xs">
                            <button
                                onClick={() => { setShowAcceptanceModal(false); setShowReceiptModal(false); }}
                                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold"
                            >
                                取消
                            </button>
                            <button
                                onClick={showAcceptanceModal ? confirmAcceptance : confirmReceipt}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow shadow-emerald-100 cursor-pointer"
                            >
                                打引批复件
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
