import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    ChevronRight, Plus, Users, Folder, Briefcase, Hammer, 
    ShieldCheck, Network, Archive, HelpCircle, CheckCircle2, 
    MessageSquare, Inbox, Eye, CheckSquare, Square, Mail, MailOpen, Clock, X,
    Building2, PlusCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { Project, Identity } from '../types';
import NewProjectWizard from '../capture/wizards/NewProjectWizard';
import ProjectCard from './ProjectCard';
import OnboardingPanel from './OnboardingPanel';
import UserMessageCenter from './UserMessageCenter';

interface DashboardProps {
    identity: Identity;
    identities?: Identity[];
    setIdentities?: React.Dispatch<React.SetStateAction<Identity[]>>;
    setCurrentIdentity?: (identity: Identity) => void;
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

interface UserMessage {
    id: string;
    title: string;
    content: string;
    status: 'read' | 'unread';
    time: string;
    projectName: string;
    organizationId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    identity, 
    identities, 
    setIdentities, 
    setCurrentIdentity,
    projects,
    setProjects
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeModal, setActiveModal] = useState<'none' | 'archive'>('none');
    const [resumingProject, setResumingProject] = useState<Project | null>(null);

    useEffect(() => {
        if (location.state && location.state.activeModal === 'archive') {
            const pId = location.state.resumeProjectId;
            if (pId) {
                const found = projects.find(p => p.id === pId);
                if (found) {
                    setResumingProject(found);
                    setActiveModal('archive');
                }
            } else {
                setActiveModal('archive');
            }
            window.history.replaceState({}, document.title);
        }
    }, [location.state, projects]);

    const [messages, setMessages] = useState<UserMessage[]>([
        {
            id: 'msg_1', title: '建设规费与施工许可证待校核',
            content: '系统提示您负责管理的"张浦镇德国工业园标准厂房四期项目"：当前立卷目录"施工文件 - 新建设立"提示缺少建设规费凭证。',
            status: 'unread', time: '2026-06-04 11:20',
            projectName: '张浦镇德国工业园标准厂房四期项目', organizationId: 'org_wuwu'
        },
        {
            id: 'msg_2', title: '工程竣工图电子印章驳回重提',
            content: '在对"上海未来芯球体育文化装修工程"第二卷进行初审时发现，安全防护及大样竣工图上的设计院电子印章模糊不清。',
            status: 'unread', time: '2026-06-04 09:12',
            projectName: '上海未来芯球体育文化装修工程', organizationId: 'org_wuwu'
        },
        {
            id: 'msg_3', title: '卷内目录自动匹配会审通过',
            content: '系统已协助您自动校验了"昆山开发区城市广场地下主体工程"第一卷卷内目录。',
            status: 'unread', time: '2026-06-03 15:45',
            projectName: '昆山开发区城市广场地下主体工程', organizationId: 'org_wuwu'
        },
        {
            id: 'msg_4', title: '外协协作者临时权限回收报告',
            content: '鉴于您管理的"陆家镇童趣小镇幼儿园新建级配工程"已全部审核终打入库，已自动回收外部专家账号的临时查看口令。',
            status: 'read', time: '2026-06-01 10:00',
            projectName: '陆家镇童趣小镇幼儿园新建级配工程', organizationId: 'org_wuwu'
        },
        {
            id: 'msg_q1', title: '设备基础日常验收大样图更新',
            content: '设备部向"苏州清陶动力二期生产厂加装及扩建项目"上传了桩基施工记录及外购机械合格证5项新文档。',
            status: 'unread', time: '2026-06-04 10:30',
            projectName: '苏州清陶动力二期生产厂加装及扩建项目', organizationId: 'org_qt'
        },
        {
            id: 'msg_q2', title: '公共降水合规方案核校通报',
            content: '"周庄镇全域旅游基础设施提升一期"水利防洪大纲已通过苏州规划研究院的预查。',
            status: 'unread', time: '2026-06-03 14:00',
            projectName: '周庄镇全域旅游基础设施提升一期', organizationId: 'org_qt'
        },
        {
            id: 'msg_q3', title: '博览中心G区改造设计大样发布',
            content: '外协设计院向"昆山花桥国际博览中心G区改造"云盘上传了改机电主平面图。',
            status: 'read', time: '2026-06-02 09:15',
            projectName: '昆山花桥国际博览中心G区改造', organizationId: 'org_qt'
        },
        {
            id: 'msg_c1', title: '标准产业化园区立项批复回执',
            content: '"常熟市高新区标准产业化基地项目"立项原批件经市档案管网无缝回传并入库。',
            status: 'unread', time: '2026-06-04 08:30',
            projectName: '常熟市高新区标准产业化基地项目', organizationId: 'org_cs'
        },
        {
            id: 'msg_c2', title: '中冶沙家浜桩基合规初验警告',
            content: '系统预筛查"中冶建工沙家浜住宅二期桩基大纲"案卷，其中两册关键探伤报告缺失档案规范要求的工程坐标元数据。',
            status: 'unread', time: '2026-06-03 16:00',
            projectName: '中冶建工沙家浜住宅二期桩基大纲', organizationId: 'org_cs'
        },
        {
            id: 'msg_c3', title: '海虞镇综合楼工程立档延展声明',
            content: '鉴于"常熟市海虞镇卫生院综合楼改建项目"案卷已完成第一阶段审核，部分老底图需要重新高清去污扫描。',
            status: 'read', time: '2026-06-02 11:20',
            projectName: '常熟市海虞镇卫生院综合楼改建项目', organizationId: 'org_cs'
        }
    ]);

    const handleNewProjectCreated = (newProject: Project) => {
        const isResume = projects.some(p => p.id === newProject.id);
        if (isResume) {
            setProjects(prev => prev.map(p => {
                if (p.id === newProject.id) {
                    return { ...p, ...newProject, stage: '整理中', progress: 25, isCommitmentSigned: true, isCommitmentApproved: true };
                }
                return p;
            }));
        } else {
            setProjects(prev => [{ ...newProject, stage: '创建中', isManaged: true }, ...prev]);
        }
        setActiveModal('none');
        setResumingProject(null);
        navigate('/projects');
        const newMsg: UserMessage = {
            id: `msg_auto_${Date.now()}`,
            title: isResume ? `${newProject.name} 档案承诺书与审查登记完成` : `${newProject.name} 新建项目确权成功`,
            content: isResume
                ? `您已成功为项目"${newProject.name}"完成责任承诺书。`
                : `您成功创立了新档案项目："${newProject.name}"。系统已为其创建加密云盘存储。`,
            status: 'unread',
            time: new Date().toISOString().replace('T', ' ').substring(0, 16),
            projectName: newProject.name,
            organizationId: identity.organization?.id || ''
        };
        setMessages(prev => [newMsg, ...prev]);
    };

    const handleNewMessage = (msg: UserMessage) => {
        setMessages(prev => [msg, ...prev]);
    };

    const activeOrgId = identity.organization?.id || '';
    const orgProjects = activeOrgId ? projects.filter(p => p.organizationId === activeOrgId) : [];
    const managedProjects = orgProjects.filter(p => p.isManaged);
    const participatedProjects = orgProjects.filter(p => !p.isManaged);
    const orgMessages = activeOrgId 
        ? messages.filter(m => m.organizationId === activeOrgId).sort((a, b) => b.time.localeCompare(a.time))
        : [];

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-bg">
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeModal === 'archive' ? (
                    <div className="h-full min-h-[580px]">
<NewProjectWizard 
            identity={identity}
            onClose={() => { setActiveModal('none'); setResumingProject(null); }} 
            onFinish={handleNewProjectCreated}
            isFullWorkspace={true}
            resumeProject={resumingProject || undefined}
        />
                    </div>
                ) : !identity.organization ? (
                    <OnboardingPanel
                        identity={identity}
                        identities={identities}
                        setIdentities={setIdentities}
                        setCurrentIdentity={setCurrentIdentity}
                        setProjects={setProjects}
                        onNewMessage={handleNewMessage}
                    />
                ) : (
                    <div className="space-y-6">
                        {/* Org Header */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 bg-primary border border-primary/30 shadow-sm rounded-xl flex items-center justify-center text-white shrink-0">
                                        <Building2 className="w-5 h-5" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
                                            昆山城建档案馆 · 著录工作台
                                        </h2>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[9.5px] bg-primary/10 text-primary border border-primary/20 rounded-md py-0.5 px-2 font-bold tracking-wider uppercase">
                                                著录人员 ({identity.role})
                                            </span>
                                            <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.2 font-mono flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
                                                兰台云已存证
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 shrink-0">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                                <span>12320583MB1A12345X</span>
                            </div>
                        </div>

                        {/* Managed Projects with animation */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                        <Archive className="w-4 h-4" aria-hidden="true" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-base">我的项目</h3>
                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">{managedProjects.length}</span>
                                </div>
                                <button onClick={() => navigate('/projects')} className="text-xs text-white bg-primary hover:bg-primary-dark font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer">
                                    查看全部 <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                                </button>
                            </div>
                            {managedProjects.length > 0 ? (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
                                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                >
                                    {managedProjects.map((p, index) => (
                                        <motion.div
                                            key={p.id}
                                            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <ProjectCard project={p} index={index} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="bg-white rounded-xl py-10 px-6 text-center border border-dashed border-slate-300">
                                    <Archive className="w-10 h-10 mx-auto mb-3 text-slate-300" aria-hidden="true" />
                                    <p className="text-sm text-slate-500 mb-3">暂无管理的项目</p>
                                    <button onClick={() => navigate('/newproject')}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-all cursor-pointer shadow-xs"
                                    >
                                        <PlusCircle size={14} aria-hidden="true" /> 新建档案
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Participated Projects with animation */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 border border-slate-200">
                                        <Users className="w-4 h-4" aria-hidden="true" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-base">我参与的项目</h3>
                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">{participatedProjects.length}</span>
                                </div>
                                <button onClick={() => navigate('/projects')} className="text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer">
                                    查看全部 <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                                </button>
                            </div>
                            {participatedProjects.length > 0 ? (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
                                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                >
                                    {participatedProjects.map((p, index) => (
                                        <motion.div
                                            key={p.id}
                                            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <ProjectCard project={p} index={index + 2} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="bg-white rounded-xl py-10 px-6 text-center border border-dashed border-slate-300">
                                    <Users className="w-10 h-10 mx-auto mb-3 text-slate-300" aria-hidden="true" />
                                    <p className="text-sm text-slate-500 mb-3">暂无您参与的项目</p>
                                    <p className="text-xs text-slate-400">组织特聘或获邀加入后即可协作</p>
                                </div>
                            )}
                        </div>

                        {/* Message Center */}
                        <UserMessageCenter
                            messages={orgMessages}
                            onMessagesChange={setMessages}
                            onNavigateToWorkspace={() => navigate('/workspace', { state: { step: 1 } })}
                            onNavigateToProject={(projectName) => navigate('/projects')}
                        />

                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
