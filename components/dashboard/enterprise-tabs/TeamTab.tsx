import React from 'react';
import { TeamMember } from '../../../types';
import { CheckCircle, ExternalLink } from 'lucide-react';

interface TeamTabProps {
    teamMembers: TeamMember[];
    onConfigUser?: (userName: string) => void;
    onInvite?: () => void;
}

const getRoleTagColor = (role: string) => {
    switch (role) {
        case '法定代表人':
        case '拥有者':
            return 'bg-amber-50 text-amber-600 border border-amber-200';
        case '管理员':
            return 'bg-blue-50 text-blue-600 border border-blue-200';
        default:
            return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
};

const TeamTab: React.FC<TeamTabProps> = ({ teamMembers, onConfigUser, onInvite }) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                <div>
                    <h3 className="text-base font-bold text-slate-800">成员管辖清单 ({teamMembers.length}人)</h3>
                    <p className="text-xs text-slate-400 mt-1">系统中设计三种角色：法定代表人、管理员、成员</p>
                </div>
                <button
                    onClick={() => onInvite?.()}
                    className="px-4 py-2 bg-primary text-white rounded text-sm hover:bg-primary-hover shadow-sm"
                >
                    + 邀请成员
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="py-3 px-2 border-b border-slate-200 text-xs font-semibold text-slate-500">成员</th>
                            <th className="py-3 px-2 border-b border-slate-200 text-xs font-semibold text-slate-500">处室部门</th>
                            <th className="py-3 px-2 border-b border-slate-200 text-xs font-semibold text-slate-500">系统角色</th>
                            <th className="py-3 px-2 border-b border-slate-200 text-xs font-semibold text-slate-500">加入日期</th>
                            <th className="py-3 px-2 border-b border-slate-200 text-xs font-semibold text-slate-500">健康状态</th>
                            <th className="py-3 px-2 border-b border-slate-200 text-xs font-semibold text-slate-500">权限分配</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamMembers.map(user => (
                            <tr key={user.id} className="group hover:bg-slate-50/50">
                                <td className="py-4 px-2 border-b border-slate-100">
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full ${user.avatarBg || 'bg-blue-600'} text-white flex items-center justify-center text-xs font-bold mr-3 shrink-0`}>
                                            {user.name ? user.name[0] : 'U'}
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="text-sm font-semibold text-slate-800 truncate">{user.name}</div>
                                            <div className="text-xs text-slate-400 font-mono truncate">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-2 border-b border-slate-100 text-sm text-slate-600">
                                    {user.department || '无分部人员'}
                                </td>
                                <td className="py-4 px-2 border-b border-slate-100">
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold inline-block whitespace-nowrap ${getRoleTagColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-4 px-2 border-b border-slate-100 text-xs text-slate-500 font-mono">{user.joinDate}</td>
                                <td className="py-4 px-2 border-b border-slate-100 text-sm">
                                    <span className={user.status === 'active' ? 'text-green-600 font-medium' : 'text-orange-500 font-medium'}>
                                        {user.status === 'active' ? '● 正常' : '● 未激活'}
                                    </span>
                                </td>
                                <td className="py-4 px-2 border-b border-slate-100 text-sm">
                                    {user.role === '拥有者' || user.role === '法定代表人' ? (
                                        <span className="text-slate-300 pointer-events-none text-xs">主控权限</span>
                                    ) : (
                                        <button
                                            onClick={() => onConfigUser?.(user.name)}
                                            className="text-primary hover:underline text-xs"
                                        >
                                            配置
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeamTab;
