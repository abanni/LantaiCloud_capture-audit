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
    Database,
    FileSearch,
    Send,
    ShieldCheck,
    UserCheck,
    Files,
    BookOpen,
    BarChart2,
    Stamp
} from 'lucide-react';
import { Identity } from '../../types';

interface SidebarProps {
    identity: Identity;
    onSwitchIdentity: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ identity, onSwitchIdentity }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { 
            path: '/dashboard', 
            label: '主页', 
            icon: LayoutDashboard 
        },
        { 
            path: '/archive-capture', 
            label: '档案著录', 
            icon: FolderOpen,
            children: [
                { path: '/dashboard-new', label: '新建著录', icon: PlusSquare },
                { path: '/projects', label: '我的著录', icon: FolderOpen }
            ]
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
                { path: '/audit-statistics', label: '统计分析', icon: BarChart2 }
            ]
        },
        { 
            path: '/archive-center-group', 
            label: '数字馆藏', 
            icon: Archive,
            children: [
                { path: '/archive-center', label: '我的档案馆', icon: Archive },
                { path: '/archive-search', label: '综合查询', icon: Search },
                { path: '/archive-full-text', label: '全文检索', icon: FileSearch }
            ]
        },
        { 
            path: '/archive-util-group', 
            label: '利用借阅', 
            icon: Briefcase,
            children: [
                { path: '/archive-apply', label: '借阅申请', icon: Send },
                { path: '/archive-approve', label: '借阅审批', icon: ShieldCheck }
            ]
        }
    ];

    const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>({});

    React.useEffect(() => {
        menuItems.forEach(item => {
            if (item.children?.some(child => {
                if (child.path === '/dashboard-new') {
                    return location.pathname === '/dashboard' && location.state?.activeModal === 'archive';
                }
                return location.pathname === child.path;
            })) {
                setExpandedMenus(prev => {
                    if (!prev[item.path]) {
                        return { ...prev, [item.path]: true };
                    }
                    return prev;
                });
            }
        });
    }, [location.pathname, location.state]);

    return (
        <div className="w-[240px] bg-[#001529] text-white flex flex-col shrink-0">
            {/* Brand Header */}
            <div className="h-16 flex items-center px-4 font-bold bg-[#002140] border-b border-gray-700/50 shadow-sm relative overflow-hidden cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="flex items-center gap-2.5 z-10">
                    <img 
                        src="/logo.svg" 
                        alt="兰台云 Logo" 
                        className="w-9 h-9" 
                        referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                        <span className="text-sm font-bold leading-tight tracking-wide text-white">兰台云数智档案</span>
                    </div>
                </div>
                {/* Decorative bg element */}
                <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-white/5 rounded-full blur-xl"></div>
            </div>

            <div className="flex-1 py-4 flex flex-col gap-0.5 select-none overflow-y-auto">
                {menuItems.map((item) => {
                    const hasChildren = !!item.children;
                    const hasChildrenActive = item.children?.some(child => {
                        if (child.path === '/dashboard-new') {
                            return location.pathname === '/dashboard' && location.state?.activeModal === 'archive';
                        }
                        return location.pathname === child.path;
                    });
                    const isParentActive = !hasChildren && (
                        item.path === '/dashboard'
                            ? (location.pathname === '/dashboard' && location.state?.activeModal !== 'archive')
                            : location.pathname === item.path
                    );
                    const isAnyActive = isParentActive || hasChildrenActive;
                    const isExpanded = hasChildren ? !!expandedMenus[item.path] : false;

                    return (
                        <div key={item.path} className="flex flex-col">
                            {/* Main Parent Item */}
                            <div
                                onClick={() => {
                                    if (hasChildren) {
                                        setExpandedMenus(prev => ({
                                            ...prev,
                                            [item.path]: !prev[item.path]
                                        }));
                                    } else {
                                        navigate(item.path);
                                    }
                                }}
                                className={`
                                    flex items-center px-6 py-3.5 cursor-pointer transition-all duration-205 group
                                    border-l-4
                                    ${isParentActive 
                                        ? 'bg-[#1890ff] border-white font-bold text-white' 
                                        : hasChildrenActive 
                                            ? 'bg-[#1890ff]/10 border-teal-500 font-bold text-white' 
                                            : 'border-transparent hover:bg-[#1890ff]/40 text-slate-300 hover:text-white'}
                                `}
                            >
                                <item.icon className={`w-4.5 h-4.5 mr-3 shrink-0 ${isAnyActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition'}`} />
                                <span className="text-xs tracking-wide">{item.label}</span>
                                {item.children && (
                                    <ChevronRight className={`w-3.5 h-3.5 ml-auto text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-90 text-white font-bold' : ''}`} />
                                )}
                            </div>

                            {/* Collapsible Submenus */}
                            {item.children && isExpanded && (
                                <div className="bg-[#000c17]/50 flex flex-col pl-4 pb-1 pt-0.5 border-l-2 border-[#1890ff]/10 animate-in slide-in-from-top-1 duration-150">
                                    {item.children.map((child) => {
                                        const isChildActive = child.path === '/dashboard-new'
                                            ? (location.pathname === '/dashboard' && location.state?.activeModal === 'archive')
                                            : location.pathname === child.path;
                                        return (
                                            <div
                                                key={child.path}
                                                onClick={() => {
                                                    if (child.path === '/dashboard-new') {
                                                        navigate('/dashboard', { state: { activeModal: 'archive' } });
                                                    } else {
                                                        navigate(child.path);
                                                    }
                                                }}
                                                className={`
                                                    flex items-center px-6 py-2.5 my-0.5 mr-2 rounded-lg cursor-pointer transition-all duration-150 text-xs font-semibold
                                                    ${isChildActive 
                                                        ? 'bg-[#1890ff] text-white font-bold translate-x-1 shadow-md' 
                                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/65'}
                                                `}
                                            >
                                                <child.icon className="w-3.5 h-3.5 mr-2.5 shrink-0" />
                                                <span>{child.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 组织管理 / 企业切换 at Bottom */}
            <div className="p-4 bg-[#000c17] border-t border-gray-800">
                <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-[#002140] px-2 py-2.5 -mx-2 rounded-lg transition-colors group"
                    onClick={() => navigate('/enterprise')}
                    title="点击进入组织管理"
                >
                    <div className="flex items-center gap-3 overflow-hidden flex-1 mr-2">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                            <Building2 className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-gray-250 group-hover:text-white truncate" title={identity.organization?.name || '个人注册用户'}>
                            {identity.organization?.shortName || identity.organization?.name || '独立用户'}
                        </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors shrink-0" />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
