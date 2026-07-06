import React from 'react';
import { Building2, MapPin, Hash, User, Calendar } from 'lucide-react';

const FormRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center py-2">
        <label className="w-32 text-sm text-slate-500 shrink-0">{label}</label>
        <div className="text-sm text-slate-800 font-medium">{value}</div>
    </div>
);

const ArchiveInfoTab: React.FC = () => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-start">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center text-3xl mr-5">
                    <Building2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center mb-2 flex-wrap gap-2">
                        <h2 className="text-lg font-bold text-slate-900 mr-2">昆山市城建档案馆</h2>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium">政府机构</span>
                    </div>
                    <p className="text-xs text-slate-400">昆山市城市规划建设档案管理与审核权威机构</p>
                </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-1">
                <FormRow label="机构名称" value="昆山市城建档案馆" />
                <FormRow label="统一代码" value="12320583MB1A12345X" />
                <FormRow label="所在地区" value="江苏省苏州市昆山市" />
                <FormRow label="负责人" value="李娜" />
                <FormRow label="联系电话" value="0512-56788888" />
                <FormRow label="成立日期" value="2005-03-15" />
            </div>

            <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-bold text-slate-700 mb-3">档案管辖范围</h3>
                <div className="flex flex-wrap gap-2">
                    {['城市建设档案', '建筑工程档案', '市政工程档案', '竣工验收档案', '规划审批档案'].map(t => (
                        <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">{t}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArchiveInfoTab;
