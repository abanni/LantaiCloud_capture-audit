import React from 'react';
import { Identity } from '../types';
import { Building2, UserCircle, ChevronRight, LogOut, Shield } from 'lucide-react';

interface IdentitySelectorProps {
    identities: Identity[];
    onSelect: (identity: Identity) => void;
    onLogout: () => void;
}

const IdentitySelector: React.FC<IdentitySelectorProps> = ({ identities, onSelect, onLogout }) => {
    
    // Style helper for roles
    const getRoleBadge = (role: string) => {
        switch (role) {
            case '法定代表人':
                return {
                    label: '法定代表人',
                    class: 'bg-amber-50 text-amber-700 border border-amber-200'
                };
            case '管理员':
                return {
                    label: '管理员',
                    class: 'bg-blue-50 text-blue-700 border border-blue-200'
                };
            default:
                return {
                    label: '成员',
                    class: 'bg-slate-100 text-slate-700 border border-slate-200'
                };
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-6">
            <div className="w-full max-w-xl">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                        <Building2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">选择登录身份</h1>
                    <p className="text-slate-500 text-sm">
                        您的账号关联了多个组织，请选择本次操作的身份。
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                        您的企业身份列表
                    </div>
                    
                    {identities.map((identity) => {
                        const badge = getRoleBadge(identity.role);
                        const hasOrg = !!identity.organization;
                        return (
                            <div 
                                key={identity.id}
                                onClick={() => onSelect(identity)}
                                className={`group relative flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                                    hasOrg 
                                        ? 'border-slate-100 hover:border-primary hover:bg-primary-light/30' 
                                        : 'border-teal-100 hover:border-teal-500 hover:bg-teal-50/30'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded flex items-center justify-center mr-4 transition-colors ${
                                    hasOrg 
                                        ? 'bg-blue-100 text-blue-600 group-hover:bg-primary group-hover:text-white' 
                                        : 'bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white'
                                }`}>
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div className="flex-1 overflow-hidden pr-2">
                                    <div className="font-bold text-slate-800 group-hover:text-primary flex items-center gap-2 truncate">
                                        <span>{identity.organization?.name || '个人注册（无所属组织）'}</span>
                                        {identity.organization?.shortName && (
                                            <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-500 font-normal rounded">
                                                {identity.organization.shortName}
                                            </span>
                                        )}
                                        {!hasOrg && (
                                            <span className="text-xs px-1.5 py-0.5 bg-teal-50 text-teal-600 border border-teal-200 font-normal rounded">
                                                新生体验
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-500 flex items-center mt-1 gap-2">
                                        <span className="flex items-center">
                                            <UserCircle className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                            使用者：<strong>{identity.user.name}</strong> · {identity.department || '默认部门'}
                                        </span>
                                        <span className={`text-[10px] uppercase px-1.5 py-0.2 rounded-full font-semibold ${badge.class}`}>
                                            {badge.label}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors shrink-0" />
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 text-center">
                    <button 
                        onClick={onLogout}
                        className="text-slate-500 hover:text-red-600 text-sm flex items-center justify-center mx-auto transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" /> 退出当前账号
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IdentitySelector;
