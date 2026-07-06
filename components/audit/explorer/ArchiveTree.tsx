import React from 'react';
import {
    Folder,
    Info,
    Layout,
    FolderOpen,
    ArrowLeft,
    RotateCcw,
    CheckCircle,
    Printer,
    Box,
} from 'lucide-react';
import { ArchiveItem, ArchiveNode, WorkflowStage } from '../auditTypes';
import { TreeNodeWithMemos, InfoRow, TimelineItem } from '../Shared';

interface ArchiveTreeProps {
    archive: ArchiveItem;
    readOnly: boolean;
    selectedNode: ArchiveNode | null;
    onSelectNode: (node: ArchiveNode) => void;
    onContextMenu: (e: React.MouseEvent, node: ArchiveNode) => void;
    expandTrigger: { action: 'EXPAND' | 'COLLAPSE'; targetId?: string } | undefined;
    memos: Record<string, string>;
    onBack: () => void;
    activeLeftTab: 'TREE' | 'INFO' | 'WORKFLOW';
    setActiveLeftTab: (tab: 'TREE' | 'INFO' | 'WORKFLOW') => void;
    info: ArchiveItem['projectInfo'];
    stage: WorkflowStage;
    onWorkflowAdvance?: (archiveId: string, nextStage: WorkflowStage, extraData?: any) => void;
    issuesLength: number;
    onReturnReject: () => void;
    onAcceptanceClick: () => void;
    onReceiptClick: () => void;
}

export const ArchiveTree: React.FC<ArchiveTreeProps> = ({
    archive,
    readOnly,
    selectedNode,
    onSelectNode,
    onContextMenu,
    expandTrigger,
    memos,
    onBack,
    activeLeftTab,
    setActiveLeftTab,
    info,
    stage,
    onWorkflowAdvance,
    issuesLength,
    onReturnReject,
    onAcceptanceClick,
    onReceiptClick,
}) => {
    return (
        <div className="w-[340px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-20">
            {/* Header (Unified flow Controls) */}
            <div className="h-14 border-b border-slate-200 flex items-center justify-between px-3 bg-slate-50 shrink-0 gap-2">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-bold text-xs px-2.5 py-1.5 rounded hover:bg-slate-200/50 transition-colors"
                >
                    <ArrowLeft size={14} /> 返回
                </button>

                {!readOnly && (
                    <div className="flex items-center gap-1.5 shrink-0">
                        <button
                            onClick={onReturnReject}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 border border-red-200 transition-all cursor-pointer"
                            title="退回整改"
                        >
                            <RotateCcw size={13} /> 退回
                            {issuesLength > 0 && (
                                <span className="bg-red-500 text-white rounded-full h-4 min-w-[16px] flex items-center justify-center text-[9px] px-1 animate-pulse">
                                    {issuesLength}
                                </span>
                            )}
                        </button>

                        {stage === 'FIRST_REVIEW' && (
                            <button
                                onClick={onAcceptanceClick}
                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm whitespace-nowrap cursor-pointer transition-all"
                            >
                                <CheckCircle size={13} /> 通过初审
                            </button>
                        )}
                        {stage === 'ACCEPTANCE_PRINT' && (
                            <button
                                onClick={() => {
                                    if (window.confirm('确认正式打印出具人防易地建设审批意见书？'))
                                        onWorkflowAdvance?.(archive.id, 'SECOND_REVIEW');
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 text-slate-950 rounded-lg text-xs font-bold hover:bg-yellow-600 shadow-sm whitespace-nowrap cursor-pointer transition-all"
                            >
                                <Printer size={13} /> 打印意见
                            </button>
                        )}
                        {stage === 'SECOND_REVIEW' && (
                            <button
                                onClick={onReceiptClick}
                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm whitespace-nowrap cursor-pointer transition-all"
                            >
                                <CheckCircle size={13} /> 通过复审
                            </button>
                        )}
                        {stage === 'RECEIPT_PRINT' && (
                            <button
                                onClick={() => {
                                    if (window.confirm('确认正式打出移交接收双联证明契？'))
                                        onWorkflowAdvance?.(archive.id, 'ARCHIVING');
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 shadow-sm whitespace-nowrap cursor-pointer transition-all"
                            >
                                <Printer size={13} /> 打印凭证
                            </button>
                        )}
                        {stage === 'ARCHIVING' && (
                            <button
                                onClick={() => {
                                    alert('项目档案包已一键下发入库，完成国家数字档案馆哈希锁定！');
                                    onWorkflowAdvance?.(archive.id, 'COMPLETED');
                                    onBack();
                                }}
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
                    { id: 'TREE' as const, label: '案卷结构', icon: FolderOpen },
                    { id: 'INFO' as const, label: '项目信息', icon: Info },
                    { id: 'WORKFLOW' as const, label: '流传跟踪', icon: Layout },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveLeftTab(tab.id)}
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
                                <Folder className="text-emerald-500 shrink-0" size={13} /> 单体或组卷案卷
                            </div>
                            <div className="pl-1">
                                {archive.archiveDataPackage.length > 0 ? (
                                    archive.archiveDataPackage.map((node) => (
                                        <TreeNodeWithMemos
                                            key={node.id}
                                            node={node}
                                            selectedId={selectedNode?.id}
                                            onSelect={onSelectNode}
                                            onContextMenu={onContextMenu}
                                            readOnly={readOnly}
                                            expandTrigger={expandTrigger}
                                            memos={memos}
                                        />
                                    ))
                                ) : (
                                    <p className="text-[11px] text-slate-400 pl-4 py-2">
                                        暂无报建结构。请先执行登记。
                                    </p>
                                )}
                            </div>
                        </div>
                        {archive.volumeDataPackage.length > 0 && (
                            <div>
                                <div className="px-2.5 py-1.5 bg-slate-50 rounded-lg mb-2 font-bold text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border border-slate-100">
                                    <Folder className="text-purple-500 shrink-0" size={13} /> 综合索引封套
                                </div>
                                <div className="pl-1">
                                    {archive.volumeDataPackage.map((node) => (
                                        <TreeNodeWithMemos
                                            key={node.id}
                                            node={node}
                                            selectedId={selectedNode?.id}
                                            onSelect={onSelectNode}
                                            onContextMenu={onContextMenu}
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
                            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                                立项及质监属性
                            </h4>
                            <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                                <InfoRow label="项目名称" value={info.projectName} />
                                <InfoRow label="施工报建号" value={info.permitNumber} />
                                <InfoRow label="国家级代码" value={info.projectCode} />
                                <InfoRow label="工程地点" value={info.location} />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                                核心建设单位
                            </h4>
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
                        <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-4">
                            审阅流传节点跟踪
                        </h4>
                        <div className="space-y-6 ml-2">
                            <TimelineItem
                                title="前置登记及建档"
                                date={archive.submissionDate}
                                desc={`经办人 [${info.operator || '岑源'}] 完成数字挂载分配`}
                                status="COMPLETED"
                            />
                            <TimelineItem
                                title="窗口初审 (当前阶段)"
                                date="进行中"
                                desc="主要对各阶段文件的完整性、签章完备度、以及双层PDF规范进行自动AI质检评估。"
                                status={stage === 'FIRST_REVIEW' ? 'CURRENT' : 'COMPLETED'}
                            />
                            <TimelineItem
                                title="打印验收意见书"
                                date="--"
                                desc="科室窗口打字盖章"
                                status={
                                    ['SECOND_REVIEW', 'RECEIPT_PRINT', 'ARCHIVING', 'COMPLETED'].includes(stage)
                                        ? 'COMPLETED'
                                        : 'PENDING'
                                }
                            />
                            <TimelineItem
                                title="接收复核复审"
                                date="--"
                                desc="专家及二级档案室最终签字"
                                status={
                                    ['RECEIPT_PRINT', 'ARCHIVING', 'COMPLETED'].includes(stage)
                                        ? 'COMPLETED'
                                        : 'PENDING'
                                }
                            />
                            <TimelineItem
                                title="哈希锁定入库"
                                date="--"
                                desc="正式打上海/苏州档案区块链存证锁，提供公钥证书查验。"
                                status={stage === 'COMPLETED' ? 'COMPLETED' : 'PENDING'}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
