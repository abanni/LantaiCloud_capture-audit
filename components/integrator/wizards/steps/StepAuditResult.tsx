import React from 'react';
import { Loader2, CheckCircle } from 'lucide-react';

interface StepAuditResultProps {
    auditStatus: 'pending' | 'approved';
    archiveName: string;
    formData: {
        name: string;
    };
}

const StepAuditResult: React.FC<StepAuditResultProps> = ({ auditStatus, archiveName, formData }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center">
            {auditStatus === 'pending' ? (
                <div className="animate-in fade-in">
                    <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-slate-800 mb-2">正在提交档案馆审核...</h3>
                    <p className="text-slate-500">系统正在自动对接 {archiveName} 监管平台</p>
                </div>
            ) : (
                <div className="animate-in fade-in zoom-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">审核通过！立项登记完成</h3>
                    <p className="text-slate-500 mb-8">项目已成功立项，状态已变更为 <span className="text-primary font-bold">档案整理</span>。</p>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-w-md mx-auto mb-8 text-left">
                        <div className="flex justify-between mb-2">
                            <span className="text-slate-500">项目名称</span>
                            <span className="font-bold text-slate-800">{formData.name}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-slate-500">档案登记号</span>
                            <span className="font-bold text-primary text-lg">2025-0005</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">归属档案馆</span>
                            <span className="text-slate-800">{archiveName}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StepAuditResult;
