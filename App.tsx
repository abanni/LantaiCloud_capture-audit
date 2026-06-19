import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import Enterprise from './components/dashboard/Enterprise';
import Workspace from './components/capture/Workspace';
import Sidebar from './components/common/Sidebar';
import TopBar from './components/common/TopBar';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import Login from './components/dashboard/Login';
import IdentitySelector from './components/dashboard/IdentitySelector';
import ProjectsList from './components/capture/ProjectsList';
import PersonalSettings from './components/dashboard/PersonalSettings';
import NewProjectPage from './components/dashboard/NewProjectPage';
import { Project, Identity } from './types';
import { useApp, AppProvider } from './context/AppContext';

// Auditing additions:
import { 
    INITIAL_ARCHIVES, 
    ArchiveItem, 
    ArchiveNode, 
    NodeStatus, 
    WorkflowStage 
} from './components/audit/auditTypes';
import { AuditDashboard } from './components/audit/AuditDashboard';
import { AuditRegistrationView } from './components/audit/AuditRegistrationView';
import { AuditProjectList } from './components/audit/AuditProjectList';
import { AuditProjectInfoView } from './components/audit/AuditProjectInfoView';
import { ArchiveGuidance } from './components/audit/ArchiveGuidance';
import { StatisticsView } from './components/audit/StatisticsView';
import { ArchiveExplorer } from './components/audit/ArchiveExplorer';

const AuditWorkspaceContainer: React.FC<{
    archives: ArchiveItem[];
    onUpdateNode: (archiveId: string, nodeId: string, status: NodeStatus) => void;
    onWorkflowAdvance: (archiveId: string, nextStage: WorkflowStage) => void;
}> = ({ archives, onUpdateNode, onWorkflowAdvance }) => {
    const location = useLocation();
    const focusId = (location.state as any)?.focusProjectId as string | undefined;
    const [selectedId, setSelectedId] = React.useState<string | null>(focusId || null);
    const selectedArchive = archives.find(a => a.id === selectedId);

    // Clear location state after use so refresh goes back to list
    React.useEffect(() => {
        if (focusId) {
            window.history.replaceState({}, document.title);
        }
    }, [focusId]);

    if (selectedArchive) {
        return (
            <ArchiveExplorer
                archive={selectedArchive}
                readOnly={false}
                onUpdateNode={onUpdateNode}
                onWorkflowAdvance={onWorkflowAdvance}
                onBack={() => setSelectedId(null)}
            />
        );
    }

    return <AuditProjectList archives={archives} onSelect={setSelectedId} />;
};

const AppInner: React.FC = () => {
    const { state, login, logout, setCurrentIdentity, setIdentities, setProjects } = useApp();

    const [archives, setArchives] = React.useState<ArchiveItem[]>(INITIAL_ARCHIVES);

    const handleRegister = (id: string, regNum: string) => {
        setArchives(prev => prev.map(archive => {
            if (archive.id === id) {
                return { ...archive, stage: 'FIRST_REVIEW' as const, registrationNumber: regNum };
            }
            return archive;
        }));
    };

    const updateNodeInTree = (nodes: ArchiveNode[], nodeId: string, status: NodeStatus): ArchiveNode[] => {
        return nodes.map(node => {
            if (node.id === nodeId) return { ...node, status };
            if (node.children) return { ...node, children: updateNodeInTree(node.children, nodeId, status) };
            return node;
        });
    };

    const handleUpdateNode = (archiveId: string, nodeId: string, status: NodeStatus) => {
        setArchives(prev => prev.map(archive => {
            if (archive.id === archiveId) {
                return {
                    ...archive,
                    archiveDataPackage: updateNodeInTree(archive.archiveDataPackage, nodeId, status),
                    volumeDataPackage: updateNodeInTree(archive.volumeDataPackage, nodeId, status)
                };
            }
            return archive;
        }));
    };

    const handleWorkflowAdvance = (archiveId: string, nextStage: WorkflowStage) => {
        setArchives(prev => prev.map(archive => {
            if (archive.id === archiveId) return { ...archive, stage: nextStage };
            return archive;
        }));
    };

    if (!state.isAuthenticated) {
        return <Login onLoginSuccess={login} identities={state.identities} />;
    }

    if (!state.currentIdentity) {
        return (
            <IdentitySelector
                identities={state.identities}
                onSelect={setCurrentIdentity}
                onLogout={logout}
            />
        );
    }

    return (
        <HashRouter>
            <AppLayout
                archives={archives}
                handleRegister={handleRegister}
                handleUpdateNode={handleUpdateNode}
                handleWorkflowAdvance={handleWorkflowAdvance}
            />
        </HashRouter>
    );
};

interface AppLayoutProps {
    archives: ArchiveItem[];
    handleRegister: (id: string, regNum: string) => void;
    handleUpdateNode: (archiveId: string, nodeId: string, status: NodeStatus) => void;
    handleWorkflowAdvance: (archiveId: string, nextStage: WorkflowStage) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
    archives,
    handleRegister,
    handleUpdateNode,
    handleWorkflowAdvance,
}) => {
    const { state, setCurrentIdentity, setIdentities, setProjects, setCurrentArchive } = useApp();
    const location = useLocation();
    const navigate = useNavigate();
    const { currentIdentity, identities, projects, availableArchives, currentArchiveId } = state;

    // Determine if we should show the main sidebar
    const isMainLayout = [
        '/dashboard', '/capture-dashboard', '/newproject', '/enterprise', '/projects', '/settings',
        '/audit-dashboard', '/audit-registration', '/audit-projects',
        '/audit-project-info', '/audit-guidance', '/audit-statistics'
    ].includes(location.pathname) || location.pathname === '/';

    const getPageTitle = (pathname: string, identity: Identity | null): string => {
        const titles: Record<string, string> = {
            '/dashboard': '数智档案云端工作台',
            '/capture-dashboard': '著录工作台',
            '/newproject': '新建档案',
            '/enterprise': identity?.role === '审核人员' ? '档案馆管理' : '企业管理',
            '/projects': '我的档案',
            '/settings': '个人设置',
            '/audit-dashboard': '审核工作台',
            '/audit-registration': '档案登记',
            '/audit-projects': '档案审核',
            '/audit-project-info': '项目信息',
            '/audit-guidance': '档案指导',
            '/audit-statistics': '审核统计分析',
        };
        return titles[pathname] || '数智档案云端工作台';
    };

    if (isMainLayout) {
        return (
            <div className="flex h-screen w-full overflow-hidden">
                <Sidebar identity={currentIdentity!} onSwitchIdentity={() => setCurrentIdentity(null as any)} />
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f0f2f5]">
                    <TopBar
                        title={getPageTitle(location.pathname, currentIdentity)}
                        identity={currentIdentity!}
                        identities={identities}
                        setCurrentIdentity={setCurrentIdentity}
                        archives={availableArchives}
                        currentArchiveId={currentArchiveId}
                        onArchiveSwitch={setCurrentArchive}
                    />
                    <Routes>
                        <Route path="/" element={<Navigate to="/capture-dashboard" replace />} />
                        <Route
                            path="/capture-dashboard"
                            element={<Dashboard identity={currentIdentity!} identities={identities} setIdentities={setIdentities} setCurrentIdentity={setCurrentIdentity} projects={projects} setProjects={setProjects} />}
                        />
                        <Route
                            path="/newproject"
                            element={<NewProjectPage />}
                        />
                        <Route
                            path="/dashboard"
                            element={<Dashboard identity={currentIdentity!} identities={identities} setIdentities={setIdentities} setCurrentIdentity={setCurrentIdentity} projects={projects} setProjects={setProjects} />}
                        />
                        <Route
                            path="/enterprise"
                            element={
                                <ProtectedRoute requiresOrganization>
                                    <Enterprise identity={currentIdentity!} identities={identities} setIdentities={setIdentities} setCurrentIdentity={setCurrentIdentity} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/projects"
                            element={<ProjectsList identity={currentIdentity!} identities={identities} setCurrentIdentity={setCurrentIdentity} projects={projects} setProjects={setProjects} />}
                        />
                        <Route
                            path="/settings"
                            element={<PersonalSettings identity={currentIdentity!} identities={identities} setCurrentIdentity={setCurrentIdentity} />}
                        />
                        {/* Auditing subroutes */}
                        <Route path="/audit-dashboard" element={<AuditDashboard archives={archives} onNavigate={(tab, projectId) => {
                            if (tab === 'registration') navigate('/audit-registration');
                            else if (tab === 'audit') navigate('/audit-projects');
                            else if (tab === 'audit-projects') navigate('/audit-projects', { state: { focusProjectId: projectId } });
                            else if (tab === 'projectInfo') navigate('/audit-project-info');
                            else if (tab === 'guidance') navigate('/audit-guidance');
                            else if (tab === 'statistics') navigate('/audit-statistics');
                        }} />} />
                        <Route path="/audit-registration" element={<AuditRegistrationView archives={archives} onRegister={handleRegister} />} />
                        <Route path="/audit-projects" element={<AuditWorkspaceContainer archives={archives} onUpdateNode={handleUpdateNode} onWorkflowAdvance={handleWorkflowAdvance} />} />
                        <Route path="/audit-project-info" element={<AuditProjectInfoView archives={archives} />} />
                        <Route path="/audit-guidance" element={<ArchiveGuidance />} />
                        <Route path="/audit-statistics" element={<StatisticsView />} />
                    </Routes>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/cloud" element={<Navigate to="/workspace" replace />} />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppInner />
        </AppProvider>
    );
};

export default App;
