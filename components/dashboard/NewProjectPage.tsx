import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NewProjectWizard from '../capture/wizards/NewProjectWizard';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';

const NewProjectPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state, setProjects } = useApp();
    const { identity, projects } = state;

    const [resumingProject, setResumingProject] = useState<Project | undefined>(undefined);

    useEffect(() => {
        const resumeId = (location.state as any)?.resumeProjectId as string | undefined;
        if (resumeId) {
            const found = projects.find(p => p.id === resumeId);
            if (found) setResumingProject(found);
        }
    }, [location.state, projects]);

    const handleFinish = (newProject: Project) => {
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
        navigate('/projects');
    };

    return (
        <div className="h-full min-h-[580px]">
            <NewProjectWizard
                identity={identity!}
                onClose={() => navigate('/capture-dashboard')}
                onFinish={handleFinish}
                isFullWorkspace={true}
                resumeProject={resumingProject}
                currentArchiveId={state.currentArchiveId}
            />
        </div>
    );
};

export default NewProjectPage;
