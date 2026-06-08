
import React from 'react';
import { Send, Clock } from 'lucide-react';

const TransferAuditView = ({ status, setStatus, logs, setLogs, onBackToEdit }: any) => {
    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
                {status === 'idle' && (
                    <>
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6"><Send className="w-10 h-10 text-blue-500" /></div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">准备移交审核</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">所有案卷和文件整理完毕后，可提交给档案馆进行预验收。</p>
                        <button onClick={() => { setStatus('submitted'); setLogs([{date: new Date().toLocaleString(), action: '提交审核', desc: '用户提交了预验收申请'}]); }} className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover shadow-lg font-bold">提交预验收</button>
                    </>
                )}
                {status === 'submitted' && (
                    <>
                        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6"><Clock className="w-10 h-10 text-yellow-500 animate-pulse" /></div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">审核进行中...</h2>
                        <div className="text-left bg-slate-50 rounded p-4 border border-slate-100"><h4 className="font-bold text-sm text-slate-700 mb-2">审核日志</h4>{logs.map((log: any, i: number) => (<div key={i} className="text-xs text-slate-600 mb-1"><span className="text-slate-400 mr-2">{log.date}</span><span className="font-bold mr-2">{log.action}</span><span>{log.desc}</span></div>))}</div>
                        <button onClick={onBackToEdit} className="mt-6 text-primary hover:underline text-sm">撤回申请 (仅测试用)</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TransferAuditView;
