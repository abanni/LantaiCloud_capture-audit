import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Layers, 
  SlidersHorizontal, 
  Plus, 
  CheckSquare, 
  Square, 
  Eye,
  FileSearch,
  Compass,
  ArrowRight,
  Briefcase,
  Building,
  HardHat,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { SelectionItem } from '../../types';
import ArchiveDetailView from './ArchiveDetailView';
import { 
  ArchiveItem, 
  ARCHIVES_DATA, 
  LOGIC_OPERATORS, 
  QueryCondition,
  getStoredBasket,
  setStoredBasket 
} from '../integrator/archiveData';

interface ArchiveSearchProps {
  initialMode?: 'FULL_TEXT' | 'COMPREHENSIVE';
}

// --- PROJECT LEVEL SEARCH FIELDS (建设档案 ONLY) ---
const PROJECT_FIELDS = [
  { label: '项目名称', value: 'projectName' },
  { label: '参建单位名称', value: 'participantUnit' },
  { label: '年度', value: 'year', type: 'select', options: ['2026', '2025', '2024', '2023'] },
  { label: '项目地点', value: 'location' },
  { label: '项目类型', value: 'projectType', type: 'select', options: ['房建', '市政', '工业'] },
  { label: '施工许可证号', value: 'workPermitNo' }
];

// --- ENGINEERING LEVEL SEARCH FIELDS (建设档案 ONLY) ---
const UNIT_FIELDS = [
  { label: '单体工程名称', value: 'unitName' },
  { label: '参建单位名称', value: 'participantUnit' },
  { label: '年度', value: 'year', type: 'select', options: ['2026', '2025', '2024', '2023'] },
  { label: '造价', value: 'cost' },
  { label: '开工日期', value: 'startDate' },
  { label: '竣工日期', value: 'endDate' },
  { label: '质量监督号', value: 'qualitySupervisionNo' }
];

// --- VOLUME LEVEL SEARCH FIELDS (ALL ARCHIVE TYPES) ---
const VOLUME_FIELDS = [
  { label: '案卷题名', value: 'title' },
  { label: '档号', value: 'archiveCode' },
  { label: '原档号', value: 'originalCode' },
  { label: '编制单位', value: 'project' },
  { label: '载体类型', value: 'type', type: 'select', options: ['纸质', '电子', '缩微品', '电子/纸质'] },
  { label: '年度', value: 'year', type: 'select', options: ['2026', '2025', '2024', '2023'] },
  { label: '保管期限', value: 'retention', type: 'select', options: ['永久', '30年', '10年'] },
  { label: '密级', value: 'securityLevel', type: 'select', options: ['公开', '限阅', '机密'] },
  { label: '主题词', value: 'keywords' },
  { label: '进馆日期', value: 'date' }
];

// --- MOCK PROJECT-LEVEL DATA FOR 建设档案 ---
const MOCK_SEARCH_PROJECTS = [
  {
    id: 'arc-1',
    projectName: '张浦镇德国工业园标准厂房四期项目',
    archiveCode: 'A.320583-2025-001',
    participantUnit: '苏州第二建筑安装集团有限公司 / 上海无无科技有限公司',
    constructionUnit: '上海无无科技有限公司',
    year: '2025',
    location: '昆山市张浦镇德国工业园',
    projectType: '工业',
    workPermitNo: '建字第32058320250012号',
    securityLevel: '公开',
    summary: '该项目包括4座标准化轻钢单层厂房及其附属多功能研发配楼，总建筑面积超48000平方米。',
    cost: 45000000,
    archiveType: '建设档案'
  },
  {
    id: 'arc-4',
    projectName: '陆家镇童趣小镇幼儿园新建级配工程',
    archiveCode: 'A.320583-2025-068',
    participantUnit: '昆山市第一建筑工程有限公司 / 昆山市陆家镇人民政府',
    constructionUnit: '昆山市陆家镇人民政府',
    year: '2025',
    location: '昆山市陆家镇童趣小镇园区',
    projectType: '房建',
    workPermitNo: '建字第32058320250089号',
    securityLevel: '公开',
    summary: '该精品幼儿园新建级配工程，涵盖教学辅楼地基静载试验报告、无盲区低位监控铺设。',
    cost: 28000000,
    archiveType: '建设档案'
  }
];

// --- MOCK ENGINEERING-LEVEL DATA FOR 建设档案 ---
const MOCK_SEARCH_UNITS = [
  {
    id: 'u-1',
    archiveCode: 'A.320583-2025-001-E01',
    projectName: '张浦镇德国工业园标准厂房四期项目',
    unitName: '1号标准化轻钢单层厂房',
    participantUnit: '苏州第二建筑安装集团有限公司',
    constructionUnit: '上海无无科技有限公司',
    year: '2025',
    cost: 12000000,
    startDate: '2025-03-01',
    endDate: '2025-09-30',
    qualitySupervisionNo: '质监-2025-0018-01',
    securityLevel: '公开',
    summary: '1号车间基础静载试验，钢结构承重柱安装检测完毕。',
    archiveType: '建设档案'
  },
  {
    id: 'u-2',
    archiveCode: 'A.320583-2025-001-E02',
    projectName: '张浦镇德国工业园标准厂房四期项目',
    unitName: '2号多功能研发配楼',
    participantUnit: '昆山安装建设有限公司',
    constructionUnit: '上海无无科技有限公司',
    year: '2025',
    cost: 8000000,
    startDate: '2025-04-10',
    endDate: '2025-10-15',
    qualitySupervisionNo: '质监-2025-0018-02',
    securityLevel: '公开',
    summary: '2号配楼主体砌体施工，外檐抹灰，消防管线预埋。',
    archiveType: '建设档案'
  },
  {
    id: 'u-3',
    archiveCode: 'A.320583-2025-068-E01',
    projectName: '陆家镇童趣小镇幼儿园新建级配工程',
    unitName: '教学主楼抗震加固工程',
    participantUnit: '昆山市第一建筑工程有限公司',
    constructionUnit: '昆山市陆家镇人民政府',
    year: '2025',
    cost: 15000000,
    startDate: '2025-02-15',
    endDate: '2025-05-30',
    qualitySupervisionNo: '质监-2025-0145',
    securityLevel: '公开',
    summary: '教学主辅楼抗震加固、高强碳纤维布粘帖及主体抹浆拉毛工程。',
    archiveType: '建设档案'
  },
  {
    id: 'u-4',
    archiveCode: 'A.320583-2025-068-E02',
    projectName: '陆家镇童趣小镇幼儿园新建级配工程',
    unitName: '园区配套管网工程',
    participantUnit: '昆山市自来水集团有限公司',
    constructionUnit: '昆山市陆家镇人民政府',
    year: '2025',
    cost: 4000000,
    startDate: '2025-03-20',
    endDate: '2025-06-10',
    qualitySupervisionNo: '质监-2025-0146',
    securityLevel: '公开',
    summary: '教学主辅楼抗震加固及园区地下排水、彩色沥青道路工程。',
    archiveType: '建设档案'
  }
];

// --- HELPER TO EXPAND ARCHIVES INTO VOLUME-LEVEL DATA ---
const getVolumeDataList = (archiveType: string) => {
  return ARCHIVES_DATA.filter(item => item.archiveType === archiveType).map(item => ({
    id: item.id,
    archiveCode: item.archiveCode,
    originalCode: item.originalCode,
    projectName: item.projectName,
    title: item.projectName + ' 案卷整卷',
    project: item.constructionUnit,
    type: '电子/纸质',
    year: item.year,
    retention: item.retentionPeriod,
    securityLevel: item.securityLevel,
    keywords: item.summary,
    date: item.formationDate,
    constructionUnit: item.constructionUnit,
    cost: item.cost,
    summary: item.summary,
    archiveType: item.archiveType,
    rawArchive: item
  }));
};

const ArchiveSearch: React.FC<ArchiveSearchProps> = ({ initialMode = 'COMPREHENSIVE' }) => {
  const navigate = useNavigate();
  const [archives] = useState<ArchiveItem[]>(ARCHIVES_DATA);
  const [selectedArchive, setSelectedArchive] = useState<ArchiveItem | null>(null);
  const [basket, setBasket] = useState<SelectionItem[]>(getStoredBasket());

  // --- COMPREHENSIVE TABS AND CONFIGS ---
  const [selectedArchiveType, setSelectedArchiveType] = useState<'建设档案' | '司法档案' | '文书档案'>('建设档案');
  const [comprehensiveTab, setComprehensiveTab] = useState<'PROJECT' | 'UNIT' | 'VOLUME'>('VOLUME');

  // Full-text search key (used only in full text mode passed from main entry point)
  const [fullTextKey, setFullTextKey] = useState('');

  // Auto-switch back to VOLUME level if selected archive type is not '建设档案'
  useEffect(() => {
    if (selectedArchiveType !== '建设档案') {
      setComprehensiveTab('VOLUME');
    }
  }, [selectedArchiveType]);

  // Comprehensive query conditions state
  const [queryConditions, setQueryConditions] = useState<QueryCondition[]>([
    { id: '1', field: 'title', operator: 'includes', value: '' }
  ]);

  // Whenever the tab or type changes, sync default condition field
  useEffect(() => {
    if (initialMode === 'COMPREHENSIVE') {
      if (comprehensiveTab === 'PROJECT') {
        setQueryConditions([{ id: '1', field: 'projectName', operator: 'includes', value: '' }]);
      } else if (comprehensiveTab === 'UNIT') {
        setQueryConditions([{ id: '1', field: 'unitName', operator: 'includes', value: '' }]);
      } else {
        setQueryConditions([{ id: '1', field: 'title', operator: 'includes', value: '' }]);
      }
    }
  }, [comprehensiveTab, selectedArchiveType, initialMode]);

  // Sync basket to localStorage on state change
  useEffect(() => {
    setStoredBasket(basket);
  }, [basket]);

  // Handle opening target project detail view
  const handleViewArchiveDetail = (item: any) => {
    // Find matching archive record in ARCHIVES_DATA
    const found = archives.find(a => a.id === item.id) 
      || (item.rawArchive ? archives.find(a => a.id === item.rawArchive.id) : null)
      || archives.find(a => a.projectName === item.projectName)
      || archives[0];
    
    setSelectedArchive(found);
  };

  const handleOpenRegisterForm = () => {
    navigate('/archive-utilization');
  };

  // Basket verification helper
  const isSelectedInBasket = (id: string, type: 'FILE' | 'VOLUME') => {
    return basket.some(b => b.id === id && b.type === type);
  };

  const handleToggleBasketDirect = (item: any) => {
    const itemId = item.id;
    const title = item.projectName || item.unitName || item.title;
    const code = item.archiveCode;

    if (isSelectedInBasket(itemId, 'VOLUME')) {
      setBasket(prev => prev.filter(b => !(b.id === itemId && b.type === 'VOLUME')));
    } else {
      const newItem: SelectionItem = {
        id: itemId,
        title: title,
        type: 'VOLUME',
        code: code
      };
      setBasket(prev => [...prev, newItem]);
    }
  };

  const getFieldsForCurrentTab = () => {
    if (comprehensiveTab === 'PROJECT') return PROJECT_FIELDS;
    if (comprehensiveTab === 'UNIT') return UNIT_FIELDS;
    return VOLUME_FIELDS;
  };

  // --- QUERY ENGINE ---
  const applyFilters = () => {
    if (initialMode === 'FULL_TEXT') {
      if (!fullTextKey.trim()) return archives;
      const key = fullTextKey.toLowerCase();
      return archives.filter(item => 
        item.projectName.toLowerCase().includes(key) ||
        item.constructionUnit.toLowerCase().includes(key) ||
        item.archiveCode.toLowerCase().includes(key) ||
        item.originalCode.toLowerCase().includes(key) ||
        item.summary.toLowerCase().includes(key) ||
        item.location.toLowerCase().includes(key)
      );
    }

    // Comprehensive query based on selected Archive Type & Tab Level
    let source: any[] = [];
    if (selectedArchiveType === '建设档案') {
      if (comprehensiveTab === 'PROJECT') {
        source = MOCK_SEARCH_PROJECTS;
      } else if (comprehensiveTab === 'UNIT') {
        source = MOCK_SEARCH_UNITS;
      } else {
        source = getVolumeDataList('建设档案');
      }
    } else {
      source = getVolumeDataList(selectedArchiveType);
    }

    return source.filter(item => {
      return queryConditions.every(cond => {
        if (!cond.value.trim()) return true; // ignore empty conditions
        const recordValue = (item as any)[cond.field]?.toString().toLowerCase() || '';
        const searchVal = cond.value.toLowerCase();

        switch (cond.operator) {
          case 'equals':
            return recordValue === searchVal;
          case 'excludes':
            return !recordValue.includes(searchVal);
          case 'gt':
            return parseFloat(recordValue) > parseFloat(searchVal);
          case 'lt':
            return parseFloat(recordValue) < parseFloat(searchVal);
          case 'includes':
          default:
            return recordValue.includes(searchVal);
        }
      });
    });
  };

  const filteredSearchResults = applyFilters();

  // If viewing internal file tree
  if (selectedArchive) {
    return (
      <div className="flex-1 h-full bg-white flex flex-col">
        <ArchiveDetailView 
          onBack={() => setSelectedArchive(null)}
          initialData={selectedArchive}
          basket={basket}
          setBasket={setBasket}
          onRegister={handleOpenRegisterForm}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f0f2f5] overflow-y-auto p-6 space-y-6 flex flex-col min-h-screen">
      
      <div className="space-y-6 flex-1 flex flex-col animate-in fade-in slide-in-from-top-4 duration-300 w-full">
        
        {/* Conditions Console */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          
          {/* Header Title */}
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">
                {initialMode === 'FULL_TEXT' ? '全文穿透输入检索' : '综合多条件智能检索控制台'}
              </span>
            </div>
          </div>

          {/* Condition Contents */}
          {initialMode === 'FULL_TEXT' ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="输入关键字进行无纸化全文穿透检索 (如：钢结构, 人防掩蔽, 项目地点, 原档号, 备注等)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  value={fullTextKey}
                  onChange={(e) => setFullTextKey(e.target.value)}
                />
              </div>
              {fullTextKey && (
                <button 
                  onClick={() => setFullTextKey('')}
                  className="text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 border border-transparent rounded-lg px-2.5 py-2.5 flex items-center font-bold"
                >
                  清空
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Dynamic Archive Type Switcher (1. No longer has full-text switch in /archive-search) */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 bg-slate-50/60 p-3 rounded-xl border border-slate-150">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  档案门类类型:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(['建设档案', '司法档案', '文书档案'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedArchiveType(t)}
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
                    onClick={() => setComprehensiveTab('PROJECT')}
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
                    onClick={() => setComprehensiveTab('UNIT')}
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
                    onClick={() => setComprehensiveTab('VOLUME')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center ${
                      comprehensiveTab === 'VOLUME' 
                        ? 'bg-blue-50 text-blue-600 border-blue-200' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 mr-1.5 text-primary" />
                    案卷级查询
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
                {queryConditions.map((cond, index) => (
                  <div key={cond.id} className="flex flex-col sm:flex-row items-center gap-2.5">
                    
                    {/* Select Fields */}
                    <div className="w-full sm:w-[150px]">
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-700"
                        value={cond.field}
                        title="查询字段"
                        onChange={(e) => {
                          const next = [...queryConditions];
                          next[index].field = e.target.value;
                          next[index].value = ''; // Reset value on field change
                          setQueryConditions(next);
                        }}
                      >
                        {getFieldsForCurrentTab().map(f => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Operator */}
                    <div className="w-full sm:w-[120px]">
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-700"
                        value={cond.operator}
                        title="逻辑运算符"
                        onChange={(e) => {
                          const next = [...queryConditions];
                          next[index].operator = e.target.value;
                          setQueryConditions(next);
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
                        const matchedField = getFieldsForCurrentTab().find(f => f.value === cond.field);
                        if (matchedField?.type === 'select') {
                          return (
                            <select
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-700"
                              value={cond.value}
                              title="查询值"
                              onChange={(e) => {
                                const next = [...queryConditions];
                                next[index].value = e.target.value;
                                setQueryConditions(next);
                              }}
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
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-650"
                              value={cond.value}
                              onChange={(e) => {
                                const next = [...queryConditions];
                                next[index].value = e.target.value;
                                setQueryConditions(next);
                              }}
                            />
                          );
                        }
                      })()}
                    </div>

                    {queryConditions.length > 1 && (
                      <button 
                        onClick={() => setQueryConditions(queryConditions.filter(c => c.id !== cond.id))}
                        className="p-1 px-2.5 border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
                      >
                        删除
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      const fields = getFieldsForCurrentTab();
                      setQueryConditions([...queryConditions, { 
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
                        const fields = getFieldsForCurrentTab();
                        setQueryConditions([{ id: '1', field: fields[0].value, operator: 'includes', value: '' }]);
                      }}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      重置条件清空
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Grid inside search tab */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md divide-y divide-slate-100 min-h-[300px] flex flex-col justify-between">
          <div>
            <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-150 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">
                🔍 检索匹配过滤结果列表 ({filteredSearchResults.length} 个记录)
              </span>
              <p className="text-[10px] text-slate-400 font-medium">支持直接点选多项目加到“利用清单”，一并提请借阅审批</p>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSearchResults.length > 0 ? (
                filteredSearchResults.map(item => {
                  const contains = isSelectedInBasket(item.id, 'VOLUME');
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
                          onClick={() => handleToggleBasketDirect(item)}
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
                            onClick={() => handleViewArchiveDetail(item)}
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
      </div>
    </div>
  );
};

export default ArchiveSearch;
