import React, { useState } from 'react';
import {
    X, ShieldAlert, Sparkles, CheckCircle2,
} from 'lucide-react';
import { Project, Identity } from '../../../types';

interface CommitmentSigningModalProps {
    project: Project;
    identity: Identity;
    onClose: () => void;
    onApprove: (projectId: string) => void;
}

const CommitmentSigningModal: React.FC<CommitmentSigningModalProps> = ({
    project,
    identity,
    onClose,
    onApprove,
}) => {
    const [isSigningLoading, setIsSigningLoading] = useState(false);
    const [signingStep, setSigningStep] = useState<1 | 2>(1); // 1: Sign, 2: Approve

    const handleSignCommitment = () => {
        setIsSigningLoading(true);
        setTimeout(() => {
            setIsSigningLoading(false);
            setSigningStep(2); // Proceed to Archive approval phase
        }, 1200);
    };

    const handleApproveCommitment = () => {
        onApprove(project.id);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
                {/* Header banner */}
                <div className="bg-[#001529] px-6 py-4 flex items-center justify-between text-white border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">✍️</span>
                        <div>
                            <h3 className="font-bold text-sm">签署责任承诺书并关联档案激活</h3>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5">项目名称: {project.name}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="关闭"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Staged Form content */}
                <div className="p-6 overflow-y-auto space-y-5 flex-1 min-h-[300px] max-h-[500px]">
                    {/* Horizontal steps tracker */}
                    <div className="flex items-center justify-center gap-3">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${signingStep === 1 ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                            <span className="w-4.5 h-4.5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">1</span>
                            <span>责任签署</span>
                        </div>
                        <span className="text-slate-300">➜</span>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${signingStep === 2 ? 'bg-teal-50 border border-teal-200 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>
                            <span className="w-4.5 h-4.5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">2</span>
                            <span>档案馆批复</span>
                        </div>
                    </div>

                    {signingStep === 1 ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl flex gap-3 text-xs leading-relaxed text-orange-950 font-medium">
                                <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                                <div>
                                    <strong>法律效力告知：</strong>
                                    根据《中华人民共和国档案法》及兰台强自治管理规范，工程资料在立卷整理前，建设单位、施工单位必须完成线上电子责任书共签，对报送资料的真实、完整与合规性作出法律连带承诺。
                                </div>
                            </div>

                            {/* Simulated Legal Document Container */}
                            <div className="border border-slate-200 rounded-xl bg-slate-50/50 p-6 space-y-4 font-serif text-slate-700 text-xs shadow-inner select-none h-48 overflow-y-scroll leading-relaxed">
                                <div className="text-center font-bold text-slate-900 text-sm mb-4">
                                    建设工程资料移交责任承诺书
                                </div>
                                <p>
                                    本单位（<strong>{project.constructionUnit || identity.organization?.name}</strong>）就承建实施的【<strong>{project.name}</strong>】工程之全生命周期档案建立及报送事宜，向 <strong>{project.assignedReviewer || '昆山市档案馆'}</strong> 作出如下不可撤销之郑重承诺：
                                </p>
                                <p>
                                    一、保证报送、整理、并卷之纸质与双层数字档案完全吻合，所有图纸红线盖章真实可靠；
                                    二、承诺在工程取得竣工规划核实手续后两周内，主动配合兰台云专管审查员进行立项校验；
                                    三、若违反本承诺导致档案流转延迟或存在虚假欺诈，自愿依法承担民事及相关刑事追偿责任。
                                </p>
                                <div className="pt-6 border-t border-dashed border-slate-200 flex justify-between font-sans text-[11px] text-slate-500">
                                    <div>
                                        承诺主体：{project.constructionUnit || identity.organization?.name}
                                        <br />
                                        法定代表/代理人：张三
                                    </div>
                                    <div className="text-right">
                                        签署日期：2026年06月04日
                                        <br />
                                        状态：<span className="text-red-500 font-bold">待联签盖章</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold">
                                <span className="text-slate-500 flex items-center gap-1">
                                    🛡️ 昆山数字证签中心 SM2 算法签名已就绪
                                </span>
                                <button
                                    onClick={handleSignCommitment}
                                    disabled={isSigningLoading}
                                    className="px-5 py-2.5 bg-primary hover:bg-indigo-700 text-white font-bold rounded-lg cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
                                >
                                    {isSigningLoading ? '证书盾盘验签中...' : '一键密盾签署'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 py-4 text-center">
                            <div className="w-16 h-16 bg-teal-50 border border-teal-200 text-teal-600 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
                                🏆
                            </div>
                            <div className="space-y-1 max-w-md mx-auto">
                                <h4 className="font-extrabold text-slate-800 text-sm">承诺书签署完成，已发送至档案馆受理窗口</h4>
                                <p className="text-xs text-slate-500 leading-normal font-medium">
                                    承诺书密盾签署成功，已在区块链上存证！项目正处于档案馆在线大厅审核阶段，可一键执行窗口极速模拟通过！
                                </p>
                            </div>

                            <div className="p-4 bg-teal-50 border border-teal-120 rounded-xl space-y-1.5 text-left text-teal-900">
                                <div className="font-bold text-[11px] text-teal-800 flex items-center gap-1">
                                    <Sparkles className="w-4 h-4 text-teal-600" />
                                    档案馆在线快速响应
                                </div>
                                <div className="text-[11px] leading-relaxed font-normal text-slate-600">
                                    在沙箱演示模式下，可穿透档案馆审批周期。点击下方极速通过按钮，档案馆后台将一键自动核发许可证关联，并将项目升级为<strong>【整理中】</strong>阶段。
                                </div>
                            </div>

                            <button
                                onClick={handleApproveCommitment}
                                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-transform shadow-md cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.01]"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                点击极速审核通过，激活档案整理盘
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer details */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-mono flex justify-between items-center">
                    <span>系统存证：LantaiCloud-BlockChain-v2.3</span>
                    <span>演示快捷通道</span>
                </div>
            </div>
        </div>
    );
};

export default CommitmentSigningModal;
