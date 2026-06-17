import React from 'react';
import { Plus, Building, HardHat, Layers, FileText } from 'lucide-react';
import { LOGIC_OPERATORS, QueryCondition } from '../../integrator/archiveData';
import { PROJECT_FIELDS, UNIT_FIELDS, VOLUME_FIELDS, FILE_FIELDS } from './searchData';

interface SearchFiltersProps {
  selectedArchiveType: '建设档案' | '司法档案' | '文书档案';
  onArchiveTypeChange: (type: '建设档案' | '司法档案' | '文书档案') => void;
  comprehensiveTab: 'PROJECT' | 'UNIT' | 'VOLUME' | 'FILE';
  onTabChange: (tab: 'PROJECT' | 'UNIT' | 'VOLUME' | 'FILE') => void;
  queryConditions: QueryCondition[];
  onConditionChange: (conditions: QueryCondition[]) => void;
}

const getFieldsForCurrentTab = (tab: 'PROJECT' | 'UNIT' | 'VOLUME' | 'FILE') => {
  if (tab === 'PROJECT') return PROJECT_FIELDS;
  if (tab === 'UNIT') return UNIT_FIELDS;
  if (tab === 'FILE') return FILE_FIELDS;
  return VOLUME_FIELDS;
};

const SearchFilters: React.FC<SearchFiltersProps> = ({
  selectedArchiveType,
  onArchiveTypeChange,
  comprehensiveTab,
  onTabChange,
  queryConditions,
  onConditionChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Dynamic Archive Type Switcher */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 bg-slate-50/60 p-3 rounded-xl border border-slate-150">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          档案门类类型:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {(['建设档案', '司法档案', '文书档案'] as const).map((t) => (
            <button
              key={t}
              onClick={() => onArchiveTypeChange(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition border ${
                selectedArchiveType === t
                  ? 'bg-blue-600 text-white border-blue-500 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic level tabs for 建设档案 (PROJECT, UNIT, VOLUME) */}
      {selectedArchiveType === '建设档案' ? (
        <div className="flex border-b border-slate-150 pb-2 gap-2">
          <button 
            onClick={() => onTabChange('PROJECT')}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center ${
              comprehensiveTab === 'PROJECT' 
                ? 'bg-blue-50 text-blue-600 border-blue-200' 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Building className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            项目级查询
          </button>
          <button 
            onClick={() => onTabChange('UNIT')}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center ${
              comprehensiveTab === 'UNIT' 
                ? 'bg-blue-50 text-blue-600 border-blue-200' 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <HardHat className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
            工程级查询
          </button>
          <button 
            onClick={() => onTabChange('VOLUME')}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center ${
              comprehensiveTab === 'VOLUME' 
                ? 'bg-blue-50 text-blue-600 border-blue-200' 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 mr-1.5 text-primary" />
            案卷级查询
          </button>
          <button 
            onClick={() => onTabChange('FILE')}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center ${
              comprehensiveTab === 'FILE' 
                ? 'bg-blue-50 text-blue-600 border-blue-200' 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            文件级查询
          </button>
        </div>
      ) : (
        <div className="text-xs text-slate-500 font-bold bg-slate-50 px-4 py-2 rounded-lg border flex items-center justify-between">
          <span>ℹ️ 当前门类档案已自动激活【案卷级查询】进行穿透过滤</span>
          <span className="text-[10px] bg-slate-150 border px-1.5 rounded text-slate-500">仅有案卷层实体</span>
        </div>
      )}

      {/* Condition Editor list */}
      <div className="space-y-3 pt-1">
        {queryConditions.map((cond, index) => {
          const currentFields = getFieldsForCurrentTab(comprehensiveTab);
          return (
            <div key={cond.id} className="flex flex-col sm:flex-row items-center gap-2.5">
              {/* Select Fields */}
              <div className="w-full sm:w-[150px]">
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-700"
                  value={cond.field}
                  onChange={(e) => {
                    const next = [...queryConditions];
                    next[index].field = e.target.value;
                    next[index].value = '';
                    onConditionChange(next);
                  }}
                  title="查询字段"
                  }}
                >
                  {currentFields.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              {/* Operator */}
              <div className="w-full sm:w-[120px]">
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-700"
                  value={cond.operator}
                  onChange={(e) => {
                    const next = [...queryConditions];
                    next[index].operator = e.target.value;
                    onConditionChange(next);
                  }}
                  title="逻辑运算符"
                  }}
                >
                  {LOGIC_OPERATORS.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
              </div>

              {/* Value Field */}
              <div className="flex-1 w-full relative">
                {(() => {
                  const matchedField = currentFields.find(f => f.value === cond.field);
                  if (matchedField?.type === 'select') {
                    return (
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-700"
                        value={cond.value}
                        onChange={(e) => {
                          const next = [...queryConditions];
                          next[index].value = e.target.value;
                          onConditionChange(next);
                        }}
                        title="查询值"
                      >
                        <option value="">请选择值...</option>
                        {matchedField.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    );
                  } else {
                    return (
                      <input 
                        type="text"
                        placeholder={`输入进行${matchedField?.label || '属性'}匹配...`}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-650"
                        value={cond.value}
                        onChange={(e) => {
                          const next = [...queryConditions];
                          next[index].value = e.target.value;
                          onConditionChange(next);
                        }}
                      />
                    );
                  }
                })()}
              </div>

              {queryConditions.length > 1 && (
                <button 
                  onClick={() => onConditionChange(queryConditions.filter(c => c.id !== cond.id))}
                  className="p-1 px-2.5 border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
                >
                  删除
                </button>
              )}
            </div>
          );
        })}

        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <button 
            onClick={() => {
              const fields = getFieldsForCurrentTab(comprehensiveTab);
              onConditionChange([...queryConditions, { 
                id: Date.now().toString(), 
                field: fields[0].value, 
                operator: 'includes', 
                value: '' 
              }]);
            }}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 hover:border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>添加并关系条件</span>
          </button>

          <div className="flex gap-2">
            <button 
              onClick={() => {
                const fields = getFieldsForCurrentTab(comprehensiveTab);
                onConditionChange([{ id: '1', field: fields[0].value, operator: 'includes', value: '' }]);
              }}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold cursor-pointer"
            >
              重置条件清空
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
