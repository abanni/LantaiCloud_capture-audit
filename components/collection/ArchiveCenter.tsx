import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Archive, 
  Search, 
  ChevronRight, 
  Layers, 
  CheckSquare, 
  Square, 
  Bookmark,
  Compass,
  ArrowRight,
  Briefcase,
  Send
} from 'lucide-react';
import { SelectionItem } from '../../types';
import ArchiveDetailView from './ArchiveDetailView';
import { 
  CollectionStatsCard, 
  UtilizationStatsCard 
} from './ArchiveCenterStats';
import { 
  ArchiveItem, 
  ARCHIVES_DATA, 
  getStoredBasket, 
  setStoredBasket 
} from '../integrator/archiveData';

const ArchiveCenter: React.FC = () => {
  const navigate = useNavigate();
  const [archives] = useState<ArchiveItem[]>(ARCHIVES_DATA);
  const [selectedArchive, setSelectedArchive] = useState<ArchiveItem | null>(null);
  
  // Selection basket for utilization synced to localStorage
  const [basket, setBasket] = useState<SelectionItem[]>(getStoredBasket());
  const [searchKey, setSearchKey] = useState('');

  // Sync state to local storage
  useEffect(() => {
    setStoredBasket(basket);
  }, [basket]);

  const handleOpenRegisterForm = () => {
    navigate('/archive-utilization');
  };

  // Basket helper
  const isSelectedInBasket = (id: string, type: 'FILE' | 'VOLUME') => {
    return basket.some(b => b.id === id && b.type === type);
  };

  const handleToggleBasketDirect = (archive: ArchiveItem) => {
    if (isSelectedInBasket(archive.id, 'VOLUME')) {
      setBasket(prev => prev.filter(b => !(b.id === archive.id && b.type === 'VOLUME')));
    } else {
      const newItem: SelectionItem = {
        id: archive.id,
        title: archive.projectName,
        type: 'VOLUME',
        code: archive.archiveCode
      };
      setBasket(prev => [...prev, newItem]);
    }
  };

  const handleViewArchiveDetail = (archive: ArchiveItem) => {
    setSelectedArchive(archive);
  };

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
      
      <div className="space-y-6 flex-1 flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
        
        {/* Filter controls */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Search Inputs */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="搜索档案项目名称、编制单位、档号、档案类型等..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>

          {/* Badges indicators */}
          <div className="flex gap-2">
            <span className="text-[11px] bg-slate-100 font-bold border border-slate-200 px-3 py-1.5 rounded-lg flex items-center text-slate-600 gap-1 shadow-2xs leading-none">
              <Bookmark className="w-3.5 h-3.5 text-blue-500" />
              <span>当前在库：涵盖各门类核心档案</span>
            </span>
          </div>
        </div>

        {/* Main Table view of repositories */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-xs font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-6 w-[120px]">档号 / 编码</th>
                  <th className="py-4 px-6 w-[100px]">档案类型</th>
                  <th className="py-4 px-6">档案项目名称</th>
                  <th className="py-4 px-6">编制单位</th>
                  <th className="py-4 px-6 w-[120px]">入库日期</th>
                  <th className="py-4 px-6 w-[100px]">密级</th>
                  <th className="py-4 px-6 w-[100px]">保管期限</th>
                  <th className="py-4 px-6 w-[100px] text-right">案卷操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {archives
                  .filter(item => {
                    const key = searchKey.toLowerCase();
                    return !key || 
                      item.projectName.toLowerCase().includes(key) || 
                      item.constructionUnit.toLowerCase().includes(key) || 
                      item.archiveCode.toLowerCase().includes(key) ||
                      item.archiveType.toLowerCase().includes(key);
                  })
                  .map((item) => {
                    let securityBadge = 'bg-emerald-50 border-emerald-200 text-emerald-700';
                    if (item.securityLevel === '限阅') securityBadge = 'bg-amber-50 border-amber-200 text-amber-700';
                    if (item.securityLevel === '机密') securityBadge = 'bg-rose-50 border-rose-220 text-rose-700';

                    let periodBadge = 'bg-blue-50 border-blue-200 text-blue-700';
                    if (item.retentionPeriod === '永久') periodBadge = 'bg-primary/10 border-primary/20 text-primary';

                    let typeBadge = 'bg-blue-50 border-blue-200 text-blue-700';
                    if (item.archiveType === '司法档案') typeBadge = 'bg-purple-50 border-purple-200 text-purple-700';
                    if (item.archiveType === '文书档案') typeBadge = 'bg-teal-50 border-teal-200 text-teal-700';

                    const inBasket = isSelectedInBasket(item.id, 'VOLUME');

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors align-middle">
                        <td className="py-4.5 px-6 font-mono text-[11px] text-slate-400 font-bold">
                          {item.archiveCode}
                        </td>
                        <td className="py-4.5 px-6">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${typeBadge}`}>
                            {item.archiveType}
                          </span>
                        </td>
                        <td className="py-4.5 px-6">
                          <div className="flex flex-col">
                            <span className="text-slate-800 font-bold block max-w-[340px] truncate" title={item.projectName}>
                              {item.projectName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                              <Layers className="w-3 h-3 text-slate-300" />
                              详情: {item.totalVolumes}个案卷 / {item.totalFiles}份归档移交文件
                            </span>
                          </div>
                        </td>
                        <td className="py-4.5 px-6 font-medium text-slate-600 max-w-[200px] truncate" title={item.constructionUnit}>
                          {item.constructionUnit}
                        </td>
                        <td className="py-4.5 px-6 font-mono font-medium text-slate-500">
                          {item.formationDate}
                        </td>
                        <td className="py-4.5 px-6">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${securityBadge}`}>
                            {item.securityLevel}
                          </span>
                        </td>
                        <td className="py-4.5 px-6">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${periodBadge}`}>
                            {item.retentionPeriod}
                          </span>
                        </td>
                        <td className="py-4.5 px-6 text-right">
                          <div className="flex justify-end gap-1 items-center">
                            <button 
                              onClick={() => handleToggleBasketDirect(item)}
                              className={`px-2.5 py-1.5 text-[10px] font-bold border rounded-xl flex items-center gap-1 cursor-pointer transition ${
                                inBasket
                                  ? 'bg-indigo-100 text-primary border-primary/20 hover:bg-indigo-200'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                            >
                              <span>{inBasket ? '已加借阅' : '加入利用'}</span>
                            </button>
                            <button
                              onClick={() => handleViewArchiveDetail(item)}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
                            >
                              <span>案卷浏览</span>
                              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom stats side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CollectionStatsCard />
          <UtilizationStatsCard />
        </div>

      </div>

      {/* FLOATING BASKET SHOPPING CART (Sticker across different tabs) */}
      {basket.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white p-2.5 pr-4 rounded-2xl shadow-2xl flex items-center gap-4 z-40 border border-slate-700 animate-in slide-in-from-bottom-6 transition duration-200">
          <div className="bg-blue-600 rounded-xl w-10 h-10 flex items-center justify-center font-bold shadow-md shadow-blue-600/30 font-mono">
            {basket.length}
          </div>
          <div className="text-xs">
             <div className="font-bold text-left">档案利用暂存清单</div>
             <p className="text-[10px] text-slate-400 font-medium font-sans text-left">已有 {basket.filter(i => i.type === 'FILE').length} 文件, {basket.filter(i => i.type === 'VOLUME').length} 案卷待审</p>
          </div>
          <div className="h-8 w-px bg-slate-600 mx-1"></div>
          <button 
            onClick={handleOpenRegisterForm}
            className="flex items-center bg-white hover:bg-slate-50 text-blue-600 active:scale-95 px-4 py-2.5 rounded-xl text-xs font-bold transition mr-0.5 shadow-sm shrink-0 cursor-pointer gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>去借阅利用登记</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default ArchiveCenter;
