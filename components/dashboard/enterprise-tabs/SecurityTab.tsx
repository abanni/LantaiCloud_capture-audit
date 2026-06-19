import React from 'react';
import { Shield, KeyRound, LogOut, AlertTriangle } from 'lucide-react';
import { Identity } from '../../../types';

interface SecurityTabProps {
    identity: Identity;
}

const isLegalRep = (role: string) => ['法定代表人', '拥有者'].includes(role);
const isAdmin = (role: string) => role === '管理员';
const canManage = (role: string) => ['法定代表人', '管理员', '拥有者'].includes(role);

const SecurityTab: React.FC<SecurityTabProps> = ({ identity }) => {
    return (
        <>
            {isAdmin(identity.role) && (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                    <div className="text-base font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                        <KeyRound className="w-5 h-5 text-slate-600" />
                        <span>所有权移交</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">将企业管理权限移交给其他成员。移交后，您将被降级为普通成员。</p>
                    <button 
                        onClick={() => alert("此敏感流程需要两阶段移动核验，请激活安全密钥再试。")}
                        className="px-4 py-2 border border-slate-200 bg-white text-slate-700 text-sm rounded hover:bg-slate-50 shadow-sm"
                    >
                        开始权属移交流程
                    </button>
                </div>
            )}

            {!isLegalRep(identity.role) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="text-base font-bold text-red-600 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2" /> 安全防护敏感区
                    </div>
                    
                    <div className="flex justify-between items-center py-4 border-b border-red-200/50 flex-wrap gap-4">
                        <div>
                            <div className="text-sm font-bold text-slate-800">退出该组织</div>
                            <div className="text-xs text-slate-500 mt-1">
                                {canManage(identity.role)
                                    ? '退出前请先将所有权移交给其他成员，否则企业将失去管理层。'
                                    : '退出后您将失去所有正在整理的或云盘里的档案工程权限。'}
                            </div>
                        </div>
                        <button 
                            onClick={() => alert(
                                canManage(identity.role)
                                    ? '请先完成所有权移交，再执行退出操作。'
                                    : '确认退出该组织？退出后需要企业管理员重新邀请方可加入。'
                            )}
                            className="px-4 py-2 border border-red-500 text-red-500 text-sm rounded hover:bg-red-100 bg-transparent transition-colors"
                        >
                            <LogOut className="w-4 h-4 inline mr-1" />退出该组织
                        </button>
                    </div>

                    {isAdmin(identity.role) && (
                        <div className="flex justify-between items-center pt-4 flex-wrap gap-4">
                            <div>
                                <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                    解散/注销本项企业
                                </div>
                                <div className="text-xs text-slate-500 mt-1">永久性删除企业空间以及全部绑定的兰台数字档案与工程归档，且永远无法找回！</div>
                            </div>
                            <button 
                                onClick={() => alert("确认注销前，请确保所有项目已完成归档并移交。")}
                                className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                            >
                                解散企业
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default SecurityTab;
