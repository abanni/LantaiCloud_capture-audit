import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  CheckCircle2, 
  Info,
  Clock,
  KeyRound,
  UserCheck,
  ShieldAlert,
  Send,
  Briefcase,
  FileSearch,
  BookOpen,
  FileText,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { SelectionItem } from '../../types';
import { 
  RegistrationItem, 
  getStoredBasket, 
  setStoredBasket, 
  getStoredRegistrations, 
  setStoredRegistrations, 
  getStoredAuditLogs, 
  setStoredAuditLogs,
  INITIAL_AUDIT_LOGS 
} from '../integrator/archiveData';
import ApplyPanel, { ApplyFormData } from './ApplyPanel';
import ApprovePanel from './ApprovePanel';

interface ArchiveUtilizationProps {
  mode?: 'apply' | 'approve';
}

const ArchiveUtilization: React.FC<ArchiveUtilizationProps> = ({ mode = 'apply' }) => {
  const navigate = useNavigate();
  
  // Stored state structures loaded from localStorage
  const [basket, setBasket] = useState<SelectionItem[]>(getStoredBasket());
  
  // Custom initial registrations with one pending and one approved
  const [registrations, setRegistrations] = useState<RegistrationItem[]>(() => {
    const existing = getStoredRegistrations();
    if (existing.length === 0) {
      const initial: RegistrationItem[] = [
        {
          id: 'REG-881203',
          registerName: '张大勇',
          identityCard: 'EMPID-88942',
          company: '工程部 / 项目开发部',
          phone: '17751239920',
          purpose: '因承建德国工业园四期冷库二期吊车荷载验算，需调取一期地下桩基埋深承载检测大样',
          useType: '在线脱敏调阅',
          items: [
            { id: 'item-1', title: '张浦镇德国工业园标准厂房一期 桩基承载力静载荷质检评估报告', type: 'FILE', code: 'A.320583-VOL01' }
          ],
          date: new Date().toISOString().split('T')[0],
          status: 'PENDING'
        },
        {
          id: 'REG-881201',
          registerName: '张大勇',
          identityCard: 'EMPID-88942',
          company: '工程部 / 项目开发部',
          phone: '17751239920',
          purpose: '由于项目工程消防设施例行关联审计，需要调取一期消防总平面会审出证图纸',
          useType: '加盖红章出证',
          items: [
            { id: 'item-2', title: '德国合资工业园二期消防联席验收综合报告 (官方红章底册)', type: 'FILE', code: 'A.320583-VOL02' }
          ],
          date: '2026-06-06',
          status: 'APPROVED'
        }
      ];
      setStoredRegistrations(initial);
      return initial;
    }
    return existing;
  });

  const [auditLogs, setAuditLogs] = useState<any[]>(getStoredAuditLogs());

  // Track state syncing to storage
  useEffect(() => {
    setStoredBasket(basket);
  }, [basket]);

  useEffect(() => {
    setStoredRegistrations(registrations);
  }, [registrations]);

  useEffect(() => {
    setStoredAuditLogs(auditLogs);
  }, [auditLogs]);

  // Submit utilization request from ApplyPanel
  const handleApplySubmit = (form: ApplyFormData) => {
    if (basket.length === 0) {
      alert('⚠️ 请先选中要利用的案卷或目录（利用清单目前为空，可到"我的档案馆"或"查询"中，找到案卷或文件，点击[添加到利用]即可自动关联带入）');
      return;
    }

    const newRegItem: RegistrationItem = {
      id: `REG-${Math.floor(100000 + Math.random() * 900000)}`,
      registerName: form.username,
      identityCard: form.identityCard,
      company: form.company,
      phone: form.phone,
      purpose: form.purpose,
      useType: form.type,
      items: [...basket],
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    };

    setRegistrations(prev => [newRegItem, ...prev]);
    setBasket([]);
    alert("✉️ 您的档案利用申请已递交成功！\n系统已自动为您生成审计编号并推送至档案馆 [借问审批] 核章台。请等待档案馆管理员后台审批并套印电子档案印信章。");
  };

  // Administrator approves a pending borrowing application
  const handleApproveRegistration = (regId: string) => {
    const targetReg = registrations.find(r => r.id === regId);
    if (!targetReg) return;

    setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: 'APPROVED' } : r));

    const newLog = {
      id: `ARC-LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      accessTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userName: targetReg.registerName,
      userType: '内部申请人批准',
      archiveTitle: targetReg.items.map(i => i.title).join(' / ') || '档案材料',
      type: targetReg.useType,
      purpose: targetReg.purpose,
      result: 'Success' as const
    };

    setAuditLogs(prev => [newLog, ...prev]);
    alert(`🎉 申请单 #${regId} 核审通过！\n已成功对该借阅副本授权调用"数智档案馆电子印信/脱敏控制散列"，并自动套印企业公章保护痕迹！`);
  };

  // Administrator rejects a pending borrowing application
  const handleRejectRegistration = (regId: string) => {
    const targetReg = registrations.find(r => r.id === regId);
    if (!targetReg) return;

    setRegistrations(prev => prev.filter(r => r.id !== regId));
    
    const newLog = {
      id: `ARC-LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      accessTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userName: targetReg.registerName,
      userType: '内部申请人驳回',
      archiveTitle: targetReg.items.map(i => i.title).join(' / ') || '档案材料',
      type: targetReg.useType,
      purpose: targetReg.purpose,
      result: 'Denied' as const
    };
    
    setAuditLogs(prev => [newLog, ...prev]);
    alert(`🔒 申请单 #${regId} 已被安全拒绝并退回，拒绝痕迹已被兰台防伪审计后台记录保护。`);
  };

  // Reset all registration and audit data
  const handleResetAll = () => {
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setRegistrations([
      {
        id: 'REG-881203',
        registerName: '张大勇',
        identityCard: 'EMPID-88942',
        company: '工程部 / 项目开发部',
        phone: '17751239920',
        purpose: '因承建德国工业园四期冷库二期吊车荷载验算，需调取一期地下桩基埋深承载检测大样',
        useType: '在线脱敏调阅',
        items: [
          { id: 'item-1', title: '张浦镇德国工业园标准厂房一期 桩基承载力静载荷质检评估报告', type: 'FILE', code: 'A.320583-VOL01' }
        ],
        date: new Date().toISOString().split('T')[0],
        status: 'PENDING'
      },
      {
        id: 'REG-881201',
        registerName: '张大勇',
        identityCard: 'EMPID-88942',
        company: '工程部 / 项目开发部',
        phone: '17751239920',
        purpose: '由于项目工程消防设施例行关联审计，需要调取一期消防总平面会审出证图纸',
        useType: '加盖红章出证',
        items: [
          { id: 'item-2', title: '德国合资工业园二期消防联席验收综合报告 (官方红章底册)', type: 'FILE', code: 'A.320583-VOL02' }
        ],
        date: '2026-06-06',
        status: 'APPROVED'
      }
    ]);
    alert("🔐 后台审批申请及物理审计痕迹复位成功！");
  };

  return (
    <div className="flex-1 bg-[#f0f2f5] overflow-y-auto p-6 space-y-6 flex flex-col min-h-screen">
      
      <div className="space-y-6 flex-1 flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
        {mode === 'apply' ? (
          <>
            <ApplyPanel
              basket={basket}
              onBasketClear={() => setBasket([])}
              onRegisterSubmit={handleApplySubmit}
            />

            {/* REGISTRATIONS QUEUE & HISTORY DISPLAY */}
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
              <div className="flex justify-between items-center pb-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-primary animate-pulse" />
                  <h4 className="font-bold text-xs text-slate-800">
                    我的借阅与审批记录
                  </h4>
                </div>
              </div>

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
                        <th className="py-3 px-4 text-center">审批状态</th>
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
                          <tr key={reg.id} className="hover:bg-primary/[0.15] bg-white font-medium transition-colors">
                            <td className="py-4 px-4 font-mono font-bold text-primary">
                              #{reg.id}
                            </td>
                            <td className="py-4 px-4 text-slate-500 font-mono">
                              {reg.date} (实时)
                            </td>
                            <td className="py-4 px-4 text-slate-800">
                              <div className="font-bold text-slate-850">{reg.registerName}</div>
                              <div className="text-[10px] text-slate-450">{reg.company}</div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`${
                                reg.useType === '加盖红章出证' || reg.useType === '加盖专用印信章'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200' 
                                  : reg.useType === '副本下载' 
                                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                              } border px-2.5 py-0.5 rounded-full font-bold text-[10px]`}>
                                {reg.useType}
                              </span>
                            </td>
                            <td className="py-4 px-4 max-w-[200px]" title={reg.items.map(i=>i.title).join(' / ')}>
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-slate-700">{reg.items.length} 个关联档案</span>
                                <span className="text-[10px] text-slate-400 font-mono truncate">
                                  {reg.items.map(i=>i.title).join(' / ')}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-slate-550 max-w-[170px] truncate" title={reg.purpose}>
                              {reg.purpose}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {reg.status === 'APPROVED' ? (
                                <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded font-black text-[10px] inline-flex items-center gap-1.5 shadow-xs">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 animate-pulse" />
                                  <span>已核准 (加盖分布式印信红章)</span>
                                </span>
                              ) : (
                                <span className="bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-0.5 rounded font-bold text-[10px] inline-flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span>待会审 (排队套用电子公章)</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <ApprovePanel
            registrations={registrations}
            auditLogs={auditLogs}
            onApprove={handleApproveRegistration}
            onReject={handleRejectRegistration}
            onReset={handleResetAll}
          />
        )}
      </div>

    </div>
  );
};

export default ArchiveUtilization;
