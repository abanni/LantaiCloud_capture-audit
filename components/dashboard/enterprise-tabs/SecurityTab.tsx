import React from 'react';
import { Shield, KeyRound } from 'lucide-react';

const SecurityTab: React.FC = () => {
    return (
        <>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="text-base font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <KeyRound className="w-5 h-5 text-slate-600" />
                    <span>主要法定代表人/所有权移交</span>
                </div>
                <p className="text-sm text-slate-500 mb-4">将企业的最高治理权限（法定代表人/拥有者）移交给其他成员。移交后，您将被降级为普通成员。</p>
                <button 
                    onClick={() => alert("此敏感流程需要两阶段移动核验，请激活安全密钥再试。")}
                    className="px-4 py-2 border border-slate-200 bg-white text-slate-700 text-sm rounded hover:bg-slate-50 shadow-sm"
                >
                    开始权属移交流程
                </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="text-base font-bold text-red-600 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" /> 安全防护敏感区
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-red-155 [border-image:none] border-red-200/50 flex-wrap gap-4">
                    <div>
                        <div className="text-sm font-bold text-slate-800">安全退出该组织</div>
                        <div className="text-xs text-slate-500 mt-1">作为该组织的成员，退出后您将失去所有正在整理的或云盘里的档案工程权限。</div>
                    </div>
                    <button 
                        onClick={() => alert("项目所有权归属于主账户，个人无法在此强制解散")}
                        className="px-4 py-2 border border-red-500 text-red-500 text-sm rounded hover:bg-red-100 bg-transparent transition-colors"
                    >
                        退出该组织
                    </button>
                </div>

                <div className="flex justify-between items-center pt-4 flex-wrap gap-4">
                    <div>
                        <div className="text-sm font-bold text-slate-800">解散/注销本项企业</div>
                        <div className="text-xs text-slate-500 mt-1">永久性删除企业空间以及全部绑定的兰台数字档案与工程归档，且永远无法找回！</div>
                    </div>
                    <button 
                        onClick={() => alert("无法删除企业。为避免工程遗失，唯有法定代表人可申请注销流程。")}
                        className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-612 transition-colors [background-color:#ef4444]"
                    >
                        解散企业
                    </button>
                </div>
            </div>
        </>
    );
};

export default SecurityTab;
