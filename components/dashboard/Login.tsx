
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Building2, Lock, Users, Sparkles, HelpCircle, User, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { Identity } from '../types';

interface LoginProps {
    onLoginSuccess: (identity?: Identity) => void;
    identities: Identity[];
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, identities }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'zs' | 'lj'>('zs');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            if (activeTab === 'zs') {
                onLoginSuccess(undefined);
            } else {
                const liJin = identities.find(id => id.user.name === '李进');
                onLoginSuccess(liJin);
            }
        }, 600);
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-5 border border-slate-200"
            >
                {/* Left Panel: Branding */}
                <div className="md:col-span-2 bg-[#001529] p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-6 z-10">
                        <div className="flex items-center gap-3.5">
                            <img 
                                src="/logo.svg" 
                                alt="兰台云 Logo" 
                                className="w-11 h-11 shrink-0" 
                                referrerPolicy="no-referrer"
                            />
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">兰台云 · 数智档案</h1>
                                <p className="text-[9px] text-primary-light uppercase tracking-widest font-mono font-bold">Lantai Cloud Digital Archive</p>
                            </div>
                        </div>
                        <div className="space-y-4 pt-4">
                            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                                <h3 className="text-xs font-bold text-blue-400 flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    平台高能确权机制
                                </h3>
                                <p className="text-[11px] text-slate-300 leading-relaxed font-light">
                                    依照兰台管理策略，每个工程项目必须关联合规的企业主体，创建人自动成为项目管理员，实行最小权限访问控制。
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="z-10 pt-8 border-t border-white/15">
                        <div className="text-[10px] text-slate-400 font-mono">
                            国家非遗与工程科学数字资产档案库
                            <br />
                            &copy; 2026 Lantai Cloud Platform.
                        </div>
                    </div>
                    <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
                </div>

                {/* Right Panel: Login Form */}
                <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-between bg-white">
                    <div className="space-y-6">
                        <div className="text-center md:text-left space-y-1">
                            <h2 className="text-xl font-bold text-slate-800">登入主控系统</h2>
                            <p className="text-slate-400 text-xs">提供模拟演示账号，您可通过下方快捷键极速登录对比差异</p>
                        </div>

                        {/* Persona selector */}
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setActiveTab('zs')}
                                className={`relative py-3.5 px-3 rounded-xl text-xs font-bold transition-all text-left flex items-start gap-3 cursor-pointer overflow-hidden ${
                                    activeTab === 'zs' 
                                        ? 'bg-primary text-white shadow-sm' 
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                            >
                                {activeTab === 'zs' && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary"
                                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                    />
                                )}
                                <span className="relative z-10 mt-0.5">
                                    <User className="w-4 h-4" />
                                </span>
                                <div className="relative z-10">
                                    <div className={activeTab === 'zs' ? 'text-white' : 'text-slate-800'}>张三</div>
                                    <span className={`${activeTab === 'zs' ? 'text-blue-200' : 'text-slate-400'} text-[9px] font-normal`}>多组织 · 大客户管理员</span>
                                </div>
                                {activeTab === 'zs' && <CheckIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 relative z-10" />}
                            </button>
                            <button 
                                onClick={() => setActiveTab('lj')}
                                className={`relative py-3.5 px-3 rounded-xl text-xs font-bold transition-all text-left flex items-start gap-3 cursor-pointer overflow-hidden ${
                                    activeTab === 'lj' 
                                        ? 'bg-primary text-white shadow-sm' 
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                            >
                                {activeTab === 'lj' && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary"
                                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                    />
                                )}
                                <span className="relative z-10 mt-0.5">
                                    <UserPlus className="w-4 h-4" />
                                </span>
                                <div className="relative z-10">
                                    <div className={activeTab === 'lj' ? 'text-white' : 'text-slate-800'}>李进</div>
                                    <span className={`${activeTab === 'lj' ? 'text-blue-200' : 'text-slate-400'} text-[9px] font-normal`}>新注册 · 个人体验</span>
                                </div>
                                {activeTab === 'lj' && <CheckIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 relative z-10" />}
                            </button>
                        </div>

                        {/* Info card */}
                        {activeTab === 'zs' ? (
                            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-xs leading-relaxed">
                                <div className="text-blue-800 font-bold flex items-center gap-1.5 mb-1 text-[11px]">
                                    <Users className="w-3.5 h-3.5" />
                                    张三 (139****1234) 体验要点：
                                </div>
                                <p className="text-slate-500 font-normal text-[11px]">
                                    张三是一位资深的工程档案管理员。登录后系统会自动展示<strong>【请选择登录身份】</strong>多重角色选择界面。他能在<strong>无无科技</strong>、<strong>清陶动力</strong>与<strong>常熟建工</strong>的业务盘中自如无缝穿透并对档案项目进行数字确权！
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs leading-relaxed">
                                <div className="text-emerald-800 font-bold flex items-center gap-1.5 mb-1 text-[11px]">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    李进 (177****8899) 体验要点：
                                </div>
                                <p className="text-slate-500 font-normal text-[11px]">
                                    李进是一位<strong>新注册的个人用户</strong>，名下暂未挂靠任何组织。登录后他会直接进入个人工作台，体验如何通过<strong>组织入驻申请向导</strong>，快速注册并成为企业法定代表人的完整流程！
                                </p>
                            </div>
                        )}

                        {/* Login form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">模拟登录账号</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input 
                                        type="text" 
                                        readOnly
                                        title="模拟登录账号"
                                        className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 font-medium text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        value={activeTab === 'zs' ? 'zhangsan@wuwu.tech (13998881234)' : 'lijin@lantai.personal (17788888899)'}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-bold text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed bg-primary hover:bg-primary-hover`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        校验中...
                                    </span>
                                ) : (
                                    <>
                                        一键极速登录
                                        <ArrowRight className="ml-1.5 w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>TLS 1.3 / 国密 SM4</span>
                        <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> 演示沙箱版
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default Login;