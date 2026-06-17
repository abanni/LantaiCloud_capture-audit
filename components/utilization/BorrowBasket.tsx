import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import { SelectionItem } from '../../types';

interface BorrowBasketProps {
  basket: SelectionItem[];
}

const BorrowBasket: React.FC<BorrowBasketProps> = ({ basket }) => {
  const navigate = useNavigate();

  if (basket.length === 0) {
    return (
      <div className="p-4 bg-amber-50 rounded-xl flex items-center gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0" />
        <div className="text-xs font-bold leading-normal text-amber-950">
          利用档案清单目前为空！
          <span className="font-normal block text-slate-500 mt-1">
            请先前往 <span className="text-blue-600 font-semibold cursor-pointer underline" onClick={() => navigate('/archive-center')}>"我的档案馆"</span> 或 <span className="text-blue-600 font-semibold cursor-pointer underline" onClick={() => navigate('/archive-search')}>"条件综合检索/全文检索"</span> 中，找到您要利用的案卷或文件，点击其名下的 <span className="bg-emerald-50 border border-emerald-250 px-1 rounded text-emerald-700 font-bold">添加到利用</span>，即可自动将其锁定并打包关联至本申请表单。
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-primary/5 rounded-xl space-y-2 leading-relaxed">
      <span className="font-bold block text-indigo-950 text-xs">📦 已自动关联导入的待申请利用清单 ({basket.length}) :</span>
      <div className="max-h-24 overflow-y-auto space-y-1 bg-white p-2.5 rounded-lg font-mono text-[11px] text-slate-700">
        {basket.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span className="truncate max-w-[500px]">🔹 [{item.code}] - {item.title}</span>
            <span className="text-slate-400 font-bold shrink-0">[{item.type === 'FILE' ? '文件' : '整卷'}]</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BorrowBasket;
