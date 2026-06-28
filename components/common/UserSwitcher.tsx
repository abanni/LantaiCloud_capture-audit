import React, { useState, useRef, useEffect } from 'react';
import { Identity } from '../../types';
import { 
    ChevronDown, 
    UserCircle, 
    Building2, 
    LogOut, 
    Check, 
    Sparkles,
    User,
    Settings,
    Palette,
    X,
    Phone,
    Mail,
    Shield,
    Calendar,
    RefreshCw,
    Save,
    Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserSwitcherProps {
    identity: Identity;
    identities: Identity[];
    setCurrentIdentity: (identity: Identity) => void;
    onLogout?: () => void;
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({ 
    identity, 
    identities, 
    setCurrentIdentity,
    onLogout 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Settings States
    const [showPersonalSettings, setShowPersonalSettings] = useState(false);
    const [showLayoutSettings, setShowLayoutSettings] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

    const [personalInfo, setPersonalInfo] = useState({
        name: identity.user.name || '张三',
        idCard: '320583200001019999',
        phone: '15888888888',
        email: 'ry@163.com',
        gender: 'male'
    });

    const [passwordFields, setPasswordFields] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [layoutConfig, setLayoutConfig] = useState({
        themeStyle: 'dark', // 'dark' | 'light'
        themeColor: 'classic', // 'classic' | 'emerald' | 'indigo' | 'crimson' | 'amber'
        topNav: false,
        tagsViews: true,
        fixedHeader: false,
        showLogo: true,
        dynamicTitle: false
    });

    const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({
        show: false,
        msg: '',
        type: 'success'
    });

    const addToast = (msg: string, type: 'success' | 'error') => {
        setToast({ show: true, msg, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync personalInfo name when identity changes
    useEffect(() => {
        setPersonalInfo(prev => ({
            ...prev,
            name: identity.user.name
        }));
    }, [identity]);

    const handleSavePersonalSettings = () => {
        if (activeTab === 'info') {
            if (!personalInfo.name.trim()) {
                addToast('姓名不能为空哦', 'error');
                return;
            }
            // Update the current identity's user name
            const updatedIdentity = {
                ...identity,
                user: {
                    ...identity.user,
                    name: personalInfo.name,
                }
            };
            setCurrentIdentity(updatedIdentity);
            addToast('个人资料保存成功！', 'success');
        } else {
            if (!passwordFields.oldPassword || !passwordFields.newPassword || !passwordFields.confirmPassword) {
                addToast('请完整填写密码所有项', 'error');
                return;
            }
            if (passwordFields.newPassword !== passwordFields.confirmPassword) {
                addToast('两次输入的新密码不一致，请检查', 'error');
                return;
            }
            addToast('密码修改成功，安全通道已刷新！', 'success');
            setPasswordFields({ oldPassword: '', newPassword: '', confirmPassword: '' });
        }
    };

    const handleSaveLayoutSettings = () => {
        addToast('配置已成功持久化至用户工作域！', 'success');
        setShowLayoutSettings(false);
    };

    const handleResetLayoutSettings = () => {
        setLayoutConfig({
            themeStyle: 'dark',
            themeColor: 'classic',
            topNav: false,
            tagsViews: true,
            fixedHeader: false,
            showLogo: true,
            dynamicTitle: false
        });
        addToast('系统布局配置已恢复缺省！', 'success');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button - Very elegant layout with circular avatar portrait image */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2.5 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-all border border-slate-200 shadow-sm hover:border-slate-200 text-left cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
                id="user_menu_trigger"
            >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border border-slate-100 shrink-0 text-white shadow-inner overflow-hidden select-none bg-slate-100">
                    <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" 
                        alt="avatar" 
                        className="w-full h-full object-cover pointer-events-none"
                        referrerPolicy="no-referrer"
                    />
                </div>
                <div className="flex flex-col items-start leading-none gap-0.5 max-w-[120px]">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1 truncate w-full">
                        {identity.user.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold truncate w-full">
                        {identity.archiveOrg?.shortName || identity.archiveOrg?.name || identity.organization?.shortName || '未授权企业'}
                    </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Floating Dropdown Panel matching requested layout structure */}
            {isOpen && (
                <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-50 animate-fade-in-up"
                    id="user_menu_dropdown"
                >
                    {/* User Mini Profile Banner */}
                    <div className="px-4 py-3 border-b border-slate-100/70 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-100 shrink-0 select-none">
                            <img 
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" 
                                alt="avatar" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="text-xs font-bold text-slate-800 leading-tight truncate">
                                {identity.user.name}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate mt-0.5 font-bold">
                                账号: admin
                            </div>
                        </div>
                    </div>

                    {/* Menu links as requested */}
                    <div className="p-1 space-y-0.5">
                        <button
                            onClick={() => {
                                navigate('/settings');
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors text-left cursor-pointer border border-transparent hover:border-slate-100"
                            id="menu_personal_settings"
                        >
                            <User className="w-4 h-4 text-slate-400" />
                            个人设置
                        </button>
                        
                        <button
                            onClick={() => {
                                setShowLayoutSettings(true);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors text-left cursor-pointer border border-transparent hover:border-slate-100"
                            id="menu_layout_settings"
                        >
                            <Settings className="w-4 h-4 text-slate-400" />
                            布局设置
                        </button>
                    </div>

                    <div className="border-t border-slate-100 mt-1.5 pt-1.5 px-1.5">
                        <button 
                            onClick={() => {
                                setIsOpen(false);
                                if (onLogout) {
                                    onLogout();
                                } else {
                                    navigate('/');
                                    window.location.reload(); // Hard reset index
                                }
                            }}
                            className="w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-black text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-colors cursor-pointer text-left"
                            id="menu_logout"
                        >
                            <LogOut className="w-3.5 h-3.5 mr-2.5 text-red-400" />
                            退出登录
                        </button>
                    </div>
                </div>
            )}

            {/* Custom Self-Contained Toast System */}
            {toast.show && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[1100] px-4 py-2.5 rounded-lg shadow-xl text-xs font-bold text-white flex items-center gap-2 animate-bounce bg-slate-900 border border-slate-700">
                    <span className={toast.type === 'success' ? 'text-green-400' : 'text-red-400'}>●</span>
                    {toast.msg}
                </div>
            )}

            {/* 1. Modal placeholder - Note: Personal settings has been migrated to its own page at /settings */}

            {/* 2. Layout Settings Modal (布局设置) */}
            {showLayoutSettings && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999]"
                    id="layout_settings_modal"
                >
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden shrink-0 flex flex-col h-[520px] relative">
                        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex justify-between items-center select-none">
                            <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <Palette className="w-4 h-4 text-primary" />
                                布局设置
                            </span>
                            <button 
                                onClick={() => setShowLayoutSettings(false)}
                                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                title="关闭"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-5 flex-1 overflow-y-auto space-y-5.5 text-left text-xs bg-white text-slate-700">
                            {/* 主题风格设置 */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-slate-800 text-xs select-none">主题风格设置</h3>
                                <div className="grid grid-cols-2 gap-3 select-none">
                                    {/* Option 1: Dark Sidebar */}
                                    <div 
                                        onClick={() => setLayoutConfig({...layoutConfig, themeStyle: 'dark'})}
                                        className={`border rounded-lg p-2.5 cursor-pointer flex gap-1.5 relative transition-all ${
                                            layoutConfig.themeStyle === 'dark' 
                                                ? 'border-primary ring-1 ring-primary bg-primary/[0.15]' 
                                                : 'border-slate-200 hover:border-slate-200 bg-white'
                                        }`}
                                    >
                                        <div className="w-5 h-10 bg-slate-800 rounded-sm shrink-0 border border-slate-950 border-r-0"></div>
                                        <div className="flex-1 flex flex-col justify-between py-0.5">
                                            <span className="text-[9.5px] font-bold text-slate-700 leading-none">暗色侧边栏</span>
                                            <div className="w-full h-3 bg-slate-100 rounded-sm border border-slate-200"></div>
                                        </div>
                                        {layoutConfig.themeStyle === 'dark' && (
                                            <div className="absolute right-1.5 top-1.5 bg-primary text-white rounded-full p-0.5">
                                                <Check className="w-2.5 h-2.5" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Option 2: Light Sidebar */}
                                    <div 
                                        onClick={() => setLayoutConfig({...layoutConfig, themeStyle: 'light'})}
                                        className={`border rounded-lg p-2.5 cursor-pointer flex gap-1.5 relative transition-all ${
                                            layoutConfig.themeStyle === 'light' 
                                                ? 'border-primary ring-1 ring-primary bg-primary/[0.15]' 
                                                : 'border-slate-200 hover:border-slate-200 bg-white'
                                        }`}
                                    >
                                        <div className="w-5 h-10 bg-slate-100 rounded-sm shrink-0 border border-slate-200 border-r-0"></div>
                                        <div className="flex-1 flex flex-col justify-between py-0.5">
                                            <span className="text-[9.5px] font-bold text-slate-700 leading-none">亮色侧边栏</span>
                                            <div className="w-full h-3 bg-slate-100 rounded-sm border border-slate-200"></div>
                                        </div>
                                        {layoutConfig.themeStyle === 'light' && (
                                            <div className="absolute right-1.5 top-1.5 bg-primary text-white rounded-full p-0.5">
                                                <Check className="w-2.5 h-2.5" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <span className="font-bold text-slate-700 text-xs">主题颜色</span>
                                    <div className="flex items-center gap-1.5 select-none">
                                        {[
                                            { id: 'classic', colorBg: 'bg-blue-500', label: '经典蓝' },
                                            { id: 'emerald', colorBg: 'bg-emerald-500', label: '翡翠绿' },
                                            { id: 'indigo', colorBg: 'bg-primary/100', label: '靛蓝' },
                                            { id: 'crimson', colorBg: 'bg-red-500', label: '绯红' },
                                            { id: 'amber', colorBg: 'bg-amber-500', label: '琥珀' },
                                        ].map(colorItem => (
                                            <button
                                                key={colorItem.id}
                                                onClick={() => setLayoutConfig({...layoutConfig, themeColor: colorItem.id})}
                                                title={colorItem.label}
                                                className={`w-5 h-5 rounded-full flex items-center justify-center cursor-pointer border border-white hover:scale-110 transition-transform ${colorItem.colorBg}`}
                                            >
                                                {layoutConfig.themeColor === colorItem.id && (
                                                    <Check className="w-3 h-3 text-white" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 my-3"></div>

                            {/* 系统布局配置 */}
                            <div className="space-y-3.5">
                                <h3 className="font-bold text-slate-800 text-xs select-none">系统布局配置</h3>
                                
                                <div className="flex items-center justify-between text-xs text-gray-750 font-bold select-none">
                                    <span>开启 TopNav</span>
                                    <button 
                                        onClick={() => setLayoutConfig({...layoutConfig, topNav: !layoutConfig.topNav})}
                                        title="开启 TopNav"
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                            layoutConfig.topNav ? 'bg-primary' : 'bg-slate-200'
                                        }`}
                                    >
                                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            layoutConfig.topNav ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-750 font-bold select-none">
                                    <span>开启 Tags-Views</span>
                                    <button 
                                        onClick={() => setLayoutConfig({...layoutConfig, tagsViews: !layoutConfig.tagsViews})}
                                        title="开启 Tags-Views"
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                            layoutConfig.tagsViews ? 'bg-primary' : 'bg-slate-200'
                                        }`}
                                    >
                                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            layoutConfig.tagsViews ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-750 font-bold select-none">
                                    <span>固定 Header</span>
                                    <button 
                                        onClick={() => setLayoutConfig({...layoutConfig, fixedHeader: !layoutConfig.fixedHeader})}
                                        title="固定 Header"
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                            layoutConfig.fixedHeader ? 'bg-primary' : 'bg-slate-200'
                                        }`}
                                    >
                                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            layoutConfig.fixedHeader ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-750 font-bold select-none">
                                    <span>显示 Logo</span>
                                    <button 
                                        onClick={() => setLayoutConfig({...layoutConfig, showLogo: !layoutConfig.showLogo})}
                                        title="显示 Logo"
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                            layoutConfig.showLogo ? 'bg-primary' : 'bg-slate-200'
                                        }`}
                                    >
                                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            layoutConfig.showLogo ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-750 font-bold select-none">
                                    <span>动态标题</span>
                                    <button 
                                        onClick={() => setLayoutConfig({...layoutConfig, dynamicTitle: !layoutConfig.dynamicTitle})}
                                        title="动态标题"
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                            layoutConfig.dynamicTitle ? 'bg-primary' : 'bg-slate-200'
                                        }`}
                                    >
                                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            layoutConfig.dynamicTitle ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Save & Reset buttons */}
                        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3 select-none">
                            <button
                                onClick={handleSaveLayoutSettings}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-650 text-xs font-black rounded shadow-sm hover:shadow transition-all cursor-pointer"
                            >
                                <Save className="w-3.5 h-3.5" />
                                保存配置
                            </button>
                            <button
                                onClick={handleResetLayoutSettings}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-slate-200 bg-white hover:bg-slate-50/60 text-slate-600 text-xs font-bold rounded shadow-sm transition-all cursor-pointer"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                重置配置
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserSwitcher;
