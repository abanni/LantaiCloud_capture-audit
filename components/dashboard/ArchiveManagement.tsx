import React, { useState } from 'react';
import { Building2, FolderTree, Layers, Settings, FileText } from 'lucide-react';
import { Identity } from '../../types';
import ArchiveInfoTab from './enterprise-tabs/ArchiveInfoTab';
import ArchiveTemplateTab from './enterprise-tabs/ArchiveTemplateTab';
import AuditFlowConfigTab from './enterprise-tabs/AuditFlowConfigTab';
import ProjectTypeConfigTab from './enterprise-tabs/ProjectTypeConfigTab';
import EngineeringTypeTab from './enterprise-tabs/EngineeringTypeTab';
import ProjectTypeTreeTab from './enterprise-tabs/ProjectTypeTreeTab';

interface ArchiveManagementProps {
    identity: Identity;
}

const MenuLink = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
    <div onClick={onClick}
        className={`flex items-center px-6 py-4 cursor-pointer text-sm border-l-4 transition-all
            ${active ? 'bg-emerald-50 text-emerald-700 border-emerald-500 font-bold' : 'border-transparent text-slate-700 hover:bg-slate-50'}`}>
        <span className="mr-3 opacity-80">{icon}</span>
        {label}
    </div>
);

const ArchiveManagement: React.FC<ArchiveManagementProps> = ({ identity }) => {
    const [activeTab, setActiveTab] = useState<'archive-info' | 'archive-template' | 'audit-flow' | 'project-type-config' | 'engineering-type' | 'project-type-tree'>('archive-info');

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f0f2f5]">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="w-full">
                    <div className="grid grid-cols-[240px_1fr] gap-6 items-start">
                        
                        {/* Left Panel */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
                                <div className="px-5 py-3 bg-emerald-50/50 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                    <span>档案馆基础治理</span>
                                </div>
                                <MenuLink active={activeTab === 'archive-info'} onClick={() => setActiveTab('archive-info')} label="档案馆信息" icon={<Building2 className="w-4 h-4" />} />
                                <MenuLink active={activeTab === 'archive-template'} onClick={() => setActiveTab('archive-template')} label="档案馆模板" icon={<FileText className="w-4 h-4" />} />
                                <MenuLink active={activeTab === 'audit-flow'} onClick={() => setActiveTab('audit-flow')} label="审核流程配置" icon={<Settings className="w-4 h-4" />} />
                            </div>

                            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
                                <div className="px-5 py-3 bg-emerald-50/50 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <FolderTree className="w-3.5 h-3.5 text-slate-400" />
                                    <span>项目类型管理</span>
                                </div>
                                <MenuLink active={activeTab === 'project-type-config'} onClick={() => setActiveTab('project-type-config')} label="项目类型配置" icon={<FolderTree className="w-4 h-4" />} />
                                <MenuLink active={activeTab === 'engineering-type'} onClick={() => setActiveTab('engineering-type')} label="工程类型" icon={<Layers className="w-4 h-4" />} />
                                <MenuLink active={activeTab === 'project-type-tree'} onClick={() => setActiveTab('project-type-tree')} label="项目类型树" icon={<FileText className="w-4 h-4" />} />
                            </div>
                        </div>

                        {/* Right Details Panel */}
                        <div className="space-y-6">
                            {activeTab === 'archive-info' && <ArchiveInfoTab />}
                            {activeTab === 'archive-template' && <ArchiveTemplateTab />}
                            {activeTab === 'audit-flow' && <AuditFlowConfigTab />}
                            {activeTab === 'project-type-config' && <ProjectTypeConfigTab />}
                            {activeTab === 'engineering-type' && <EngineeringTypeTab />}
                            {activeTab === 'project-type-tree' && <ProjectTypeTreeTab />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArchiveManagement;
