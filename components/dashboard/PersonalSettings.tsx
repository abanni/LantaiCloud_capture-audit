import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, Mail, Phone, Shield, Calendar, Lock, KeyRound, 
    Smartphone, CheckCircle2, MessageCircle, RefreshCw, 
    Trash2, Save, X, Plus, AlertCircle, Check, Info, Bell
} from 'lucide-react';
import { Identity } from '../types';
import UserSwitcher from '../common/UserSwitcher';
import ProfileTab from './settings-tabs/ProfileTab';
import SecurityTab from './settings-tabs/SecurityTab';
import NotificationTab from './settings-tabs/NotificationTab';
import AccountsTab from './settings-tabs/AccountsTab';

interface PersonalSettingsProps {
    identity: Identity;
    identities: Identity[];
    setCurrentIdentity: (identity: Identity) => void;
}

const PersonalSettings: React.FC<PersonalSettingsProps> = ({ 
    identity, 
    identities, 
    setCurrentIdentity 
}) => {
    const navigate = useNavigate();

    // Tabs: 'security' replaces old 'phone' + 'password'
    const [activeTab, setActiveTab] = useState<'info' | 'security' | 'notification' | 'binding'>('info');

    // Toast State
    const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' | 'info' }>({
        show: false,
        msg: '',
        type: 'success'
    });

    const triggerToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3500);
    };

    // Handle profile info update
    const handleSaveProfile = (name: string) => {
        const updatedIdentity = {
            ...identity,
            user: {
                ...identity.user,
                name,
            }
        };
        setCurrentIdentity(updatedIdentity);
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f0f2f5]">
            {/* Top Navigation / Breadcrumbs matching standard design */}
            <div className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 shadow-sm shrink-0 sticky top-0 z-10">
                <div className="flex items-center text-sm text-slate-500 gap-1.5 font-medium">
                    <span 
                        className="cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                        onClick={() => navigate('/dashboard')}
                    >
                        📂 首页
                    </span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-800 font-semibold text-xs">个人设置</span>
                </div>
                <div className="flex items-center gap-4">
                    <UserSwitcher 
                        identity={identity} 
                        identities={identities} 
                        setCurrentIdentity={setCurrentIdentity} 
                    />
                </div>
            </div>

            {/* Custom Self-Contained Notification Alert */}
            {toast.show && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[1100] px-5 py-3 rounded-xl shadow-2xl text-xs font-bold text-white flex items-center gap-3 animate-fade-in-down bg-slate-900 border border-slate-700 max-w-lg">
                    <div className="w-2 h-2 rounded-full bg-teal-400 shrink-0"></div>
                    <span className="flex-1 text-slate-100">{toast.msg}</span>
                    <button 
                        onClick={() => setToast(prev => ({ ...prev, show: false }))} 
                        className="text-slate-400 hover:text-white transition-colors"
                        title="关闭"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Main Content Scrollable Workspace - Matching My Projects margin style */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Visual Header Banner */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="relative group w-16 h-16 rounded-full overflow-hidden border-2 border-primary/25 bg-slate-100 shrink-0 select-none">
                            <img 
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" 
                                alt="avatar" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="text-[9px] text-white font-bold select-none">更换头像</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-lg font-bold text-slate-800 leading-tight">
                                {identity.user.name} 
                                <span className="text-xs bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full ml-2 font-bold inline-block">
                                    {identity.role || '超级管理员'}
                                </span>
                            </h1>
                            <p className="text-xs font-medium text-slate-400">
                                账号：admin &nbsp;•&nbsp; 隶属部门：{identity.department || '总经办'}
                            </p>
                        </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-400 font-medium">
                        创建时间: <span className="font-mono text-slate-600 font-bold">2024-10-31 08:58:34</span>
                    </div>
                </div>

                {/* Inner Sidebar Tabbed Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    
                    {/* Left Hand Tab list */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm space-y-1 md:col-span-1">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                                activeTab === 'info'
                                    ? 'bg-primary text-white shadow-md shadow-primary/10'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <User className="w-4 h-4 shrink-0" />
                            基本资料
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                                activeTab === 'security'
                                    ? 'bg-primary text-white shadow-md shadow-primary/10'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <Shield className="w-4 h-4 shrink-0" />
                            安全设置
                        </button>
                        <button
                            onClick={() => setActiveTab('notification')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                                activeTab === 'notification'
                                    ? 'bg-primary text-white shadow-md shadow-primary/10'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <Bell className="w-4 h-4 shrink-0" />
                            通知设置
                        </button>
                        <button
                            onClick={() => setActiveTab('binding')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                                activeTab === 'binding'
                                    ? 'bg-primary text-white shadow-md shadow-primary/10'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <RefreshCw className="w-4 h-4 shrink-0" />
                            第三方绑定
                        </button>
                    </div>

                    {/* Right Hand Config Content panel */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm md:col-span-3 overflow-hidden">
                        {activeTab === 'info' && (
                            <ProfileTab
                                identity={identity}
                                onSaveProfile={handleSaveProfile}
                                onToast={triggerToast}
                                onNavigatePhoneTab={() => setActiveTab('security')}
                            />
                        )}

                        {activeTab === 'security' && (
                            <SecurityTab
                                identity={identity}
                                onToast={triggerToast}
                            />
                        )}

                        {activeTab === 'notification' && (
                            <NotificationTab
                                onToast={triggerToast}
                            />
                        )}

                        {activeTab === 'binding' && (
                            <AccountsTab
                                onToast={triggerToast}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalSettings;
