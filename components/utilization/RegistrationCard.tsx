import React from 'react';
import { SelectionItem } from '../../types';

interface RegistrationCardProps {
  reg: {
    id: string;
    registerName: string;
    identityCard: string;
    company: string;
    phone: string;
    purpose: string;
    useType: string;
    items: SelectionItem[];
    date: string;
    status: 'PENDING' | 'APPROVED';
  };
  mode: 'apply' | 'approve';
  onApprove?: (regId: string) => void;
  onReject?: (regId: string) => void;
}

const RegistrationCard: React.FC<RegistrationCardProps> = ({ reg, mode, onApprove, onReject }) => {
  return (
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
      <td className="py-4 px-4 max-w-[200px]" title={reg.items.map(i => i.title).join(' / ')}>
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-700">{reg.items.length} 个关联档案</span>
          <span className="text-[10px] text-slate-400 font-mono truncate">
            {reg.items.map(i => i.title).join(' / ')}
          </span>
        </div>
      </td>
      <td className="py-4 px-4 text-slate-550 max-w-[170px] truncate" title={reg.purpose}>
        {reg.purpose}
      </td>
      <td className="py-4 px-4 text-center">
        {/* APPLY MODE STATUS DISPLAY */}
        {mode === 'apply' && (
          reg.status === 'APPROVED' ? (
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded font-black text-[10px] inline-flex items-center gap-1.5 shadow-xs">
              <span className="w-3.5 h-3.5 text-emerald-500 shrink-0 animate-pulse">✓</span>
              <span>已核准 (加盖分布式印信红章)</span>
            </span>
          ) : (
            <span className="bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-0.5 rounded font-bold text-[10px] inline-flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 text-amber-500 shrink-0">⏰</span>
              <span>待会审 (排队套用电子公章)</span>
            </span>
          )
        )}

        {/* APPROVE MODE ACTION BUTTONS */}
        {mode === 'approve' && (
          reg.status === 'APPROVED' ? (
            <span className="bg-emerald-50 border border-emerald-150 text-emerald-700 px-2.5 py-0.5 rounded font-extrabold text-[10px] inline-flex items-center gap-1 shrink-0">
              <span className="w-3 h-3 text-emerald-500">👤</span>
              <span>核审已批准 (加盖红章底本)</span>
            </span>
          ) : (
            <div className="flex justify-center gap-1.5">
              <button
                onClick={() => onApprove?.(reg.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[10.5px] font-bold shadow-xs hover:scale-102 transition cursor-pointer flex items-center gap-0.5"
                title="核准该借阅申请，允许调取并智能自动用印"
              >
                <span className="w-3 h-3">✓</span>
                <span>在线批准 ✍️</span>
              </button>
              <button
                onClick={() => onReject?.(reg.id)}
                className="bg-slate-200 hover:bg-rose-600 text-slate-700 hover:text-white px-2 py-1 rounded-lg text-[10.5px] font-bold shadow-xs transition cursor-pointer flex items-center gap-0.5"
                title="拒绝该利用事由申请"
              >
                <span className="w-3 h-3">✕</span>
                <span>拒绝</span>
              </button>
            </div>
          )
        )}
      </td>
    </tr>
  );
};

export default RegistrationCard;
