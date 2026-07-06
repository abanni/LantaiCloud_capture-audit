
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Building2, User, UserPlus, UserCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Identity } from '../types';

interface LoginProps {
    onLoginSuccess: (identity?: Identity) => void;
    identities: Identity[];
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, identities }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'zs' | 'lj' | 'xq'>('zs');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            if (activeTab === 'zs') {
                onLoginSuccess(undefined);
            } else if (activeTab === 'xq') {
                onLoginSuccess(identities.find(id => id.user.name === '李娜'));
            } else {
                onLoginSuccess(identities.find(id => id.user.name === '李进'));
            }
        }, 600);
    };

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="bg-white w-full max-w-[900px] rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-5"
            >
                {/* Left: Branding */}
                <div className="md:col-span-2 bg-sidebar p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <img src="/logo.svg" alt="" className="w-10 h-10 shrink-0" />
                            <div>
                                <h1 className="text-lg font-bold">兰台云 · 数智档案</h1>
                                <p className="text-[10px] text-blue-300/70 tracking-wider">Lantai Cloud Digital Archive</p>
                            </div>
                        </div>
                        <div className="p-3.5 bg-white/[0.06] rounded-xl space-y-1">
                            <h3 className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                平台确权机制
                            </h3>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                每个工程项目须关联合规企业主体，创建人自动成为项目管理员，实行最小权限访问控制。
                            </p>
                        </div>
                    </div>
                    <div className="relative z-10 pt-6 border-t border-white/10 text-[10px] text-slate-500">
                        国家非遗与工程科学数字资产档案库 &copy; 2026
                    </div>
                    <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-primary/15 rounded-full blur-3xl" />
                </div>

                {/* Right: Login */}
                <div className="md:col-span-3 p-8 flex flex-col justify-between bg-white">
                    <div className="space-y-5">
                        <div>
                            <h2 className="text-lg font-bold text-text-primary">登入主控系统</h2>
                            <p className="text-xs text-text-tertiary mt-0.5">选择演示账号快速体验</p>
                        </div>

                        {/* Persona selector */}
                        <div className="grid grid-cols-3 gap-2.5">
                            {[
                                { key: 'zs' as const, label: '张伟', desc: '多组织管理员', icon: User },
                                { key: 'lj' as const, label: '李进', desc: '个人体验用户', icon: UserPlus },
                                { key: 'xq' as const, label: '李娜', desc: '档案馆审核人员', icon: UserCheck, audit: true },
                            ].map(({ key, label, desc, icon: Icon, audit }) => {
                                const isActive = activeTab === key;
                                const activeBg = audit ? 'bg-emerald-600' : 'bg-primary';
                                const hoverBg = audit ? 'hover:bg-emerald-50' : 'hover:bg-slate-100';
                                return (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`relative py-3 px-3.5 rounded-xl text-xs font-semibold text-left flex items-center gap-3 cursor-pointer transition-all ${
                                        isActive
                                            ? `${activeBg} text-white shadow-xs`
                                            : `bg-slate-50 text-slate-600 ${hoverBg}`
                                    }`}
                                >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    <div>
                                        <div>{label}</div>
                                        <div className={`text-[9px] font-normal ${isActive ? 'text-white/70' : 'text-slate-400'}`}>{desc}</div>
                                    </div>

                                    {isActive && (
                                        <svg className="ml-auto w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </button>
                                );
                            })}
                        </div>

                        {/* Info card */}
                        <div className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                            activeTab === 'zs' ? 'bg-blue-50' : activeTab === 'xq' ? 'bg-emerald-50 border border-emerald-200' : 'bg-emerald-50'
                        }`}>
                            <p className={activeTab === 'xq' ? 'text-emerald-800' : 'text-slate-600'}>
                                {activeTab === 'zs' && <><strong className="text-text-primary">张伟</strong>（139****1234）是资深工程档案管理员，关联<strong>无无科技</strong>、<strong>清陶动力</strong>、<strong>常熟建工</strong>三个组织，登录后可选身份进入对应工作台。</>}
                                {activeTab === 'xq' && <><strong className="text-emerald-900">李娜</strong>（0512****5678）是<strong className="text-emerald-900">昆山市城建档案馆</strong>审核人员，登录后可进行档案审核、登记、指导等操作。</>}
                                {activeTab === 'lj' && <><strong className="text-text-primary">李进</strong>（177****8899）是新注册个人用户，暂未挂靠组织，登录后可直接体验组织入驻流程。</>}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-3.5">
                            <div>
                                <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">模拟登录账号</label>
                                <input
                                    type="text"
                                    readOnly
                                    className="block w-full px-3 py-2.5 border border-border rounded-lg bg-slate-50 text-xs text-text-primary font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    value={activeTab === 'zs' ? 'zhangsan@wuwu.tech (13998881234)' : activeTab === 'xq' ? 'xuqin@kunshan-archives.cn (051256788888)' : 'lijin@lantai.personal (17788888899)'}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-60 ${
                                    activeTab === 'xq' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary hover:bg-primary-hover'
                                }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        登录中...
                                    </span>
                                ) : (
                                    <>一键登录 <ArrowRight className="w-3.5 h-3.5" /></>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="pt-5 border-t border-border flex items-center justify-between text-[10px] text-text-tertiary">
                        <span>TLS 1.3 / 国密 SM4</span>
                        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 演示沙箱</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;