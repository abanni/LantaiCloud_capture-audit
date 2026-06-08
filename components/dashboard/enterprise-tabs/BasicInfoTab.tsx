import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { Identity } from '../../../types';

interface BasicInfoTabProps {
    identity: Identity;
    onEdit?: () => void;
}

const FormRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center">
        <label className="w-32 text-sm text-slate-500 shrink-0">{label}</label>
        <div className="text-sm text-slate-800 font-medium">{value}</div>
    </div>
);

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ identity, onEdit }) => {
    return (
        <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex items-start">
                    <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-3xl mr-5">🏢</div>
                    <div className="flex-1">
                        <div className="flex items-center mb-2 flex-wrap gap-2">
                            <h2 className="text-lg font-bold text-slate-900 mr-2">{identity.organization.name}</h2>
                            {identity.organization.shortName && (
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-normal">
                                    简称: {identity.organization.shortName}
                                </span>
                            )}
                            <span className="bg-green-50 text-green-600 border border-green-200 text-[11px] px-2 py-0.5 rounded flex items-center">
                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> 已核验实名认证
                            </span>
                        </div>
                        <div className="text-xs text-slate-500 mb-1 font-mono">
                            统一社会信用代码：{identity.organization.code || '91310230MAE9102L0D'}
                        </div>
                        <div className="text-xs text-slate-400">
                            当前角色身份: <strong className="text-slate-600 ml-1">{identity.role}</strong>
                        </div>
                    </div>
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="px-4 py-2 border border-slate-200 rounded text-slate-600 text-sm hover:border-primary hover:text-primary transition-colors bg-white shrink-0"
                        >
                            编辑资料
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">工商备案信息</div>
                <div className="space-y-4">
                    <FormRow label="法定代表人" value={`${identity.organization.legalRep || '王钢'} (已核验)`} />
                    {identity.organization.legalRepPhone && (
                        <FormRow label="法人手机号" value={identity.organization.legalRepPhone} />
                    )}
                    <FormRow label="机构类型" value="建设工程企业" />
                    <FormRow label="备案地址" value="上海张江高科技园区科学城路" />
                    <div className="flex items-start">
                        <label className="w-32 text-sm text-slate-500 pt-1 shrink-0">加载营业执照</label>
                        <div className="flex-1 max-w-sm">
                            <div className="px-4 py-3 bg-slate-50 border border-dashed border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600">
                                <span className="flex items-center gap-1.5 truncate">
                                    <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                    <span className="font-mono truncate">{identity.organization.licenceFileName || '营业执照_核验副本.png'}</span>
                                </span>
                                <span className="text-green-600 font-semibold uppercase shrink-0">已验签</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BasicInfoTab;
