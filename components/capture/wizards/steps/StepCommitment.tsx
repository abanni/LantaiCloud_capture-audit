import React, { useState } from 'react';
import {
    ShieldCheck, Globe, Usb, Download, ShoppingCart, ExternalLink,
    Loader2, Check, Fingerprint, AlertTriangle, ChevronRight, ArrowLeft, Sparkles
} from 'lucide-react';

interface StepCommitmentProps {
    formData: {
        name: string;
        address: string;
        constructionUnit: string;
    };
    archiveName: string;
    isSigned: boolean;
    setIsSigned: (val: boolean) => void;
    signMethod: 'esign' | 'upload';
    setSignMethod: (method: 'esign' | 'upload') => void;
}

type SignFlow = 'select' | 'web-no-ca' | 'web-sign' | 'ukey-select' | 'ukey-download' | 'ukey-purchase';

const StepCommitment: React.FC<StepCommitmentProps> = ({
    formData,
    archiveName,
    isSigned,
    setIsSigned,
    signMethod,
    setSignMethod,
}) => {
    const [signFlow, setSignFlow] = useState<SignFlow>('select');
    const [hasCA] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (isSigned) {
        return (
            <div className="h-full flex flex-col">
                <div className="mb-4">
                    <h3 className="font-bold text-slate-800">签署《建设工程档案报送责任承诺书》</h3>
                </div>
                <div className="flex-1 border rounded-lg bg-slate-50 p-4 flex items-center justify-center">
                    <div className="text-center animate-in fade-in zoom-in">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h4 className="font-bold text-slate-800">已完成签署</h4>
                        <p className="text-sm text-slate-500 mb-4">签章验证通过</p>
                        <button
                            onClick={() => { setIsSigned(false); setSignFlow('select'); }}
                            className="text-primary text-sm hover:underline"
                        >
                            重新签署
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleWebSign = () => {
        if (!hasCA) {
            setSignFlow('web-no-ca');
        } else {
            setSignFlow('web-sign');
        }
    };

    const handlePurchaseCA = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSignFlow('web-sign');
        }, 2000);
    };

    const handleRedirectToThirdParty = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSigned(true);
        }, 1800);
    };

    const handleUKeySign = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSigned(true);
        }, 1500);
    };

    const renderSelectMethod = () => (
        <div className="space-y-4">
            <div className="text-xs text-slate-500 text-center mb-2">
                温馨提示：推荐使用"网页签章"，无需安装任何软件，在线即可完成签署。
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 网页签章 */}
                <button
                    type="button"
                    onClick={handleWebSign}
                    className="group flex flex-col items-center p-6 border-2 border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer bg-white"
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
                    type="button"
                    onClick={() => setSignFlow('ukey-select')}
                    className="group flex flex-col items-center p-6 border-2 border-slate-200 rounded-xl hover:border-amber-500 hover:bg-amber-50/30 transition-all cursor-pointer bg-white"
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
    );

    const renderWebNoCA = () => (
        <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-orange-50 border border-orange-200 rounded-full flex items-center justify-center mx-auto text-orange-500">
                <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
                <h4 className="font-bold text-slate-800 text-sm">未检测到网页签章证书（CA）</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    当前企业未开通网页数字证书服务。您可以选择立即购买CA证书，或切换为传统UKey签章方式。
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
                    type="button"
                    onClick={() => setSignFlow('select')}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                    返回上一步
                </button>
                <button
                    type="button"
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
        <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto text-green-600">
                <Fingerprint className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
                <h4 className="font-bold text-slate-800 text-sm">网页签章已就绪</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    CA证书校验通过，即将跳转至第三方网页签章平台完成签署操作。
                </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Globe className="w-4 h-4 text-blue-600" />
                    网页签章平台：昆山数字证签中心
                </div>
                <div className="text-[11px] text-slate-500">
                    <p>• 证书：SM2企业数字证书</p>
                    <p>• 签署方：{formData.constructionUnit || '待确认'}</p>
                </div>
            </div>
            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => setSignFlow('select')}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                    返回上一步
                </button>
                <button
                    type="button"
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
        <div className="space-y-4">
            <div className="text-center">
                <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-600 mb-3">
                    <Usb className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">传统UKey签章</h4>
                <p className="text-xs text-slate-500 mt-1">请选择您需要的UKey签章服务</p>
            </div>
            <div className="space-y-3">
                <button
                    type="button"
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
                <button
                    type="button"
                    onClick={() => setSignFlow('ukey-download')}
                    className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer bg-white text-left"
                >
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                        <Download className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h5 className="font-bold text-slate-800 text-sm">下载签章工具软件</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">下载并安装天威签章客户端工具</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
                <button
                    type="button"
                    onClick={() => setSignFlow('ukey-purchase')}
                    className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-amber-500 hover:bg-amber-50/30 transition-all cursor-pointer bg-white text-left"
                >
                    <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                        <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h5 className="font-bold text-slate-800 text-sm">购买天威UKey</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">如尚未持有天威UKey硬件，可在线购买</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
            </div>
            <button
                type="button"
                onClick={() => setSignFlow('select')}
                className="w-full px-4 py-2 border border-slate-200 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
                返回上一步
            </button>
        </div>
    );

    const renderUKeyDownload = () => (
        <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <Download className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
                <h4 className="font-bold text-slate-800 text-sm">下载天威签章工具</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    请下载并安装天威诚信签章客户端工具，安装完成后插入UKey即可使用。
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
                    type="button"
                    onClick={() => setSignFlow('ukey-select')}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                    返回上一步
                </button>
                <button
                    type="button"
                    onClick={() => setSignFlow('ukey-select')}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
                >
                    已完成安装，去签章
                </button>
            </div>
        </div>
    );

    const renderUKeyPurchase = () => (
        <div className="space-y-4">
            <div className="text-center">
                <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-600">
                    <ShoppingCart className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm mt-3">购买天威UKey</h4>
                <p className="text-xs text-slate-500 mt-1">请选择您需要的UKey型号</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 border-2 border-slate-200 rounded-xl bg-white">
                    <div className="text-center">
                        <Usb className="w-8 h-8 text-primary mx-auto mb-2" />
                        <h5 className="font-bold text-slate-800 text-sm">标准版UKey</h5>
                        <p className="text-[18px] font-bold text-primary mt-1">¥198</p>
                        <p className="text-[10px] text-slate-400 mt-1">USB接口 · 国密算法<br />含1年证书服务</p>
                    </div>
                </div>
                <div className="p-4 border-2 border-primary bg-primary/5 rounded-xl bg-white relative">
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
            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => setSignFlow('ukey-select')}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                    返回上一步
                </button>
                <button
                    type="button"
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

    const renderContent = () => {
        switch (signFlow) {
            case 'select': return renderSelectMethod();
            case 'web-no-ca': return renderWebNoCA();
            case 'web-sign': return renderWebSign();
            case 'ukey-select': return renderUKeySelect();
            case 'ukey-download': return renderUKeyDownload();
            case 'ukey-purchase': return renderUKeyPurchase();
            default: return renderSelectMethod();
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-4 flex items-center gap-2">
                {signFlow !== 'select' && (
                    <button
                        type="button"
                        onClick={() => setSignFlow('select')}
                        className="p-1 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        title="返回"
                    >
                        <ArrowLeft className="w-4 h-4 text-slate-500" />
                    </button>
                )}
                <h3 className="font-bold text-slate-800">签署《建设工程档案报送责任承诺书》</h3>
            </div>

            <div className="flex-1 border rounded-lg bg-slate-50 p-6 flex items-center justify-center">
                <div className="w-full max-w-lg">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default StepCommitment;
