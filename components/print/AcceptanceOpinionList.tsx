import React, { useState, useMemo } from 'react';
import {
  ClipboardCheck,
  Plus,
  Eye,
  Search,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  FileText,
  X,
} from 'lucide-react';
import { AcceptanceOpinionListItem, AcceptanceOpinionFile, SignStatus } from './acceptanceTypes';
import { getOpinionListItems, getOpinionById } from '../../data/mockAcceptanceOpinions';

interface AcceptanceOpinionListProps {
  onCreate: (id: string) => void;
  onView: (id: string) => void;
}

const signStatusLabel: Record<SignStatus, { label: string; color: string }> = {
  unsent: { label: '未签章', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  signed: { label: '已签章', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

type SortField = 'receiptRegistrationNo' | 'id';
type SortDir = 'asc' | 'desc';

export const AcceptanceOpinionList: React.FC<AcceptanceOpinionListProps> = ({ onCreate, onView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyFiles, setHistoryFiles] = useState<AcceptanceOpinionFile[]>([]);
  const [historyProjectName, setHistoryProjectName] = useState('');

  const listItems = useMemo(() => getOpinionListItems(), []);

  const filtered = useMemo(() => {
    let items = listItems;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      items = items.filter(
        i =>
          i.projectName.toLowerCase().includes(q) ||
          i.receiptRegistrationNo?.toLowerCase().includes(q) ||
          i.constructionUnit.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          (i.permitNumber || '').toLowerCase().includes(q) ||
          (i.qualityNumber || '').toLowerCase().includes(q),
      );
    }
    return [...items].sort((a, b) => {
      const aVal = String(a[sortField] || '');
      const bVal = String(b[sortField] || '');
      const cmp = aVal.localeCompare(bVal, 'zh-CN');
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [listItems, searchTerm, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp size={12} className="text-slate-300" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={12} className="text-emerald-600" />
    ) : (
      <ChevronDown size={12} className="text-emerald-600" />
    );
  };

  const handleViewFiles = (item: AcceptanceOpinionListItem) => {
    const opinion = getOpinionById(item.id);
    if (opinion?.fileHistory && opinion.fileHistory.length > 0) {
      const sorted = [...opinion.fileHistory].sort(
        (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      );
      setHistoryFiles(sorted);
      setHistoryProjectName(item.projectName);
      setShowHistoryModal(true);
    }
  };

  const hasFiles = (item: AcceptanceOpinionListItem) => {
    return (item.fileCount || 0) > 0;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Search bar */}
      <div className="px-4 pt-4 shrink-0">
        <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
          <div className="flex-1 flex items-center gap-2">
            <Search size={15} className="text-slate-400" />
            <input
              type="text"
              placeholder="搜索登记号、项目名称、建设单位、项目地点、施工许可证号、质监号..."
              className="flex-1 border-0 outline-none text-xs text-slate-800 bg-transparent placeholder:text-slate-400"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setSearchTerm('')}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> 重置
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100/50 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#fcfdfe] text-slate-500 font-bold">
              <tr>
                <th
                  className="p-4 w-24 cursor-pointer select-none hover:text-emerald-600 transition-colors"
                  onClick={() => toggleSort('receiptRegistrationNo')}
                >
                  <span className="flex items-center gap-1">
                    登记号 <SortIcon field="receiptRegistrationNo" />
                  </span>
                </th>
                <th className="p-4 min-w-[200px]">项目名称</th>
                <th className="p-4 w-36">建设单位</th>
                <th className="p-4 w-40">项目地点</th>
                <th className="p-4 w-40">施工许可证号</th>
                <th className="p-4 w-28">质监号</th>
                <th className="p-4 w-36 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map(item => {
                  const itemHasFiles = hasFiles(item);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group border-t border-slate-100">
                      <td className="p-4 font-mono font-bold text-emerald-700">
                        {item.receiptRegistrationNo || '-'}
                      </td>
                      <td className="p-4 font-bold text-slate-800 max-w-[240px] truncate" title={item.projectName}>
                        {item.projectName}
                      </td>
                      <td className="p-4 text-slate-600 truncate max-w-[160px]" title={item.constructionUnit}>
                        {item.constructionUnit}
                      </td>
                      <td className="p-4 text-slate-600 truncate max-w-[180px]" title={item.location}>
                        {item.location}
                      </td>
                      <td className="p-4 font-mono text-slate-600 truncate max-w-[180px]" title={item.permitNumber}>
                        {item.permitNumber || '-'}
                      </td>
                      <td className="p-4 font-mono text-slate-600">
                        {item.qualityNumber || '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                          <button
                            onClick={() => onCreate(item.id)}
                            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-800 text-[11px] font-bold px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200/60 transition-all cursor-pointer"
                          >
                            <Plus size={12} /> 创建
                          </button>
                          <button
                            onClick={() => handleViewFiles(item)}
                            disabled={!itemHasFiles}
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                              itemHasFiles
                                ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200/60'
                                : 'text-slate-400 bg-slate-50 border-slate-200 cursor-not-allowed opacity-50'
                            }`}
                            title={itemHasFiles ? '查看所有文件' : '暂无文件'}
                          >
                            <Eye size={12} /> 查看
                            {itemHasFiles && (
                              <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-200 text-emerald-800">
                                {item.fileCount}
                              </span>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-semibold">
                    <ClipboardCheck size={32} className="mx-auto mb-2 text-slate-300" />
                    暂无匹配的验收意见书记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer stats */}
      <div className="bg-white p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0 select-none">
        <span>
          共 <strong className="text-slate-800">{filtered.length}</strong> 条记录
          {searchTerm && `（搜索过滤）`}
        </span>
        <span className="flex items-center gap-3">
          {(() => {
            const signed = filtered.filter(i => i.signStatus === 'signed').length;
            const unsent = filtered.filter(i => i.signStatus === 'unsent').length;
            return (
              <>
                <span className="text-emerald-600 font-semibold">已签章 {signed}</span>
                <span className="text-slate-500">未签章 {unsent}</span>
              </>
            );
          })()}
        </span>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0 rounded-t-2xl">
              <div>
                <h3 className="text-sm font-bold text-slate-800">文件列表</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[400px]" title={historyProjectName}>
                  {historyProjectName}
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition cursor-pointer"
                title="关闭"
              >
                <X size={18} />
              </button>
            </div>

            {/* File List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {historyFiles.map((file, index) => {
                const ss = signStatusLabel[file.signStatus];
                const isLatest = index === 0;
                return (
                  <div
                    key={file.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      isLatest
                        ? 'bg-emerald-50/50 border-emerald-200 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isLatest ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-sm text-slate-800">
                          {file.approvalOpinionNo}
                        </span>
                        {isLatest && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded border border-emerald-200">
                            最新
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${ss.color}`}>
                          {ss.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500">
                        <span>创建: {file.createTime}</span>
                        {file.signedAt && <span>签章: {file.signedAt}</span>}
                      </div>
                      {file.remarks && (
                        <p className="text-[11px] text-slate-600 mt-1">
                          备注: {file.remarks}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setShowHistoryModal(false);
                          onView(file.id);
                        }}
                        disabled={file.signStatus !== 'signed'}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          file.signStatus === 'signed'
                            ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200/60'
                            : 'text-slate-400 bg-slate-50 border-slate-200 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <Eye size={12} /> 查看
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 shrink-0 rounded-b-2xl">
              <p className="text-[11px] text-slate-500">
                共 <strong className="text-slate-700">{historyFiles.length}</strong> 份文件，按创建时间倒序排列
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptanceOpinionList;
