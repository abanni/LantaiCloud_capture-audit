import React, { useState } from 'react';
import { X, Users, Shield, UserPlus, ChevronDown, Trash2, ShieldCheck, Eye } from 'lucide-react';
import { Project, ProjectMember, Identity } from '../../../types';

interface ProjectMemberManagerProps {
    project: Project;
    identity: Identity;
    onClose: () => void;
    onUpdateMembers: (projectId: string, members: ProjectMember[]) => void;
}

const roleLabels: Record<string, string> = {
    admin: '项目管理员',
    participant: '参与人员',
    observer: '观察人员',
};

const roleColors: Record<string, string> = {
    admin: 'bg-amber-50 text-amber-700 border-amber-200',
    participant: 'bg-blue-50 text-blue-700 border-blue-200',
    observer: 'bg-slate-50 text-slate-600 border-slate-200',
};

const ProjectMemberManager: React.FC<ProjectMemberManagerProps> = ({ project, identity, onClose, onUpdateMembers }) => {
    const [members, setMembers] = useState<ProjectMember[]>(() => {
        const existing = project.members || [];
        const isMe = (m: ProjectMember) => m.name === identity.user.name;
        if (existing.some(isMe)) return existing;
        return [
            {
                id: `pm-${identity.user.id}-auto`,
                name: identity.user.name,
                email: identity.user.email,
                avatarBg: identity.user.avatarBg,
                role: project.isManaged ? 'admin' : 'participant',
                source: 'internal',
                department: identity.department || '默认',
                joinedAt: new Date().toISOString().split('T')[0],
            },
            ...existing,
        ];
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState<'participant' | 'observer'>('participant');
    const [newSource, setNewSource] = useState<'internal' | 'external'>('internal');

    const currentMember = members.find(m => m.name === identity.user.name);
    const isAdmin = currentMember?.role === 'admin';

    const handleRoleChange = (memberId: string, newRole: 'admin' | 'participant' | 'observer') => {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    };

    const handleRemoveMember = (memberId: string) => {
        setMembers(prev => prev.filter(m => m.id !== memberId));
    };

    const handleAddMember = () => {
        if (!newName.trim()) return;
        const newMember: ProjectMember = {
            id: `pm-${Date.now()}`,
            name: newName.trim(),
            email: `${newName.trim()}@lantai.cloud`,
            avatarBg: 'bg-slate-500',
            role: newRole,
            source: newSource,
            department: newSource === 'internal' ? '未分配' : '外部协作',
            joinedAt: new Date().toISOString().split('T')[0],
        };
        setMembers(prev => [...prev, newMember]);
        setNewName('');
        setShowAddForm(false);
    };

    const handleSave = () => {
        onUpdateMembers(project.id, members);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">项目成员管理</h3>
                            <p className="text-[11px] text-slate-400 truncate max-w-md">{project.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {isAdmin && !showAddForm && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                            <UserPlus className="w-4 h-4" /> 添加成员
                        </button>
                    )}

                    {members.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-xs">暂无项目成员</div>
                    ) : (
                        <div className="space-y-2">
                            {members.map(member => (
                                <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                                    <div className={`w-9 h-9 rounded-full ${member.avatarBg} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                                        {member.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-slate-800">{member.name}</span>
                                            {member.source === 'external' && (
                                                <span className="text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded font-bold">外部</span>
                                            )}
                                        </div>
                                        <div className="text-[10px] text-slate-400">{member.department} · {member.email}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isAdmin && member.id !== currentMember?.id ? (
                                            <select
                                                value={member.role}
                                                onChange={(e) => handleRoleChange(member.id, e.target.value as any)}
                                                className={`text-[10px] px-2 py-1 rounded-full font-bold border cursor-pointer ${roleColors[member.role]}`}
                                            >
                                                <option value="admin">项目管理员</option>
                                                <option value="participant">参与人员</option>
                                                <option value="observer">观察人员</option>
                                            </select>
                                        ) : (
                                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold border ${roleColors[member.role]}`}>
                                                {roleLabels[member.role]}
                                            </span>
                                        )}
                                        {isAdmin && member.id !== currentMember?.id && (
                                            <button
                                                onClick={() => handleRemoveMember(member.id)}
                                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Member Form */}
                    {showAddForm && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="输入成员姓名"
                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                                />
                                <select
                                    value={newSource}
                                    onChange={(e) => setNewSource(e.target.value as any)}
                                    className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-primary"
                                >
                                    <option value="internal">企业成员</option>
                                    <option value="external">外部参与者</option>
                                </select>
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value as any)}
                                    className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-primary"
                                >
                                    <option value="participant">参与人员</option>
                                    <option value="observer">观察人员</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setShowAddForm(false)} className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer">取消</button>
                                <button onClick={handleAddMember} className="px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-lg cursor-pointer">添加</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 shrink-0">
                    <div className="text-[11px] text-slate-400">
                        {isAdmin ? '您拥有项目管理员权限' : '您为项目参与人员'}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer">取消</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover cursor-pointer">保存</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectMemberManager;
