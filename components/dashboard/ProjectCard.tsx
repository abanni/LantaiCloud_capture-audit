import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Briefcase, Hammer, Users, ChevronRight } from 'lucide-react';
import { Project } from '../types';

// User-requested stage configurations for 4 states with 4 distinct colors:
// Green (已入库), Purple (创建中), Blue (审核中), Orange (整理中)
const getCardStyleByStage = (stage: string) => {
    switch (stage) {
        case '创建中':
            return {
                borderClass: 'border-l-purple-500',
                bgClass: 'bg-purple-50/5 hover:bg-purple-100/10',
                borderOutline: 'border-purple-100 hover:border-purple-350',
                badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
                iconColor: 'text-purple-600',
                accentBg: 'bg-purple-50',
            };
        case '整理中':
            return {
                borderClass: 'border-l-orange-500',
                bgClass: 'bg-orange-50/5 hover:bg-orange-100/10',
                borderOutline: 'border-orange-100 hover:border-orange-350',
                badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
                iconColor: 'text-orange-600',
                accentBg: 'bg-orange-50',
            };
        case '审核中':
            return {
                borderClass: 'border-l-blue-500',
                bgClass: 'bg-blue-50/5 hover:bg-blue-100/10',
                borderOutline: 'border-blue-100 hover:border-blue-350',
                badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
                iconColor: 'text-blue-600',
                accentBg: 'bg-blue-50',
            };
        case '已入库':
            return {
                borderClass: 'border-l-emerald-500',
                bgClass: 'bg-emerald-50/5 hover:bg-emerald-100/10',
                borderOutline: 'border-emerald-100 hover:border-emerald-350',
                badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                iconColor: 'text-emerald-600',
                accentBg: 'bg-emerald-50',
            };
        default:
            return {
                borderClass: 'border-l-gray-500',
                bgClass: 'bg-slate-50/5 hover:bg-slate-100/10',
                borderOutline: 'border-slate-100 hover:border-slate-200',
                badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
                iconColor: 'text-slate-600',
                accentBg: 'bg-slate-50',
            };
    }
};

const getCardIcon = (index: number) => {
    // Rotating folder, briefcase and hammer icons placed cleanly in front of project names
    const icons = [Folder, Briefcase, Hammer];
    return icons[index % 3];
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
    const navigate = useNavigate();
    const style = getCardStyleByStage(project.stage);
    const IconComponent = getCardIcon(index);

    // Simulated project data metrics to make it feel extremely detailed and realistic
    const seed = parseInt(project.id) || index || 1;
    const fileCount = (seed * 117 + 81) % 400 + 45;
    const fileSize = ((seed * 1.34 + 0.5) % 4 + 0.3).toFixed(1) + 'GB';
    
    // Clean, readable representation of archive categories requested by the user
    const cleanArchiveType = project.archiveType 
        ? project.archiveType.replace(/\\\\/g, '-').trim() 
        : (seed % 3 === 0 ? '文书档案' : '城建档案-房屋建筑');

    return (
        <div 
            className={`bg-white rounded-xl p-5 border ${style.borderOutline} border-l-4 ${style.borderClass} ${style.bgClass} relative overflow-hidden group hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[155px] h-auto`}
            onClick={() => {
                // If it's not approved yet, we guide them to '我的项目' page to perform '签署/完成创建'
                if (project.stage === '创建中' && !project.isCommitmentApproved) {
                    navigate('/projects');
                } else {
                    navigate('/workspace', { state: { step: 1 } });
                }
            }}
            title={project.stage === '创建中' && !project.isCommitmentApproved ? "工程处于创建中状态，点击前往'我的项目'进行报送承诺书签署" : "点击穿透进入该项目的兰台智能云盘"}
        >
            <div className="space-y-3">
                {/* Header info */}
                <div className="flex items-start gap-2.5">
                    <div className={`p-1.5 rounded-lg ${style.accentBg} ${style.iconColor} shrink-0 transition-all group-hover:scale-105 duration-300`}>
                        <IconComponent className="w-5 h-5 flex-shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                        {/* Project Name */}
                        <div className="font-bold text-slate-800 text-left text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2" title={project.name}>
                            {project.name}
                        </div>
                    </div>
                </div>

                {/* Tags and Badges with Inline Metrics */}
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border tracking-wide uppercase ${style.badgeClass}`}>
                        {project.stage}
                    </span>
                    <span className="text-[9.5px] font-medium px-2 py-0.5 rounded border border-slate-100 text-slate-600 bg-slate-50/55 max-w-full truncate">
                        {cleanArchiveType} <span className="text-slate-500">({fileCount}个文件 / {fileSize})</span>
                    </span>
                </div>
            </div>

            {/* Footer containing ONLY the member count with no details/warnings whatsoever */}
            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                <div className="flex items-center text-slate-500 gap-1 bg-slate-50 hover:bg-slate-100 transition-colors px-2 py-0.5 rounded-full text-[11px] font-medium border border-slate-100">
                    <Users className={`w-3.5 h-3.5 ${style.iconColor}`} />
                    <span>协作人员: <strong className="text-slate-800">{project.memberCount || 2}</strong> 人</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium group-hover:text-primary transition-colors flex items-center gap-0.5">
                    {project.stage === '创建中' && !project.isCommitmentApproved ? '去办理' : '进入云盘'}
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
            </div>
        </div>
    );
};

export default ProjectCard;
