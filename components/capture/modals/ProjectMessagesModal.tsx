import React, { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { ProjectMessage, getProjectMessages, markMessageAsRead } from '../../../data/mockProjectMessages';

interface ProjectMessagesModalProps {
  projectId: string;
  projectName: string;
  onClose: () => void;
}

const ITEMS_PER_PAGE = 10;

export const ProjectMessagesModal: React.FC<ProjectMessagesModalProps> = ({
  projectId,
  projectName,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [messages, setMessages] = useState<ProjectMessage[]>(() =>
    getProjectMessages(projectId)
  );

  const totalPages = Math.ceil(messages.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = messages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const unreadCount = messages.filter(m => !m.isRead).length;

  const handleView = (msg: ProjectMessage) => {
    if (!msg.isRead) {
      markMessageAsRead(msg.id);
      setMessages(prev =>
        prev.map(m => (m.id === msg.id ? { ...m, isRead: true } : m))
      );
    }
    alert(`【${msg.title}】\n${msg.content}\n\n时间: ${msg.operationTime}`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <MessageSquare size={16} className="text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">项目流转消息</h3>
            <span className="text-[11px] text-slate-400 truncate max-w-[300px]" title={projectName}>
              {projectName}
            </span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full border border-red-200">
                {unreadCount} 条未读
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition cursor-pointer"
            title="关闭"
          >
            <X size={20} />
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <MessageSquare size={36} className="mb-3 text-slate-300" />
              <p className="text-sm font-semibold">暂无流转消息</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold sticky top-0">
                <tr>
                  <th className="p-4 w-1/4">标题</th>
                  <th className="p-4 w-2/5">内容</th>
                  <th className="p-4 w-20 text-center">是否已读</th>
                  <th className="p-4 w-36">操作时间</th>
                  <th className="p-4 w-20 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems.map((msg, idx) => (
                  <tr
                    key={msg.id}
                    className={`transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                    } hover:bg-blue-50/30`}
                  >
                    <td className="p-4 font-bold text-slate-700">{msg.title}</td>
                    <td className="p-4 text-slate-600">{msg.content}</td>
                    <td className="p-4 text-center">
                      {msg.isRead ? (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-semibold rounded-full border border-slate-200">
                          已读
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                          未读
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-slate-500 text-[11px]">{msg.operationTime}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleView(msg)}
                        className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer text-[11px]"
                      >
                        查看
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer with pagination */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 shrink-0 flex items-center justify-between text-xs text-slate-500">
          <span>
            共 <strong className="text-slate-700">{messages.length}</strong> 条
          </span>
          <div className="flex items-center gap-3">
            <span>
              {ITEMS_PER_PAGE}条/页
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMessagesModal;
