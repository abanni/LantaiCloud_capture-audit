import React, { useState } from 'react';
import {
    X, ShieldAlert, Sparkles, CheckCircle2, Globe, Usb,
    Download, ShoppingCart, ExternalLink, Loader2, Check,
    ArrowLeft, Fingerprint, AlertTriangle, ChevronRight
} from 'lucide-react';
import { Project, Identity } from '../../../types';

interface CommitmentSigningModalProps {
    project: Project;
    identity: Identity;
    onClose: () => void;
    onApprove: (projectId: string) => void;
}

type SignFlow = 'select' | 'web-sign' | 'web-no-ca' | 'ukey-select' | 'ukey-sign' | 'ukey-download' | 'ukey-purchase' | 'approved';

const CommitmentSigningModal: React.FC<CommitmentSigningModalProps> = ({
    project,
    identity,
    onClose,
    onApprove,
}) => {
    const [hasCA] = useState(false); // 初始无CA，模拟判断
    const [signFlow, setSignFlow] = useState<SignFlow>('select');
    const [isLoading, setIsLoading] = useState(false);

    // 网页签章：检查CA
    const handleWebSign = () => {
        if (!hasCA) {
            setSignFlow('web-no-ca');
        } else {
            setSignFlow('web-sign');
        }
    };

    // 跳转第三方网页签章
    const handleRedirectToThirdParty = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSignFlow('approved');
        }, 1800);
    };

    // 购买CA
    const handlePurchaseCA = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSignFlow('web-sign');
        }, 2000);
    };

    // 传统UKey签章
    const handleUKeySign = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSignFlow('approved');
        }, 1500);
    };

    // 下载签章工具软件
    const handleDownloadTool = () => {
        setSignFlow('ukey-download');
    };

    // 购买天威UKey
    const handlePurchaseUKey = () => {
        setSignFlow('ukey-purchase');
    };

    const handleApproveCommitment = () => {
        onApprove(project.id);
    };

    const resetFlow = () => {
        setSignFlow('select');
        setIsLoading(false);
    };

    const renderStepIndicator = () => {
        if (signFlow === 'approved') return null;
        return (
            <div className="flex items-center justify-center gap-3">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${signFlow !== 'approved' ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                    <span className="w-4.5 h-4.5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">1</span>
                    <span>选择签章方式</span>
                </div>
                <span className="text-slate-300">➜</span>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${signFlow === 'approved' ? 'bg-teal-50 border border-teal-200 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>
                    <span className="w-4.5 h-4.5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">2</span>
                    <span>签章处理</span>
                </div>
                <span className="text-slate-300">➜</span>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${signFlow === 'approved' ? 'bg-teal-50 border border-teal-200 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>
                    <span className="w-4.5 h-4.5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">3</span>
                    <span>档案馆批复</span>
                </div>
            </div>
        );
    };

    const renderSelectMethod = () => (
        <div className="space-y-5">
            {/* 法律效力告知 */}
            <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl flex gap-3 text-xs leading-relaxed text-orange-950 font-medium">
                <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                    <strong>法律效力告知：</strong>
                    根据《中华人民共和国档案法》及兰台强自治管理规范，工程资料在立卷整理前，建设单位、施工单位必须完成线上电子责任书共签，对报送资料的真实、完整与合规性作出法律连带承诺。
                </div>
            </div>

            {/* 承诺书预览 */}
            <div className="border border-slate-200 rounded-xl bg-slate-50/50 p-4 space-y-3 font-serif text-slate-700 text-xs shadow-inner select-none h-36 overflow-y-scroll leading-relaxed">
                <div className="text-center font-bold text-slate-900 text-sm mb-3">
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
            </div>

            {/* 签章方式选择 */}
            <div>
                <h4 className="text-xs font-bold text-slate-700 mb-3 text-center">请选择签章方式</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 网页签章 */}
                    <button
                        onClick={handleWebSign}
                        className="group relative flex flex-col items-center p-6 border-2 border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer bg-white"
                    >
                        <div className="w-14 h-14 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                            <Globe className="w-7 h-7" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">网页签章</h4>
                        <p className="text-[10px] text-slate-400 mt-1 text-center">
                            在线浏览器直接签署<br />无需安装额外软件
                        </p>
                        <span className="mt-3 text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                            推荐
                        </span>
                    </button>

                    {/* 传统UKey签章 */}
                    <button
                        onClick={() => setSignFlow('ukey-select')}
                        className="group relative flex flex-col items-center p-6 border-2 border-slate-200 rounded-xl hover:border-amber-500 hover:bg-amber-50/30 transition-all cursor-pointer bg-white"
                    >
                        <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-600 mb-3 group-hover:bg-amber-100 group-hover:scale-110 transition-all">
                            <Usb className="w-7 h-7" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">传统UKey签章</h4>
                        <p className="text-[10px] text-slate-400 mt-1 text-center">
                            使用天威UKey硬件<br />插入电脑进行签署
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderWebNoCA = () => (
        <div className="space-y-5 text-center">
            <div className="w-16 h-16 bg-orange-50 border border-orange-200 rounded-full flex items-center justify-center mx-auto text-orange-500">
                <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
                <h4 className="font-extrabold text-slate-800 text-sm">未检测到网页签章证书（CA）</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    当前企业未开通网页数字证书服务。网页签章需要有效的CA数字证书才能进行。
                    您可以选择立即购买CA证书，或切换为传统UKey签章方式。
                </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <ShoppingCart className="w-4 h-4 text-primary" />
                    CA数字证书服务
                </div>
                <div className="text-[11px] text-slate-500 space-y-1">
                    <p>• 证书类型：国密SM2企业数字证书</p>
                    <p>• 有效期：1年 / 3年可选</p>
                    <p>• 费用：¥300/年（首年免费）</p>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    onClick={resetFlow}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                    返回上一步
                </button>
                <button
                    onClick={handlePurchaseCA}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    {isLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> 正在开通CA...</>
                    ) : (
                        <><ShoppingCart className="w-4 h-4" /> 立即购买CA证书</>
                    )}
                </button>
            </div>
        </div>
    );

    const renderWebSign = () => (
        <div className="space-y-5 text-center">
            <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto text-green-600">
                <Fingerprint className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
                <h4 className="font-extrabold text-slate-800 text-sm">网页签章已就绪</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    CA证书校验通过，即将跳转至第三方网页签章平台完成签署操作。
                    签章完成后将自动回传签署结果。
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Globe className="w-4 h-4 text-blue-600" />
                    网页签章平台：昆山数字证签中心
                </div>
                <div className="text-[11px] text-slate-500">
                    <p>• 证书：SM2企业数字证书（有效期至2027-06-18）</p>
                    <p>• 签署方：{project.constructionUnit || identity.organization?.name}</p>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    onClick={resetFlow}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                    返回上一步
                </button>
                <button
                    onClick={handleRedirectToThirdParty}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    {isLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> 跳转中...</>
                    ) : (
                        <><ExternalLink className="w-4 h-4" /> 跳转至网页签章</>
                    )}
                </button>
            </div>
        </div>
    );

    const renderUKeySelect = () => (
        <div className="space-y-5">
            <div className="text-center">
                <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-600 mb-3">
                    <Usb className="w-7 h-7" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm">传统UKey签章</h4>
                <p className="text-xs text-slate-500 mt-1">请选择您需要的UKey签章服务</p>
            </div>

            <div className="space-y-3">
                {/* 选项1: UKey签章 */}
                <button
                    onClick={handleUKeySign}
                    disabled={isLoading}
                    className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer bg-white text-left"
                >
                    <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                        <Fingerprint className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h5 className="font-bold text-slate-800 text-sm">UKey签章</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">插入天威UKey硬件证书，直接进行数字签章</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>

                {/* 选项2: 下载签章工具软件 */}
                <button
                    onClick={handleDownloadTool}
                    className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer bg-white text-left"
                >
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                        <Download className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h5 className="font-bold text-slate-800 text-sm">下载签章工具软件</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">下载并安装天威签章客户端工具，完成后即可使用UKey签章</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>

                {/* 选项3: 购买天威UKey */}
                <button
                    onClick={handlePurchaseUKey}
                    className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-amber-500 hover:bg-amber-50/30 transition-all cursor-pointer bg-white text-left"
                >
                    <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                        <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h5 className="font-bold text-slate-800 text-sm">购买天威UKey</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">如尚未持有天威UKey硬件，可在线购买，顺丰包邮</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
            </div>

            <button
                onClick={resetFlow}
                className="w-full px-4 py-2 border border-slate-200 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
                返回上一步
            </button>
        </div>
    );

    const renderUKeyDownload = () => (
        <div className="space-y-5 text-center">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <Download className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
                <h4 className="font-extrabold text-slate-800 text-sm">下载天威签章工具</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    请下载并安装天威诚信签章客户端工具，安装完成后插入UKey即可使用签章功能。
                </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-slate-700">天威签章工具 v4.2.0</span>
                    </div>
                    <span className="text-[10px] text-slate-400">23.5 MB</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full w-full"></div>
                </div>
                <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 justify-center">
                    <Check className="w-3 h-3" /> 下载完成
                </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-left text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-700">安装说明：</p>
                <p>1. 运行下载的安装包，按提示完成安装</p>
                <p>2. 插入天威UKey硬件设备</p>
                <p>3. 重新打开本页面，选择"UKey签章"进行签署</p>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    onClick={() => setSignFlow('ukey-select')}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                    返回上一步
                </button>
                <button
                    onClick={() => setSignFlow('ukey-select')}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
                >
                    已完成安装，去签章
                </button>
            </div>
        </div>
    );

    const renderUKeyPurchase = () => (
        <div className="space-y-5">
            <div className="text-center">
                <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-600">
                    <ShoppingCart className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm mt-3">购买天威UKey</h4>
                <p className="text-xs text-slate-500 mt-1">请选择您需要的UKey型号</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 border-2 border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer bg-white">
                    <div className="text-center">
                        <Usb className="w-8 h-8 text-primary mx-auto mb-2" />
                        <h5 className="font-bold text-slate-800 text-sm">标准版UKey</h5>
                        <p className="text-[18px] font-bold text-primary mt-1">¥198</p>
                        <p className="text-[10px] text-slate-400 mt-1">USB接口 · 国密算法<br />含1年证书服务</p>
                    </div>
                </div>
                <div className="p-4 border-2 border-primary bg-primary/5 rounded-xl cursor-pointer bg-white relative">
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        推荐
                    </span>
                    <div className="text-center">
                        <Usb className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                        <h5 className="font-bold text-slate-800 text-sm">专业版UKey</h5>
                        <p className="text-[18px] font-bold text-primary mt-1">¥398</p>
                        <p className="text-[10px] text-slate-400 mt-1">USB+蓝牙 · 国密算法<br />含3年证书服务</p>
                    </div>
                </div>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-[11px] text-slate-600">
                <p className="font-bold text-green-700 mb-1">🛒 下单说明：</p>
                <p>确认购买后将跳转至天威诚信官方商城，支持企业公对公转账及在线支付，顺丰包邮。</p>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    onClick={() => setSignFlow('ukey-select')}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                    返回上一步
                </button>
                <button
                    onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                            setIsLoading(false);
                            setSignFlow('ukey-select');
                        }, 1500);
                    }}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    {isLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> 跳转中...</>
                    ) : (
                        <><ExternalLink className="w-4 h-4" /> 前往商城购买</>
                    )}
                </button>
            </div>
        </div>
    );

    const renderApproved = () => (
        <div className="space-y-4 py-4 text-center">
            <div className="w-16 h-16 bg-teal-50 border border-teal-200 text-teal-600 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
                🏆
            </div>
            <div className="space-y-1 max-w-md mx-auto">
                <h4 className="font-extrabold text-slate-800 text-sm">承诺书签署完成，已发送至档案馆受理窗口</h4>
                <p className="text-xs text-slate-500 leading-normal font-medium">
                    承诺书签章成功，已在区块链上存证！项目正处于档案馆在线大厅审核阶段，可一键执行窗口极速模拟通过！
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
    );

    const renderContent = () => {
        switch (signFlow) {
            case 'select':
                return renderSelectMethod();
            case 'web-no-ca':
                return renderWebNoCA();
            case 'web-sign':
                return renderWebSign();
            case 'ukey-select':
                return renderUKeySelect();
            case 'ukey-download':
                return renderUKeyDownload();
            case 'ukey-purchase':
                return renderUKeyPurchase();
            case 'approved':
                return renderApproved();
            default:
                return renderSelectMethod();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
                {/* Header banner */}
                <div className="bg-[#001529] px-6 py-4 flex items-center justify-between text-white border-b border-white/10">
                    <div className="flex items-center gap-2">
                        {signFlow !== 'select' && signFlow !== 'approved' ? (
                            <button onClick={resetFlow} className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer" title="返回">
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                        ) : (
                            <span className="text-xl">✍️</span>
                        )}
                        <div>
                            <h3 className="font-bold text-sm">签署责任承诺书</h3>
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
                <div className="p-6 overflow-y-auto space-y-5 flex-1 min-h-[300px] max-h-[520px]">
                    {renderStepIndicator()}
                    {renderContent()}
                </div>

                {/* Footer details */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-mono flex justify-between items-center">
                    <span>系统存证：LantaiCloud-BlockChain-v2.3</span>
                    <span>天威诚信 · 电子签章服务</span>
                </div>
            </div>
        </div>
    );
};

export default CommitmentSigningModal;
