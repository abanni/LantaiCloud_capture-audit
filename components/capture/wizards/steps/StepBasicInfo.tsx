import React from 'react';
import { ChevronRight, RefreshCw, Loader2 } from 'lucide-react';
import Label from '../components/Label';
import { ArchiveType } from '../constants';

interface FormData {
    name: string;
    code: string;
    permitNo: string;
    address: string;
    region: string;
    constructionUnit: string;
    designUnit: string;
}

interface StepBasicInfoProps {
    formData: FormData;
    setFormData: (data: FormData) => void;
    activeTypeObj: ArchiveType | undefined;
    selectedSubType: string | null;
    isConstruction: boolean;
    isLoading: boolean;
    archiveRegion: string;
    isConstructionType: boolean;
    useExternalArchive: boolean;
    onBackStep0: () => void;
    onBackStep1: () => void;
    onImport: () => void;
    onTriggerPermitNo: () => void;
}

const StepBasicInfo: React.FC<StepBasicInfoProps> = ({
    formData,
    setFormData,
    activeTypeObj,
    selectedSubType,
    isConstruction,
    isLoading,
    archiveRegion,
    isConstructionType,
    useExternalArchive,
    onBackStep0,
    onBackStep1,
    onImport,
    onTriggerPermitNo,
}) => {
    const updateField = (field: keyof FormData, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center text-xs text-slate-500 mb-4 bg-slate-100/70 px-3 py-1.5 rounded-lg w-fit gap-1 font-medium select-none">
                <span className="cursor-pointer hover:text-primary hover:underline" onClick={onBackStep0}>选择关联</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="cursor-pointer hover:text-primary hover:underline" onClick={onBackStep1}>分类：{activeTypeObj?.label}</span>
                {selectedSubType && (
                    <>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-primary">
                            {activeTypeObj?.children?.find(c => c.id === selectedSubType)?.label}
                        </span>
                    </>
                )}
            </div>

            {isConstructionType && (
                <div className="flex justify-between items-center bg-primary/5 p-3 rounded border border-orange-100 mb-6">
                    <span className="text-sm text-orange-850">💡 提示：该流程用于正式档案移交，系统将严格按照 GB50328 标准组织数据结构。</span>
                    <button
                        type="button"
                        onClick={onImport}
                        disabled={isLoading}
                        className="flex items-center px-3 py-1.5 bg-white border border-primary/20 text-orange-700 rounded text-sm hover:bg-primary/5 shadow-sm transition-colors cursor-pointer"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        智能一键导入
                    </button>
                </div>
            )}

            <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <div className="col-span-2">
                    <Label required>项目名称 {isConstructionType ? '（立项名称）' : ''}</Label>
                    <input
                        type="text"
                        className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:ring-primary focus:border-primary"
                        placeholder="请输入项目名称"
                        value={formData.name}
                        onChange={e => updateField('name', e.target.value)}
                    />
                </div>

                {isConstructionType ? (
                    <>
                        <div>
                            <Label required>立项文号或代码</Label>
                            <input
                                type="text"
                                title="立项文号/代码"
                                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:ring-primary focus:border-primary"
                                value={formData.code}
                                onChange={e => updateField('code', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label required>选择档案馆区域</Label>
                            <div className="w-full border border-slate-200 bg-slate-100 rounded px-3 py-2 text-xs text-slate-700 flex justify-between items-center cursor-not-allowed font-medium">
                                <span>{archiveRegion}</span>
                                <span className="text-[10px] bg-slate-200 px-1.5 rounded-sm">级联定位</span>
                            </div>
                        </div>

                        <div className="col-span-2 bg-gradient-to-r from-orange-50/20 to-amber-50/35 p-4 rounded-lg border border-amber-100">
                            <div className="flex justify-between items-center mb-1.5">
                                <Label required>施工许可证号</Label>
                                <button
                                    type="button"
                                    onClick={onTriggerPermitNo}
                                    className="text-[11px] font-bold text-orange-850 hover:text-orange-950 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <span>✨ 🪄 模拟许可证号</span>
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    title="施工许可证号"
                                    className="flex-1 border border-amber-200 rounded px-3 py-2 font-mono text-xs tracking-wide bg-white focus:ring-primary focus:border-primary text-slate-800"
                                    value={formData.permitNo}
                                    onChange={e => updateField('permitNo', e.target.value)}
                                    placeholder="请输入 3205* 许可证号"
                                />
                                <div className="text-[10px] text-amber-900 p-2 bg-amber-55 rounded border border-amber-100/50 flex flex-col justify-center text-left whitespace-nowrap">
                                    区域规则首部: <span className="font-bold">{archiveRegion === '常熟' ? '320581' : '320583'}</span> ({archiveRegion})
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <Label>工程地点</Label>
                            <input
                                title="工程地点"
                                type="text"
                                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:ring-primary focus:border-primary"
                                value={formData.address}
                                onChange={e => updateField('address', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>建设单位</Label>
                            <input
                                title="建设单位"
                                type="text"
                                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:ring-primary focus:border-primary"
                                value={formData.constructionUnit}
                                onChange={e => updateField('constructionUnit', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>设计单位</Label>
                            <input
                                type="text"
                                title="设计单位"
                                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:ring-primary focus:border-primary"
                                value={formData.designUnit}
                                onChange={e => updateField('designUnit', e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="col-span-2">
                            <Label>项目描述或备注</Label>
                            <textarea
                                className="w-full border border-slate-200 rounded px-3 py-2 h-24 resize-none focus:ring-primary focus:border-primary"
                                placeholder="简要描述项目内容..."
                                readOnly
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StepBasicInfo;
