import React from 'react';
import { KeyRound, AlertCircle, Clock, ShieldAlert, UserCheck } from 'lucide-react';
import { RegistrationItem } from '../integrator/archiveData';
import RegistrationCard from './RegistrationCard';

interface AuditLog {
  id: string;
  accessTime: string;
  userName: string;
  userType: string;
  archiveTitle: string;
  type: string;
  purpose: string;
  result: 'Success' | 'Denied';
}

interface ApprovePanelProps {
  registrations: RegistrationItem[];
  auditLogs: AuditLog[];
  onApprove: (regId: string) => void;
  onReject: (regId: string) => void;
  onReset: () => void;
}

const ApprovePanel: React.FC<ApprovePanelProps> = ({
  registrations,
  auditLogs,
  onApprove,
  onReject,
  onReset,
}) => {
  return (
    <>
      {/* Action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl shadow-xs gap-4">
        <div>
          <h3 className="font-bold text-sm text-slate-800 font-sans">
            1. 待审核的档案利用申请
          </h3>
          <p className="text-[10px] text-slate-450 font-medium">
            档案管理员对提交的保密调卷申请进行会审与授权盖章。
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 px-4 py-2 rounded-xl text-xs font-bold font-mono">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>待审核队列: {registrations.filter(r => r.status === 'PENDING').length} 件申请待处理</span>
          </div>
        </div>
      </div>

      {/* Registrations queue table */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <div className="flex justify-between items-center pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-primary animate-pulse" />
            <h4 className="font-bold text-xs text-slate-800">
              档案利用审批队列
            </h4>
          </div>

          <button
            onClick={onReset}
            className="text-[10px] text-slate-500 hover:text-blue-600 rounded px-2.5 py-1 cursor-pointer font-bold transition-colors"
            title="清除审计以及归集记录"
          >
            复位审批与审计底册
          </button>
        </div>

        {/* Table list of registrations */}
        <div className="rounded-xl overflow-hidden mt-4 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-semibold whitespace-nowrap">
              <thead className="bg-slate-50 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">编号</th>
                  <th className="py-3 px-4">提报日期</th>
                  <th className="py-3 px-4">申请人</th>
                  <th className="py-3 px-4 text-center">利用形式</th>
                  <th className="py-3 px-4">关联档案</th>
                  <th className="py-3 px-4">用途事由</th>
                  <th className="py-3 px-4 text-center">审批操作</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-medium font-sans">
                      暂无提报的利用审批申请。您可在"我的档案馆"或"综合检索"中添加档案再起草申请单。
                    </td>
                  </tr>
                ) : (
                  registrations.map(reg => (
                    <RegistrationCard
                      key={reg.id}
                      reg={reg}
                      mode="approve"
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Audit trail logs */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4 animate-in fade-in duration-400">
        <div className="flex items-center gap-2 pb-3">
          <KeyRound className="w-4 h-4 text-emerald-700" />
          <h4 className="font-bold text-xs text-slate-800">安全审计日志</h4>
        </div>

        <div className="rounded-xl overflow-hidden mt-2 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-semibold whitespace-nowrap">
              <thead className="bg-slate-50 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">审计ID (HASH)</th>
                  <th className="py-3 px-4">出证/调用时间</th>
                  <th className="py-3 px-4">调用人及角色</th>
                  <th className="py-3 px-4 text-center">调用形式</th>
                  <th className="py-3 px-4">调阅资源</th>
                  <th className="py-3 px-4">利用目的简述</th>
                  <th className="py-3 px-4 text-center">审计结果</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">
                      #{log.id}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                        {log.accessTime}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{log.userName}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{log.userType}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        log.type === '副本下载' 
                          ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : log.type === '加盖红章出证' || log.type === '加章打复印' 
                            ? 'bg-purple-50 text-purple-700 border-purple-200' 
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium max-w-[200px] truncate" title={log.archiveTitle}>
                      {log.archiveTitle}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-[180px] truncate font-medium" title={log.purpose}>
                      {log.purpose}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {log.result === 'Success' ? (
                        <span className="bg-emerald-50 border border-emerald-150 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px] inline-flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-emerald-500" />
                          审批通过 / 链上已存证 (Success)
                        </span>
                      ) : (
                        <span className="bg-rose-50 border border-rose-250 text-rose-750 px-2 py-0.5 rounded font-bold text-[10px] inline-flex items-center gap-1 animate-pulse">
                          <ShieldAlert className="w-3 h-3 text-rose-500" />
                          访问被拦截 / 未经审批 (Denied)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApprovePanel;
