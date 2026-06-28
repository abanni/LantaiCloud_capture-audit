import React from 'react';
import { X, Info, Download, Eye, FileText } from 'lucide-react';
import { Project } from '../../types';
import { getOpinionById } from '../../../data/mockAcceptanceOpinions';
import { getReceiptById } from '../../../data/mockReceiptCertificates';

interface ProjectInfoModalProps {
  project: Project;
  onClose: () => void;
}

const FieldItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
    <div className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 bg-slate-50 min-h-[36px] flex items-center">
      {value || '-'}
    </div>
  </div>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h4 className="text-xs font-black text-slate-700 border-l-4 border-emerald-600 pl-2.5 mb-4 uppercase tracking-wider">{title}</h4>
);

const Divider: React.FC = () => <hr className="my-6 border-slate-200" />;

const DocCard: React.FC<{
  label: string;
  signed: boolean;
  signedAt?: string;
  onView: () => void;
  onDownload: () => void;
}> = ({ label, signed, signedAt, onView, onDownload }) => (
  <div className={`rounded-xl border p-4 ${signed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${signed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
          <FileText size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">{label}</h4>
          {signed && signedAt ? (
            <p className="text-[11px] text-emerald-600 font-medium">已签章 · {signedAt}</p>
          ) : (
            <p className="text-[11px] text-slate-400">尚未完成签章</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {signed ? (
          <>
            <button onClick={onView} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-50 transition cursor-pointer flex items-center gap-1">
              <Eye size={13} /> 查看
            </button>
            <button onClick={onDownload} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition cursor-pointer flex items-center gap-1">
              <Download size={13} /> 下载
            </button>
          </>
        ) : (
          <span className="text-[10px] text-slate-400 italic">待签章</span>
        )}
      </div>
    </div>
  </div>
);

export const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ project, onClose }) => {
  const opinion = getOpinionById(project.id);
  const receipt = getReceiptById(project.id);
  const opinionSigned = opinion?.signStatus === 'signed';
  const receiptSigned = receipt?.signStatus === 'signed';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <Info size={16} className="text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">项目信息</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition cursor-pointer" title="关闭">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* Section 1: 项目识别信息 */}
          <section>
            <SectionTitle title="项目识别信息" />
            <div className="space-y-4">
              <FieldItem label="项目名称" value={project.name} />
              <div className="grid grid-cols-2 gap-6">
                <FieldItem label="施工许可证号" value={project.licenceNo || ''} />
                <FieldItem label="质监号" value={project.qualityNumber || ''} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <FieldItem label="项目地点" value={project.location || ''} />
                <FieldItem label="建设单位" value={project.constructionUnit || ''} />
              </div>
            </div>
          </section>

          <Divider />

          {/* Section 2: 参建单位 */}
          <section>
            <SectionTitle title="参建单位" />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <FieldItem label="施工单位" value={''} />
                <FieldItem label="勘察单位" value={''} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <FieldItem label="设计单位" value={''} />
                <FieldItem label="监理单位" value={''} />
              </div>
            </div>
          </section>

          <Divider />

          {/* Section 3: 审核信息 */}
          <section>
            <SectionTitle title="审核信息" />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <FieldItem label="审核人" value={project.assignedReviewer || ''} />
                <FieldItem label="报送承诺书" value={project.isCommitmentSigned ? '已签署' : '未签署'} />
              </div>
            </div>
          </section>

          <Divider />

          {/* Section 4: 档案统计 */}
          <section>
            <SectionTitle title="档案统计" />
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <FieldItem label="总卷数" value={String(project.units?.length || 0)} />
                <FieldItem label="文字卷" value={''} />
                <FieldItem label="图纸卷" value={''} />
                <FieldItem label="总页数" value={''} />
              </div>
            </div>
          </section>

          <Divider />

          {/* Section 5: 签章文件 */}
          <section>
            <SectionTitle title="签章文件" />
            <div className="space-y-3">
              <DocCard
                label="验收意见书"
                signed={opinionSigned}
                signedAt={opinion?.signedAt}
                onView={() => alert(`查看验收意见书：${opinion?.approvalOpinionNo}`)}
                onDownload={() => alert(`下载验收意见书：${opinion?.approvalOpinionNo}`)}
              />
              <DocCard
                label="接收凭证"
                signed={receiptSigned}
                signedAt={receipt?.signedAt}
                onView={() => alert(`查看接收凭证：${receipt?.receiptNo}`)}
                onDownload={() => alert(`下载接收凭证：${receipt?.receiptNo}`)}
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition cursor-pointer">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoModal;
