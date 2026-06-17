import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Building2, 
    FolderOpen, 
    ChevronRight, 
    Archive, 
    Search, 
    Briefcase,
    PlusSquare,
    FileSearch,
    Send,
    ShieldCheck,
    Files,
    BookOpen,
    BarChart2,
} from 'lucide-react';
import { Identity } from '../../types';

interface SidebarProps {
    identity: Identity;
    onSwitchIdentity: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ identity, onSwitchIdentity }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const active = location.pathname;

    const menuItems = [
        { path: '/dashboard', label: '主页', icon: LayoutDashboard },
        {
            path: '/archive-capture',
            label: '档案著录',
            icon: FolderOpen,
            children: [
                { path: '/dashboard-new', label: '新建著录', icon: PlusSquare },
                { path: '/projects', label: '我的著录', icon: FolderOpen },
            ],
        },
        {
            path: '/archive-audit-group',
            label: '档案审核',
            icon: ShieldCheck,
            children: [
                { path: '/audit-dashboard', label: '工作台', icon: LayoutDashboard },
                { path: '/audit-registration', label: '档案登记', icon: Files },
                { path: '/audit-projects', label: '档案审核', icon: ShieldCheck },
                { path: '/audit-project-info', label: '项目信息', icon: Search },
                { path: '/audit-guidance', label: '档案指导', icon: BookOpen },
                { path: '/audit-statistics', label: '统计分析', icon: BarChart2 },
            ],
        },
        {
            path: '/archive-center-group',
            label: '数字馆藏',
            icon: Archive,
            children: [
                { path: '/archive-center', label: '我的档案馆', icon: Archive },
                { path: '/archive-search', label: '综合查询', icon: Search },
                { path: '/archive-full-text', label: '全文检索', icon: FileSearch },
            ],
        },
        {
            path: '/archive-util-group',
            label: '利用借阅',
            icon: Briefcase,
            children: [
                { path: '/archive-apply', label: '借阅申请', icon: Send },
                { path: '/archive-approve', label: '借阅审批', icon: ShieldCheck },
            ],
        },
    ];

    const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>({});

    const isChildActive = (children: { path: string }[] | undefined) =>
        children?.some(c => c.path === '/dashboard-new'
            ? (active === '/dashboard' && location.state?.activeModal === 'archive')
            : active === c.path);

    return (
        <div className="w-[232px] bg-sidebar text-white flex flex-col shrink-0 select-none">
            {/* Brand */}
            <div
                className="h-14 flex items-center px-4 gap-2.5 cursor-pointer border-b border-white/5"
                onClick={() => navigate('/dashboard')}
            >
                <img src="/logo.svg" alt="" className="w-8 h-8" />
                <span className="text-sm font-bold tracking-wide">兰台云数智档案</span>
            </div>

            {/* Menu */}
            <nav className="flex-1 py-3 overflow-y-auto space-y-0.5 px-2">
                {menuItems.map((item) => {
                    const hasChildren = !!item.children;
                    const childActive = isChildActive(item.children);
                    const isActive = !hasChildren && active === item.path;
                    const expanded = !!(hasChildren && expandedMenus[item.path]);

                    return (
                        <div key={item.path}>
                            {/* Parent */}
                            <button
                                onClick={() => {
                                    if (hasChildren) {
                                        setExpandedMenus(prev =>
                                            prev[item.path] ? {} : { [item.path]: true }
                                        );
                                    } else {
                                        navigate(item.path);
                                    }
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all duration-150 group
                                    ${isActive || (childActive && !expanded)
                                        ? 'bg-primary text-white font-semibold'
                                        : 'text-slate-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <item.icon className="w-4 h-4 shrink-0" />
                                <span className="flex-1 text-left">{item.label}</span>
                                {hasChildren && (
                                    <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
                                )}
                            </button>

                            {/* Children */}
                            {hasChildren && expanded && (
                                <div className="ml-3 mt-0.5 space-y-0.5 border-l border-white/10 pl-2">
                                    {item.children!.map((child) => {
                                        const isChildActive = child.path === '/dashboard-new'
                                            ? (active === '/dashboard' && location.state?.activeModal === 'archive')
                                            : active === child.path;
                                        return (
                                            <button
                                                key={child.path}
                                                onClick={() => {
                                                    setExpandedMenus({ [item.path]: true });
                                                    if (child.path === '/dashboard-new') {
                                                        navigate('/dashboard', { state: { activeModal: 'archive' } });
                                                    } else {
                                                        navigate(child.path);
                                                    }
                                                }}
                                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-150
                                                    ${isChildActive
                                                        ? 'bg-primary/20 text-primary font-semibold'
                                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                <child.icon className="w-3.5 h-3.5 shrink-0" />
                                                <span>{child.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Organization */}
            <div className="px-3 py-3 border-t border-white/5">
                <button
                    onClick={() => navigate('/enterprise')}
                    className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-150 group"
                >
                    <div className="w-7 h-7 bg-primary/20 text-primary rounded flex items-center justify-center shrink-0">
                        <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 text-left truncate">
                        {identity.organization?.shortName || identity.organization?.name || '独立用户'}
                    </span>
                    <ChevronRight className="w-3 h-3 shrink-0" />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
