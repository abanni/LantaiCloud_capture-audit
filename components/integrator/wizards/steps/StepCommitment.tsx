import React from 'react';
import { ShieldCheck, PenTool, Download, Upload } from 'lucide-react';

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

const StepCommitment: React.FC<StepCommitmentProps> = ({
    formData,
    archiveName,
    isSigned,
    setIsSigned,
    signMethod,
    setSignMethod,
}) => {
    return (
        <div className="h-full flex flex-col">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                    <h3 className="font-bold text-slate-800">签署《建设工程档案报送责任承诺书》</h3>
                    <p className="text-sm text-slate-500 mt-1">
                        温馨提示：推荐使用"承诺书电子签章"，可实现秒级在线验证与自动审核。
                    </p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
                    <button
                        type="button"
                        onClick={() => { setSignMethod('esign'); setIsSigned(false); }}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                            signMethod === 'esign'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        承诺书电子签章
                    </button>
                    <button
                        type="button"
                        onClick={() => { setSignMethod('upload'); setIsSigned(false); }}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                            signMethod === 'upload'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        纸质承诺书签字盖章上传
                    </button>
                </div>
            </div>

            <div className="flex-1 border rounded-lg bg-slate-50 p-4 flex flex-col items-center justify-center relative overflow-hidden">
                {isSigned ? (
                    <div className="text-center animate-in fade-in zoom-in">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h4 className="font-bold text-slate-800">已完成签署</h4>
                        <p className="text-sm text-slate-500 mb-4">{signMethod === 'esign' ? '电子签章验证通过' : '承诺书扫描件已上传'}</p>
                        <button
                            onClick={() => setIsSigned(false)}
                            className="text-primary text-sm hover:underline"
                        >
                            重新签署/上传
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Document Preview Placeholder */}
                        <div className="w-[60%] h-full bg-white shadow-md border border-slate-200 p-8 mb-4 overflow-y-auto relative">
                            <div className="font-serif text-center font-bold text-lg mb-6">建设工程档案报送责任承诺书</div>
                            <div className="text-xs leading-relaxed text-slate-600 space-y-4 text-justify">
                                <p>本建设单位（{formData.constructionUnit || '____________'}）郑重承诺：</p>
                                <p>严格遵守《城市建设档案管理规定》及相关法律法规，对报送的工程档案真实性、完整性、有效性负责。</p>
                                <p>工程名称：{formData.name}</p>
                                <p>工程地点：{formData.address}</p>
                                <p>移交目标：{archiveName}</p>
                                <p className="mt-8">承诺单位（盖章）：</p>
                                <p>法定代表人（签字）：</p>
                                <p>日期：2025年03月04日</p>
                            </div>

                            {/* E-Sign Seal Placeholder */}
                            {signMethod === 'esign' && (
                                <div className="absolute bottom-10 right-10 opacity-20 rotate-[-15deg] pointer-events-none">
                                    <div className="w-24 h-24 border-4 border-red-500 rounded-full flex items-center justify-center text-red-500 font-bold text-xs p-2 text-center">
                                        {formData.constructionUnit || '电子签章'}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            {signMethod === 'esign' ? (
                                <button
                                    type="button"
                                    onClick={() => setIsSigned(true)}
                                    className="flex items-center px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 shadow-md transition-colors cursor-pointer"
                                >
                                    <PenTool className="w-4 h-4 mr-2" /> 发起电子签章
                                </button>
                            ) : (
                                <>
                                    <button type="button" className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded hover:bg-slate-50 cursor-pointer">
                                        <Download className="w-4 h-4 mr-2" /> 下载承诺书模板
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsSigned(true)}
                                        className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover shadow-md cursor-pointer"
                                    >
                                        <Upload className="w-4 h-4 mr-2" /> 上传盖章扫描件
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StepCommitment;
