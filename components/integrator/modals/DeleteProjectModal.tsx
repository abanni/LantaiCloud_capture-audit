import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Project } from '../../../types';

interface DeleteProjectModalProps {
    project: Project;
    onConfirm: (projectId: string) => void;
    onCancel: () => void;
}

const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
    project,
    onConfirm,
    onCancel,
}) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl p-6 space-y-6 animate-in zoom-in-95">
                <div className="flex gap-4 items-start">
                    <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl shrink-0">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-slate-800 text-sm">确认要彻底删除该档案项目吗？</h3>
                        <p className="text-xs text-slate-500 leading-normal font-medium">
                            此操作将永久废止在兰台系统上建立的 <strong>{project.name}</strong> 档案存储目录，不可逆撤销。
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 text-xs">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-semibold cursor-pointer"
                    >
                        取消
                    </button>
                    <button
                        onClick={() => onConfirm(project.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer"
                    >
                        确定删除
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProjectModal;
