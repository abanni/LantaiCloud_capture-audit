import React, { createContext, useContext, useState } from 'react';
import { Identity, Project, ArchiveTenant } from '../types';
import { INITIAL_PROJECTS } from '../data/mockProjects';

interface AppState {
    isAuthenticated: boolean;
    identities: Identity[];
    currentIdentity: Identity | null;
    projects: Project[];
    availableArchives: ArchiveTenant[];
    currentArchiveId: string;
}

interface AppContextValue {
    state: AppState;
    setState: React.Dispatch<React.SetStateAction<AppState>>;
    // Convenience setters
    login: (identity?: Identity) => void;
    logout: () => void;
    setCurrentIdentity: (identity: Identity) => void;
    setIdentities: React.Dispatch<React.SetStateAction<Identity[]>>;
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    setCurrentArchive: (id: string) => void;
}

const INITIAL_ARCHIVES: ArchiveTenant[] = [
    { id: 'default', name: '兰台云SaaS档案馆', region: '通用' },
    { id: 'kunshan', name: '昆山城建档案馆', region: '昆山' },
];

const INITIAL_IDENTITIES: Identity[] = [
    {
        id: 'id_1',
        user: { id: 'u1', name: '张伟', role: '管理员', email: '139****1234', avatarBg: 'bg-primary', joinDate: '2024-05-20', status: 'active' },
        organization: {
            id: 'org_wuwu', name: '上海无无科技有限公司', shortName: '无无科技', type: 'ENTERPRISE',
            code: '91310230MAE9102L0D', licenceFileName: '营业执照.png', legalRep: '王钢', legalRepPhone: '13812345678'
        },
        role: '管理员', department: '工程部'
    },
    {
        id: 'id_2',
        user: { id: 'u1', name: '张伟', role: '成员', email: '139****1234', avatarBg: 'bg-primary', joinDate: '2024-05-20', status: 'active' },
        organization: {
            id: 'org_qt', name: '苏州清陶动力科技', shortName: '清陶动力', type: 'ENTERPRISE',
            code: '91320583MA1Y8L6D03', licenceFileName: '营业执照.pdf', legalRep: '冯建超', legalRepPhone: '15822341234'
        },
        role: '成员', department: '综合办'
    },
    {
        id: 'id_3',
        user: { id: 'u1', name: '张伟', role: '法定代表人', email: '139****1234', avatarBg: 'bg-primary', joinDate: '2024-05-20', status: 'active' },
        organization: {
            id: 'org_cs', name: '常熟工程建设集团有限公司', shortName: '常熟建工', type: 'ENTERPRISE',
            code: '91320581MA1U2U4X1N', licenceFileName: '营业执照.jpg', legalRep: '张伟', legalRepPhone: '13988887777'
        },
        role: '法定代表人', department: '总经理办公室'
    },
    {
        id: 'id_4',
        user: { id: 'u2', name: '李进', role: '个人档案员', email: '177****8899', avatarBg: 'bg-teal-600', joinDate: '2026-06-04', status: 'active' },
        organization: undefined,
        role: '新注册用户', department: '待定/个人独立'
    },
    {
        id: 'id_5',
        user: { id: 'u3', name: '李娜', role: '审核人员', email: '0512****5678', avatarBg: 'bg-rose-600', joinDate: '2025-03-01', status: 'active' },
        archiveOrg: {
            id: 'org_ks', name: '昆山市城建档案馆', shortName: '昆山城建档案馆', region: '昆山',
            code: '12320583MB1A12345X', responsiblePerson: '李娜'
        },
        role: '审核人员', department: '档案审核科'
    }
];

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>({
        isAuthenticated: false,
        identities: INITIAL_IDENTITIES,
        currentIdentity: null,
        projects: INITIAL_PROJECTS,
        availableArchives: INITIAL_ARCHIVES,
        currentArchiveId: 'default',
    });

    const login = (selectedIdentity?: Identity) => {
        setState(prev => ({
            ...prev,
            isAuthenticated: true,
            currentIdentity: selectedIdentity || null,
        }));
    };

    const logout = () => {
        setState(prev => ({
            ...prev,
            isAuthenticated: false,
            currentIdentity: null,
        }));
    };

    const setCurrentIdentity = (identity: Identity) => {
        setState(prev => ({ ...prev, currentIdentity: identity }));
    };

    const setIdentities: React.Dispatch<React.SetStateAction<Identity[]>> = (value) => {
        setState(prev => ({
            ...prev,
            identities: typeof value === 'function' ? (value as (prev: Identity[]) => Identity[])(prev.identities) : value,
        }));
    };

    const setProjects: React.Dispatch<React.SetStateAction<Project[]>> = (value) => {
        setState(prev => ({
            ...prev,
            projects: typeof value === 'function' ? (value as (prev: Project[]) => Project[])(prev.projects) : value,
        }));
    };

    const setCurrentArchive = (id: string) => {
        setState(prev => ({ ...prev, currentArchiveId: id }));
    };

    return (
        <AppContext.Provider value={{
            state,
            setState,
            login,
            logout,
            setCurrentIdentity,
            setIdentities,
            setProjects,
            setCurrentArchive,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = (): AppContextValue => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
};

export default AppContext;
