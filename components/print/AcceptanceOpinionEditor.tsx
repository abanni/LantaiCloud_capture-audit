import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Save,
  FileSignature,
} from 'lucide-react';
import { AcceptanceOpinion, SignStatus } from './acceptanceTypes';
import { getOpinionById, updateOpinion } from '../../data/mockAcceptanceOpinions';
import { useApp } from '../../context/AppContext';

interface AcceptanceOpinionEditorProps {
  opinionId: string;
  onClose: () => void;
  onSigned: () => void;
}

/** 表单字段行（左侧 label + input，右侧 label + input） */
const FieldRow: React.FC<{
  leftLabel: string;
  leftRequired?: boolean;
  leftValue: string;
  leftPlaceholder?: string;
  leftOnChange: (v: string) => void;
  rightLabel: string;
  rightRequired?: boolean;
  rightValue: string;
  rightPlaceholder?: string;
  rightOnChange: (v: string) => void;
}> = ({
  leftLabel,
  leftRequired,
  leftValue,
  leftPlaceholder,
  leftOnChange,
  rightLabel,
  rightRequired,
  rightValue,
  rightPlaceholder,
  rightOnChange,
}) => (
  <div className="grid grid-cols-2 gap-6">
    <FieldItem
      label={leftLabel}
      required={leftRequired}
      value={leftValue}
      placeholder={leftPlaceholder}
      onChange={leftOnChange}
    />
    <FieldItem
      label={rightLabel}
      required={rightRequired}
      value={rightValue}
      placeholder={rightPlaceholder}
      onChange={rightOnChange}
    />
  </div>
);

const FieldItem: React.FC<{
  label: string;
  required?: boolean;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}> = ({ label, required, value, placeholder, onChange }) => (
  <div>
    <label className="block text-xs font-bold text-slate-700 mb-1.5">
      {required && <span className="text-red-500 mr-0.5">*</span>}
      {label}
    </label>
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400 transition-all"
    />
  </div>
);

const SelectField: React.FC<{
  label: string;
  value: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}> = ({ label, value, placeholder, options, onChange }) => (
  <div>
    <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const TextareaField: React.FC<{
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  rows?: number;
}> = ({ label, value, placeholder, onChange, rows = 3 }) => (
  <div>
    <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400 transition-all resize-none"
    />
  </div>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h4 className="text-xs font-black text-slate-700 border-l-4 border-blue-600 pl-2.5 mb-4 uppercase tracking-wider">
    {title}
  </h4>
);

const Divider: React.FC = () => <hr className="my-6 border-slate-200" />;

export const AcceptanceOpinionEditor: React.FC<AcceptanceOpinionEditorProps> = ({
  opinionId,
  onClose,
  onSigned,
}) => {
  const [opinion, setOpinion] = useState<AcceptanceOpinion | null>(null);
  const [saving, setSaving] = useState(false);
  const [signing, setSigning] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);

  const { state } = useApp();
  const currentUser = state.currentIdentity?.user.name || '审核人员';

  useEffect(() => {
    const data = getOpinionById(opinionId);
    if (data) setOpinion({ ...data });
  }, [opinionId]);

  if (!opinion) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-12 text-center">
          <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-sm text-slate-500">加载中...</p>
        </div>
      </div>
    );
  }

  const updateField = (field: keyof AcceptanceOpinion, value: any) => {
    setOpinion(prev => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = () => {
    setSaving(true);
    // Simulate save delay
    setTimeout(() => {
      if (opinion) {
        updateOpinion(opinion);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
      setSaving(false);
    }, 500);
  };

  const handleSign = () => {
    setSigning(true);
    // Simulate digital signing
    setTimeout(() => {
      if (opinion) {
        const updated: AcceptanceOpinion = {
          ...opinion,
          signStatus: 'signed',
          signedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        };
        updateOpinion(updated);
        setOpinion(updated);
        setSignSuccess(true);
        setTimeout(() => {
          setSignSuccess(false);
          onSigned();
        }, 1500);
      }
      setSigning(false);
    }, 2000);
  };

  const handlePreviewOpinion = () => {
    alert(`【预览】验收意见书：${opinion.approvalOpinionNo}\n项目：${opinion.projectName}\n（实际将打开 PDF 预览）`);
  };

  const handleDownload = () => {
    alert(`正在下载验收意见书：${opinion.approvalOpinionNo}`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Printer size={16} className="text-blue-600" />
              验收意见书
            </h3>
            {opinion.signStatus === 'signed' && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle size={11} /> 已签章
              </span>
            )}
            {opinion.signStatus === 'unsent' && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full border border-slate-200 flex items-center gap-1">
                未签章
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

        {/* Body: Form */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* Section 1: 项目识别信息 */}
          <section>
            <SectionTitle title="项目识别信息" />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <FieldItem
                  label="项目名称"
                  required
                  value={opinion.projectName}
                  onChange={v => updateField('projectName', v)}
                />
                <FieldItem
                  label="验收凭证编号"
                  value={opinion.acceptanceVoucherNo || ''}
                  placeholder="请输入验收凭证编号"
                  onChange={v => updateField('acceptanceVoucherNo', v)}
                />
              </div>
              <FieldRow
                leftLabel="验收意见书编号"
                leftValue={opinion.approvalOpinionNo}
                leftOnChange={v => updateField('approvalOpinionNo', v)}
                rightLabel="工程地点"
                rightValue={opinion.location}
                rightOnChange={v => updateField('location', v)}
              />
              <FieldRow
                leftLabel="建设单位"
                leftValue={opinion.constructionUnit}
                leftOnChange={v => updateField('constructionUnit', v)}
                rightLabel="规划许可证编号"
                rightValue={opinion.planningPermitNumber || ''}
                rightPlaceholder="请输入规划许可证编号"
                rightOnChange={v => updateField('planningPermitNumber', v)}
              />
              <FieldRow
                leftLabel="项目代码"
                leftValue={opinion.projectCode || ''}
                leftPlaceholder="请输入项目代码"
                leftOnChange={v => updateField('projectCode', v)}
                rightLabel="质监编号"
                rightValue={opinion.qualityNumber || ''}
                rightOnChange={v => updateField('qualityNumber', v)}
              />
            </div>
          </section>

          <Divider />

          {/* Section 2: 投资与面积 */}
          <section>
            <SectionTitle title="投资与面积" />
            <div className="space-y-4">
              <FieldRow
                leftLabel="项目总投资（万元）"
                leftValue={opinion.totalCost || ''}
                leftOnChange={v => updateField('totalCost', v)}
                rightLabel="工程建筑面积（㎡）"
                rightValue={opinion.totalArea || ''}
                rightPlaceholder="请输入工程建筑面积"
                rightOnChange={v => updateField('totalArea', v)}
              />
              <div className="grid grid-cols-2 gap-6">
                <SelectField
                  label="开工日期"
                  value={opinion.startDate || ''}
                  placeholder="选择开工日期"
                  options={[
                    { label: '2025-01-01', value: '2025-01-01' },
                    { label: '2025-06-01', value: '2025-06-01' },
                    { label: '2025-08-01', value: '2025-08-01' },
                    { label: '2025-10-01', value: '2025-10-01' },
                    { label: '2026-01-01', value: '2026-01-01' },
                    { label: '2026-03-01', value: '2026-03-01' },
                    { label: '2026-05-01', value: '2026-05-01' },
                  ]}
                  onChange={v => updateField('startDate', v)}
                />
                <SelectField
                  label="竣工日期"
                  value={opinion.endDate || ''}
                  placeholder="选择竣工日期"
                  options={[
                    { label: '2025-12-31', value: '2025-12-31' },
                    { label: '2026-05-01', value: '2026-05-01' },
                    { label: '2026-05-30', value: '2026-05-30' },
                    { label: '2026-06-01', value: '2026-06-01' },
                    { label: '2026-06-15', value: '2026-06-15' },
                    { label: '2026-06-20', value: '2026-06-20' },
                    { label: '2026-12-31', value: '2026-12-31' },
                  ]}
                  onChange={v => updateField('endDate', v)}
                />
              </div>
            </div>
          </section>

          <Divider />

          {/* Section 3: 参建单位 */}
          <section>
            <SectionTitle title="参建单位" />
            <div className="space-y-4">
              <FieldRow
                leftLabel="施工单位"
                leftValue={opinion.constructionCompany}
                leftOnChange={v => updateField('constructionCompany', v)}
                rightLabel="勘察单位"
                rightValue={opinion.surveyUnit}
                rightOnChange={v => updateField('surveyUnit', v)}
              />
              <FieldRow
                leftLabel="设计单位"
                leftValue={opinion.designUnit}
                leftOnChange={v => updateField('designUnit', v)}
                rightLabel="监理单位"
                rightValue={opinion.supervisorUnit}
                rightOnChange={v => updateField('supervisorUnit', v)}
              />
            </div>
          </section>

          <Divider />

          {/* Section 4: 负责人信息 */}
          <section>
            <SectionTitle title="负责人信息" />
            <div className="space-y-4">
              <FieldRow
                leftLabel="建设单位负责人"
                leftValue={opinion.constructionManager || ''}
                leftOnChange={v => updateField('constructionManager', v)}
                rightLabel="建设单位负责人电话"
                rightValue={opinion.constructionManagerPhone || ''}
                rightOnChange={v => updateField('constructionManagerPhone', v)}
              />
              <FieldRow
                leftLabel="档案员姓名"
                leftValue={opinion.archivistName || ''}
                leftOnChange={v => updateField('archivistName', v)}
                rightLabel="档案员电话"
                rightValue={opinion.archivistPhone || ''}
                rightOnChange={v => updateField('archivistPhone', v)}
              />
            </div>
          </section>

          <Divider />

          {/* Section 5: 档案统计 */}
          <section>
            <SectionTitle title="档案统计" />
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <FieldItem label="总卷数" value={String(opinion.totalVolumes)} onChange={v => updateField('totalVolumes', Number(v) || 0)} />
                <FieldItem label="文字卷数" value={String(opinion.textVolumeCount)} onChange={v => updateField('textVolumeCount', Number(v) || 0)} />
                <FieldItem label="图纸卷数" value={String(opinion.drawingVolumeCount)} onChange={v => updateField('drawingVolumeCount', Number(v) || 0)} />
                <FieldItem label="照片张数" value={String(opinion.photoCount)} onChange={v => updateField('photoCount', Number(v) || 0)} />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <FieldItem label="光盘盒数" value={String(opinion.discCount)} onChange={v => updateField('discCount', Number(v) || 0)} />
                <FieldItem label="视频数" value={String(opinion.videoCount)} onChange={v => updateField('videoCount', Number(v) || 0)} />
                <FieldItem
                  label="其他材料数量"
                  value={String(opinion.otherMaterialCount || '')}
                  placeholder="请输入其他材料数量"
                  onChange={v => updateField('otherMaterialCount', Number(v) || 0)}
                />
                <FieldItem label="总页数" value={String(opinion.totalPageCount)} onChange={v => updateField('totalPageCount', Number(v) || 0)} />
              </div>
            </div>
          </section>

          <Divider />

          {/* Section 6: 接收信息 */}
          <section>
            <SectionTitle title="接收信息" />
            <div className="space-y-4">
              <FieldRow
                leftLabel="接收清册份数"
                leftValue={String(opinion.receiptRegisterCopies)}
                leftOnChange={v => updateField('receiptRegisterCopies', Number(v) || 0)}
                rightLabel="接收清册张数"
                rightValue={String(opinion.receiptRegisterPages || '')}
                rightPlaceholder="请输入接收清册张数"
                rightOnChange={v => updateField('receiptRegisterPages', Number(v) || 0)}
              />
              <div className="grid grid-cols-2 gap-6">
                <SelectField
                  label="项目接收人"
                  value={opinion.projectReceiver || ''}
                  placeholder="选择项目接收人"
                  options={[
                    { label: '李娜', value: '李娜' },
                    { label: '岑源', value: '岑源' },
                    { label: '谢林', value: '谢林' },
                    { label: '许志平', value: '许志平' },
                  ]}
                  onChange={v => updateField('projectReceiver', v)}
                />
                <FieldItem
                  label="接收单位名称"
                  value={opinion.receivingUnitName || ''}
                  onChange={v => updateField('receivingUnitName', v)}
                />
              </div>
            </div>
          </section>

          <Divider />

          {/* Section 7: 备注 */}
          <section>
            <SectionTitle title="备注" />
            <div className="grid grid-cols-2 gap-6">
              <TextareaField
                label="备注"
                value={opinion.remarks || ''}
                placeholder="请输入内容"
                onChange={v => updateField('remarks', v)}
                rows={3}
              />
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">创建时间</label>
                <input
                  type="text"
                  value={opinion.createTime}
                  readOnly
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 bg-slate-50 outline-none cursor-default"
                />
                <label className="block text-xs font-bold text-slate-700 mb-1.5 mt-4">修改时间</label>
                <input
                  type="text"
                  value={opinion.modifyTime}
                  readOnly
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 bg-slate-50 outline-none cursor-default"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center justify-between">
            {/* Left: status hints */}
            <div className="flex items-center gap-3">
              {opinion.signStatus === 'signed' && (
                <span className="text-emerald-600 font-semibold flex items-center gap-1 text-xs">
                  <CheckCircle size={13} /> {opinion.signedAt} 已完成电子签章
                </span>
              )}
            </div>

            {/* Right: action buttons */}
            <div className="flex items-center gap-2 text-xs font-bold">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
              >
                <Download size={13} /> 下载
              </button>

              <button
                onClick={handlePreviewOpinion}
                className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition cursor-pointer flex items-center gap-1.5"
              >
                <Eye size={13} /> 预览
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : saveSuccess ? (
                  <CheckCircle size={14} />
                ) : (
                  <Save size={14} />
                )}
                {saving ? '保存中...' : saveSuccess ? '已保存' : '保存'}
              </button>

              {/* 电子签章 — only when unsent */}
              {opinion.signStatus === 'unsent' && (
                <button
                  onClick={handleSign}
                  disabled={signing}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-60"
                >
                  {signing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : signSuccess ? (
                    <CheckCircle size={14} />
                  ) : (
                    <FileSignature size={14} />
                  )}
                  {signing ? '签章中...' : signSuccess ? '签章成功' : '电子签章'}
                </button>
              )}

              {/* 查看 — only when signed */}
              {opinion.signStatus === 'signed' && (
                <button
                  onClick={() => alert(`正在打开已签章文件：${opinion.approvalOpinionNo}`)}
                  className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Eye size={13} /> 查看
                </button>
              )}

              <button
                onClick={onClose}
                className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition cursor-pointer"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptanceOpinionEditor;
