import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Building2, 
    FolderOpen, 
    ChevronRight, 
    Search, 
    PlusSquare,
    ShieldCheck,
    Files,
    BookOpen,
    BarChart2,
    ClipboardCheck,
    ScrollText,
} from 'lucide-react';
import { Identity } from '../../types';

interface SidebarProps {
    identity: Identity;
    onSwitchIdentity: () => void;
}

const isAuditor = (identity: Identity) => !!identity.archiveOrg;

const Sidebar: React.FC<SidebarProps> = ({ identity, onSwitchIdentity }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const active = location.pathname;

    const auditor = isAuditor(identity);

    const recordingMenuItems = [
        { path: '/capture-dashboard', label: '主页', icon: LayoutDashboard },
        { path: '/newproject', label: '新建档案', icon: PlusSquare },
        { path: '/projects', label: '我的档案', icon: FolderOpen },
    ];

    const auditMenuItems: {
        path: string;
        label: string;
        icon: React.ComponentType<{ size?: number; className?: string }>;
    }[] = [
        { path: '/audit-dashboard', label: '工作台', icon: LayoutDashboard },
        { path: '/audit-guidance', label: '档案指导', icon: BookOpen },
        { path: '/audit-registration', label: '档案登记', icon: Files },
        { path: '/audit-projects', label: '档案审核', icon: ShieldCheck },
        { path: '/audit-project-info', label: '项目信息', icon: Search },
        { path: '/audit-statistics', label: '统计分析', icon: BarChart2 },
        { path: '/print/acceptance-opinion', label: '验收意见书', icon: ClipboardCheck },
        { path: '/print/receipt-certificate', label: '接收凭证', icon: ScrollText },
    ];

    const isActive = (path: string) => active === path;

    const handleMenuClick = (path: string) => navigate(path);

    const handleBrandClick = () => {
        navigate(auditor ? '/audit-dashboard' : '/capture-dashboard');
    };

    return (
        <div className="w-[232px] bg-sidebar text-white flex flex-col shrink-0 select-none">
            {/* Brand */}
            <div
                className="h-14 flex items-center px-4 gap-2.5 cursor-pointer border-b border-white/5"
                onClick={handleBrandClick}
            >
                <img src="/logo.svg" alt="" className="w-8 h-8" />
                <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-wide">兰台云数智档案</span>
                    <span className="text-[8px] text-slate-500 font-mono -mt-0.5">LantaiCloud v0.1</span>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 py-3 overflow-y-auto space-y-0.5 px-2">
                {(auditor ? auditMenuItems : recordingMenuItems).map((item) => (
                    <button
                        key={item.path}
                        onClick={() => handleMenuClick(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all duration-150 group
                            ${isActive(item.path)
                                ? `${auditor ? 'bg-emerald-600' : 'bg-primary'} text-white font-semibold`
                                : 'text-slate-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Organization / Archive */}
            <div className="px-3 py-3 border-t border-white/5">
                <button
                    onClick={() => navigate(auditor ? '/archive-mgmt' : '/enterprise')}
                    className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-150 group"
                >
                    <div className={`w-7 h-7 ${auditor ? 'bg-emerald-600/20 text-emerald-500' : 'bg-primary/20 text-primary'} rounded flex items-center justify-center shrink-0`}>
                        <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 text-left truncate">
                        {auditor ? (identity.archiveOrg?.shortName || identity.archiveOrg?.name) : (identity.organization?.shortName || identity.organization?.name || '独立用户')}
                    </span>
                    <ChevronRight className="w-3 h-3 shrink-0" />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
