import React from 'react';
import { CheckSquare, Square, Eye, Layers } from 'lucide-react';
import { SelectionItem } from '../../../types';

export type SearchResultItem = {
  id: string;
  archiveCode?: string;
  projectName?: string;
  unitName?: string;
  title?: string;
  constructionUnit?: string;
  participantUnit?: string;
  projectType?: string;
  workPermitNo?: string;
  qualitySupervisionNo?: string;
  cost?: number;
  securityLevel?: string;
  summary?: string;
  type?: string;
  [key: string]: any;
};

interface SearchResultsProps {
  results: SearchResultItem[];
  comprehensiveTab: 'PROJECT' | 'UNIT' | 'VOLUME';
  basket: SelectionItem[];
  onToggleBasket: (item: SearchResultItem) => void;
  onViewDetail: (item: SearchResultItem) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  comprehensiveTab,
  basket,
  onToggleBasket,
  onViewDetail,
}) => {
  const isSelectedInBasket = (id: string) => {
    return basket.some(b => b.id === id && b.type === 'VOLUME');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md divide-y divide-slate-100 min-h-[300px] flex flex-col justify-between">
      <div>
        <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-150 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700">
            🔍 检索匹配过滤结果列表 ({results.length} 个记录)
          </span>
          <p className="text-[10px] text-slate-400 font-medium">支持直接点选多项目加到"利用清单"，一并提请借阅审批</p>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.length > 0 ? (
            results.map(item => {
              const contains = isSelectedInBasket(item.id);
              return (
                <div 
                  key={item.id}
                  className={`p-4 border rounded-2xl transition hover:shadow-xs flex gap-3 ${
                    contains ? 'bg-primary/5 border-primary/20' : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Left Basket toggle checkbox */}
                  <div className="pt-0.5 shrink-0">
                    <button 
                      onClick={() => onToggleBasket(item)}
                      className="p-1 hover:bg-slate-150 rounded"
                      title={contains ? "移除待利用清单" : "加入待利用清单"}
                    >
                      {contains ? (
                        <CheckSquare className="w-5 h-5 text-primary" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-350" />
                      )}
                    </button>
                  </div>

                  {/* Item card */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1 truncate block max-w-[240px]" title={item.projectName || item.title || item.unitName}>
                        {item.projectName || item.unitName || item.title}
                      </h4>
                      <span className={`px-1.5 py-0.5 border rounded text-[9px] font-bold shrink-0 ${
                        item.securityLevel === '公开' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {item.securityLevel || '公开'}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans line-clamp-2">
                      {item.summary}
                    </p>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[10px] text-slate-500 border-t border-slate-100 pt-2 shrink-0">
                      {comprehensiveTab === 'PROJECT' ? (
                        <>
                          <span className="truncate">项目档号: {item.archiveCode}</span>
                          <span className="truncate">项目类型: {item.projectType}</span>
                          <span className="truncate">编制单位: {item.constructionUnit}</span>
                          <span className="truncate">许可证号: {item.workPermitNo}</span>
                        </>
                      ) : comprehensiveTab === 'UNIT' ? (
                        <>
                          <span className="truncate">关联项目: {item.projectName}</span>
                          <span className="truncate">参建单位: {item.participantUnit}</span>
                          <span className="truncate">造价: ¥{(item.cost / 10000).toFixed(2)}万</span>
                          <span className="truncate">监督号: {item.qualitySupervisionNo}</span>
                        </>
                      ) : (
                        <>
                          <span className="truncate">档号: {item.archiveCode}</span>
                          <span className="truncate">载体: {item.type || '电子/纸质'}</span>
                          <span className="truncate">编制单位: {item.project || item.constructionUnit}</span>
                          <span className="truncate">密级: {item.securityLevel || '公开'}</span>
                        </>
                      )}
                    </div>

                    <div className="flex justify-end gap-1.5 pt-1.5">
                      <button 
                        onClick={() => onViewDetail(item)}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-[10px] font-bold border border-blue-200 flex items-center gap-1 transition-all pointer duration-150 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>案卷浏览</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 py-16 text-center text-slate-500 font-semibold bg-white flex flex-col items-center justify-center space-y-2 w-full">
              <Layers className="w-8 h-8 text-slate-350 animate-bounce" />
              <span>未检索到匹配的在库档案或案卷</span>
              <p className="text-[10px] font-normal text-slate-400">可以重新设定查询控制台的规则进行组合穿透</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
