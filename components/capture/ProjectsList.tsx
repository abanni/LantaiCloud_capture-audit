import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Folder, FolderOpen, Search, Building2, UserCheck, X, Users,
    PenTool, CheckSquare, Trash2, ArrowLeft, ExternalLink, 
    CheckCircle2, Clock, ShieldAlert, Sparkles, BookOpen, AlertCircle, Shield,
    ChevronDown, ChevronRight, Plus, Edit3, Send, CheckCircle, RefreshCw
} from 'lucide-react';
import { Project, Identity, ArchiveEngineering, ProjectMember } from '../../types';
import UserSwitcher from '../common/UserSwitcher';
import CommitmentSigningModal from './modals/CommitmentSigningModal';
import DeleteProjectModal from './modals/DeleteProjectModal';
import UnitEngineeringManager from './modals/UnitEngineeringManager';
import ProjectMemberManager from './modals/ProjectMemberManager';

interface ProjectsListProps {
    identity: Identity;
    identities: Identity[];
    setCurrentIdentity: (identity: Identity) => void;
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
    identity,
    identities,
    setCurrentIdentity,
    projects,
    setProjects
}) => {
    const navigate = useNavigate();
    const [subTab, setSubTab] = useState<'all' | 'managed' | 'participated'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    // UI state for continue creation commitment letter signing wizard
    const [selectedSigningProject, setSelectedSigningProject] = useState<Project | null>(null);
    
    // UI state for delete confirmations
    const [deletingProject, setDeletingProject] = useState<Project | null>(null);

    // UI state for managing units (单位工程) via a Unified Dialog Popup
    const [managingUnitsProject, setManagingUnitsProject] = useState<Project | null>(null);

    // UI state for project member management
    const [managingMembersProject, setManagingMembersProject] = useState<Project | null>(null);

    // Active project units sync mechanism
    const currentManagingProject = projects.find(p => p.id === managingUnitsProject?.id);

    // Current Organization context ID
    const activeOrgId = identity.organization?.id;
    
    // Filter by organization context
    const orgProjects = activeOrgId ? projects.filter(p => p.organizationId === activeOrgId) : [];

    // Filter by category
    const managedProjects = orgProjects.filter(p => p.isManaged);
    const participatedProjects = orgProjects.filter(p => !p.isManaged);

    // Filter by tab & search keyword
    const getFilteredProjects = () => {
        let base = orgProjects;
        if (subTab === 'managed') base = managedProjects;
        if (subTab === 'participated') base = participatedProjects;

        if (searchTerm.trim()) {
            const kw = searchTerm.toLowerCase();
            return base.filter(p => 
                p.name.toLowerCase().includes(kw) || 
                (p.id && p.id.toLowerCase().includes(kw)) ||
                (p.licenceNo && p.licenceNo.toLowerCase().includes(kw)) ||
                (p.constructionUnit && p.constructionUnit.toLowerCase().includes(kw))
            );
        }
        return base;
    };

    const filteredList = getFilteredProjects();

    // Deletion handler
    const handleDeleteProject = (projId: string) => {
        setProjects(prev => prev.filter(p => p.id !== projId));
        setDeletingProject(null);
    };

    // Simulated commitment signature & approval workflow
    const handleStartSigning = (p: Project) => {
        navigate('/newproject', { state: { resumeProjectId: p.id } });
    };

    const handleApproveCommitment = () => {
        if (!selectedSigningProject) return;
        
        setProjects(prev => prev.map(p => {
            if (p.id === selectedSigningProject.id) {
                return {
                    ...p,
                    isCommitmentSigned: true,
                    isCommitmentApproved: true,
                    stage: '整理中',
                    progress: 25,
                    issues: [...(p.issues || []), '✅ 建设工程报送责任承诺书已签章并获档案馆批准']
                };
            }
            return p;
        }));

        setSelectedSigningProject(null);
    };

    // Unit engineering handlers
    const handleAddUnitFromModal = (projectId: string, unit: Omit<ArchiveEngineering, 'id'>) => {
        const newUnit: ArchiveEngineering = {
            id: `u-${Date.now()}`,
            ...unit,
        };
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    units: [...(p.units || []), newUnit]
                };
            }
            return p;
        }));
    };

    const handleUpdateMembers = (projectId: string, members: ProjectMember[]) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return { ...p, members, memberCount: members.length };
            }
            return p;
        }));
    };

    const handleEditUnitFromModal = (projectId: string, unitId: string, name: string, code: string) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    units: (p.units || []).map(u => {
                        if (u.id === unitId) {
                            return { ...u, name, code };
                        }
                        return u;
                    })
                };
            }
            return p;
        }));
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f0f2f5]">
            {/* Main Content Scrollable Workspace */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Filters, search terms and switcher tabs */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Tab Selection */}
                    <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl w-full md:w-auto gap-0.5">
                        <button 
                            onClick={() => setSubTab('all')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                subTab === 'all' 
                                    ? 'bg-white text-slate-800 shadow-xs' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <FolderOpen className="w-3.5 h-3.5" />
                            全部关联项目 ({orgProjects.length})
                        </button>
                        <button 
                            onClick={() => setSubTab('managed')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                subTab === 'managed' 
                                    ? 'bg-white text-primary shadow-xs border border-primary/20' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <UserCheck className="w-3.5 h-3.5 text-primary" />
                            我管理 ({managedProjects.length})
                        </button>
                        <button 
                            onClick={() => setSubTab('participated')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                subTab === 'participated' 
                                    ? 'bg-white text-slate-700 shadow-xs border border-slate-200' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            我参与 ({participatedProjects.length})
                        </button>
                    </div>

                    {/* Simple live input filter */}
                    <div className="relative w-full sm:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="检索项目名称、许可证、建设单位..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-medium placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-slate-50/50"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                title="清空搜索"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Main tabular projects log */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="min-w-0">
                        <table className="w-full text-left border-collapse table-fixed">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs font-bold text-slate-500 bg-slate-500/10 hover:bg-slate-50">
                                    <th className="py-4 px-3 w-[70px] text-[11px]">项目ID</th>
                                    <th className="py-4 px-3 w-auto min-w-[200px]">项目名称</th>
                                    <th className="py-4 px-3 w-[150px] truncate">建设单位名称</th>
                                    <th className="py-4 px-3 w-[120px] text-[11px]">施工许可证号</th>
                                    <th className="py-4 px-3 w-[90px] text-center">项目状态</th>
                                    <th className="py-4 px-3 w-[250px] text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-medium">
                                {filteredList.length > 0 ? (
                                    filteredList.map((p) => {
                                        const isApproved = p.isCommitmentApproved;
                                        
                                        let stageBadge = 'bg-stone-50 text-stone-600 border border-stone-200';
                                        if (p.stage === '创建中') stageBadge = 'bg-purple-100 text-purple-800 border border-purple-200';
                                        if (p.stage === '整理中') stageBadge = 'bg-amber-100 text-amber-800 border border-amber-200';
                                        if (p.stage === '审核中') stageBadge = 'bg-blue-100 text-blue-800 border border-blue-200';
                                        if (p.stage === '已入库') stageBadge = 'bg-emerald-100 text-emerald-800 border border-emerald-200';

                                        return (
                                            <React.Fragment key={p.id}>
                                                <tr className="hover:bg-blue-50/10 transition-colors align-middle">
                                                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400 truncate">
                                                        #{p.id}
                                                    </td>
                                                    <td className="py-3.5 px-3 font-bold text-slate-800 min-w-0">
                                                        <div className="space-y-0.5">
                                                            <div className="truncate whitespace-normal text-[12px] leading-relaxed" title={p.name}>
                                                                {p.name}
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 font-mono truncate">
                                                                {p.archiveName || '昆山市城建档案馆'}{p.archiveType ? ` \\ ${p.archiveType.replace('-', ' \\ ')}` : ''}
                                                            </div>
                                                            {!p.isManaged && (
                                                                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200">
                                                                    外协
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-3 text-slate-600 max-w-[150px] truncate" title={p.constructionUnit || '未设定单位'}>
                                                        {p.constructionUnit || identity.organization?.name || '上海无无科技有限公司'}
                                                    </td>
                                                    <td className="py-3.5 px-3 text-slate-600 font-mono text-[11px] truncate">
                                                        {p.licenceNo || '建字第 SU-2025-010'}
                                                    </td>
                                                    <td className="py-3.5 px-3">
                                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wide inline-block ${stageBadge}`}>
                                                            {p.stage}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {p.stage === '创建中' && (
                                                                <button
                                                                    onClick={() => handleStartSigning(p)}
                                                                    className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs shadow-md flex items-center gap-1 cursor-pointer transition-colors"
                                                                >
                                                                    <PenTool className="w-3 h-3" />
                                                                    继续创建
                                                                </button>
                                                            )}
                                                            {isApproved && (
                                                                <button
                                                                    onClick={() => {
                                                                        setManagingUnitsProject(p);
                                                                    }}
                                                                    className="px-2.5 py-1.5 font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs transition-colors border bg-primary/10 text-primary border-primary/20 hover:bg-indigo-100 cursor-pointer text-blue-600 hover:text-blue-700"
                                                                >
                                                                    <span>单位工程 ({p.units?.length || 0})</span>
                                                                    <ExternalLink className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => isApproved && navigate('/workspace', { state: { step: 1 } })}
                                                                disabled={!isApproved}
                                                                title={isApproved ? "进入兰台云盘开始数字整理" : "承诺书审核未通过，请先签署承诺书"}
                                                                className={`px-2.5 py-1.5 font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs transition-colors ${
                                                                    isApproved 
                                                                        ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                                                                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50'
                                                                }`}
                                                            >
                                                                <Folder className="w-3 h-3" />
                                                                整理著录
                                                            </button>
                                                            <button
                                                                onClick={() => setManagingMembersProject(p)}
                                                                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                                                    p.isManaged
                                                                        ? 'bg-primary text-white shadow-sm hover:bg-primary-hover'
                                                                        : 'border border-slate-200 text-slate-500 hover:bg-slate-100'
                                                                }`}
                                                                title={p.isManaged ? '管理项目 · 成员管理' : '参与项目 · 成员查看'}
                                                            >
                                                                {p.isManaged ? <Shield className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                                                                <span className="text-[10px] font-semibold">{p.members?.length || p.memberCount || 1}</span>
                                                            </button>
                                                            {!isApproved && (
                                                                <button
                                                                    onClick={() => setDeletingProject(p)}
                                                                    className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                                                    title="删除项目"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                                            📬 暂无满足筛选条件的档案项目
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL 1: Simulated Commitment Signature & Archive Approval Flow */}
            {selectedSigningProject && (
                <CommitmentSigningModal
                    project={selectedSigningProject}
                    identity={identity}
                    onClose={() => setSelectedSigningProject(null)}
                    onApprove={() => handleApproveCommitment()}
                />
            )}

            {/* MODAL 2: Simple Delete Confirmation */}
            {deletingProject && (
                <DeleteProjectModal
                    project={deletingProject}
                    onConfirm={handleDeleteProject}
                    onCancel={() => setDeletingProject(null)}
                />
            )}

            {/* MODAL 3: Unified Unit Engineering Management Dialog */}
            {currentManagingProject && (
                <UnitEngineeringManager
                    project={currentManagingProject}
                    onClose={() => setManagingUnitsProject(null)}
                    onAddUnit={handleAddUnitFromModal}
                    onEditUnit={handleEditUnitFromModal}
                />
            )}

            {/* MODAL 4: Project Member Management */}
            {managingMembersProject && (
                <ProjectMemberManager
                    project={managingMembersProject}
                    identity={identity}
                    onClose={() => setManagingMembersProject(null)}
                    onUpdateMembers={handleUpdateMembers}
                />
            )}

        </div>
    );
};

export default ProjectsList;
