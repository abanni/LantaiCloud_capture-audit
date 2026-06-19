import React from 'react';
import { Database, Link, Lock, ChevronRight } from 'lucide-react';

interface AssociatedArchive {
    archiveId: string;
    archiveName: string;
    archiveCode: string;
    region: string;
    fileTypes: string[];
    liaison: string;
    syncFrequency: string;
    token: string;
    associatedDate: string;
    protocolVersion: string;
    status: string;
}

interface StepExternalArchiveProps {
    useExternalArchive: boolean;
    setUseExternalArchive: (val: boolean) => void;
    associatedArchives: AssociatedArchive[];
    selectedAssociatedId: string;
    setSelectedAssociatedId: (id: string) => void;
    onNext: () => void;
}

const StepExternalArchive: React.FC<StepExternalArchiveProps> = ({
    useExternalArchive,
    setUseExternalArchive,
    associatedArchives,
    selectedAssociatedId,
    setSelectedAssociatedId,
    onNext,
}) => {
    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
                    <Database className="w-6 h-6 text-primary" />
                    选择档案馆
                </h3>
                <p className="text-slate-500 text-xs">
                    请选择是否将此档案项目关联至外部档案馆
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Option A: Local LanTai Only (DEFAULT) */}
                <div
                    onClick={() => { setUseExternalArchive(false); }}
                    className={`bg-white p-6 rounded-2xl border-2 hover:shadow-md cursor-pointer transition-all flex flex-col relative ${
                        !useExternalArchive
                            ? 'border-primary shadow-md bg-primary/5/5'
                            : 'border-slate-200 hover:border-slate-200'
                    }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-full ${!useExternalArchive ? 'bg-orange-100 text-primary' : 'bg-slate-100 text-slate-400'} flex items-center justify-center transition-colors`}>
                            <Lock className="w-6 h-6" />
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            !useExternalArchive ? 'border-primary bg-primary/50 text-white shadow-xs' : 'border-slate-200'
                        }`}>
                            {!useExternalArchive && <span className="text-xs font-bold">✓</span>}
                        </div>
                    </div>
                    <h4 className="font-bold text-slate-800 text-base mb-1.5">仅保存在兰台本地 (默认)</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        档案存储在兰台云本地
                    </p>
                </div>

                {/* Option B: External Sync with LanTai Guarantee */}
                <div
                    onClick={() => { setUseExternalArchive(true); }}
                    className={`bg-white p-6 rounded-2xl border-2 hover:shadow-md cursor-pointer transition-all flex flex-col relative ${
                        useExternalArchive
                            ? 'border-primary shadow-md bg-primary/5/5'
                            : 'border-slate-200 hover:border-slate-200'
                    }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-full ${useExternalArchive ? 'bg-orange-100 text-primary' : 'bg-slate-100 text-slate-400'} flex items-center justify-center transition-colors`}>
                            <Link className="w-6 h-6" />
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            useExternalArchive ? 'border-primary bg-primary/50 text-white shadow-xs' : 'border-slate-200'
                        }`}>
                            {useExternalArchive && <span className="text-xs font-bold">✓</span>}
                        </div>
                    </div>
                    <h4 className="font-bold text-slate-800 text-base mb-1.5">关联外部档案馆</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                        项目关联外部档案馆
                        <span className="text-primary block mt-1 font-bold">✓ 兰台云为您保存完整的档案副本</span>
                    </p>
                </div>
            </div>

            {/* External Archive Selector - visible only when Option B is active */}
            {useExternalArchive && (
                <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <Database className="w-4 h-4 text-primary animate-pulse" />
                        <span>请选择关联的外部档案馆</span>
                    </div>
                    <div className="relative">
                        <select
                            id="associated-archive-select"
                            title="选择关联的外部档案馆"
                            value={selectedAssociatedId}
                            onChange={(e) => setSelectedAssociatedId(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 font-bold text-slate-800 transition-all cursor-pointer shadow-xs appearance-none pr-8"
                        >
                            {associatedArchives.map((arc) => (
                                <option key={arc.archiveId} value={arc.archiveId}>
                                    🔒 {arc.archiveName} (ID: {arc.archiveId}) [企业已接入通道]
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                            <ChevronRight className="w-4 h-4 rotate-90" />
                        </div>
                    </div>
                    <div className="text-[11px] text-slate-500 bg-primary/5/40 p-2.5 rounded-lg border border-primary/20">
                        <span>档案类型和分类标准以所选档案馆为准。可在企业管理中心的"外部档案馆"中扩展接入更多链路。</span>
                    </div>
                </div>
            )}

            {/* LanTai Security Trust Declaration */}
            <div className="bg-[#eff6ff] border border-blue-100 p-4 rounded-xl flex items-start gap-3 mt-4">
                <span className="text-lg mt-0.5 shrink-0">🛡️</span>
                <div className="space-y-1">
                    <h5 className="font-bold text-blue-900 text-xs">数据安全保护承诺</h5>
                    <p className="text-[11px] text-blue-700/95 leading-relaxed">
                        为保障您的数据安全，无论选择本地存储还是外部上报，兰台云都会<strong>为您保留一份完整的档案备份</strong>，多重加密保护，未经授权无法修改。
                    </p>
                </div>
            </div>


        </div>
    );
};

export default StepExternalArchive;
