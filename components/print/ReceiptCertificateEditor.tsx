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
  Send,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { ReceiptCertificate, ReceiptSignStatus } from './receiptTypes';
import { getReceiptById, updateReceipt } from '../../data/mockReceiptCertificates';

interface ReceiptCertificateEditorProps {
  receiptId: string;
  onClose: () => void;
  onSaved?: () => void;
  onSentToSign?: () => void;
}

/** 通用输入字段 */
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
      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none placeholder:text-slate-400 transition-all"
    />
  </div>
);

const FieldRow: React.FC<{
  leftLabel: string;
  leftValue: string;
  leftOnChange: (v: string) => void;
  leftPlaceholder?: string;
  rightLabel: string;
  rightValue: string;
  rightOnChange: (v: string) => void;
  rightPlaceholder?: string;
}> = ({ leftLabel, leftValue, leftOnChange, leftPlaceholder, rightLabel, rightValue, rightOnChange, rightPlaceholder }) => (
  <div className="grid grid-cols-2 gap-6">
    <FieldItem label={leftLabel} value={leftValue} placeholder={leftPlaceholder} onChange={leftOnChange} />
    <FieldItem label={rightLabel} value={rightValue} placeholder={rightPlaceholder} onChange={rightOnChange} />
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
      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
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
      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none placeholder:text-slate-400 transition-all resize-none"
    />
  </div>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h4 className="text-xs font-black text-slate-700 border-l-4 border-emerald-600 pl-2.5 mb-4 uppercase tracking-wider">{title}</h4>
);

const Divider: React.FC = () => <hr className="my-6 border-slate-200" />;

export const ReceiptCertificateEditor: React.FC<ReceiptCertificateEditorProps> = ({
  receiptId,
  onClose,
  onSaved,
  onSentToSign,
}) => {
  const [receipt, setReceipt] = useState<ReceiptCertificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const data = getReceiptById(receiptId);
    if (data) setReceipt({ ...data });
    setLoading(false);
  }, [receiptId]);

  const updateField = (field: keyof ReceiptCertificate, value: any) => {
    setReceipt(prev => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!receipt) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    updateReceipt(receipt);
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    onSaved?.();
  };

  const handleSendToSign = async () => {
    if (!receipt) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    const updated: ReceiptCertificate = {
      ...receipt,
      signStatus: 'signing',
      modifyTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    updateReceipt(updated);
    setReceipt(updated);
    setSending(false);
    onSentToSign?.();
  };

  const handleArchiveSign = async () => {
    if (!receipt) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const updated: ReceiptCertificate = {
      ...receipt,
      signStatus: 'signed',
      signedAt: now,
      modifyTime: now,
    };
    updateReceipt(updated);
    setReceipt(updated);
    alert('档案馆签章完成！');
  };

  const handleView = () => {
    if (!receipt) return;
    const statusText = receipt.signStatus === 'signing'
      ? '已发起签章，等待建设单位签署'
      : receipt.signStatus === 'construction_unit_signed'
        ? '建设单位已签署，等待档案馆签署'
        : '全部签署完成';
    alert(`正在查看接收凭证：${receipt.receiptNo}\n签章状态：${statusText}\n（实际将打开对应状态的 PDF 文件）`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-12 text-center">
          <Loader2 size={32} className="animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-sm text-slate-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
          <AlertCircle size={24} className="text-red-500 mx-auto mb-2" />
          <p className="text-xs text-slate-700 mb-4">未找到接收凭证数据</p>
          <button onClick={onClose} className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-200">关闭</button>
        </div>
      </div>
    );
  }

  const isUnsent = receipt.signStatus === 'unsent';

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
              <Printer size={16} className="text-emerald-600" />
              接收凭证
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition cursor-pointer" title="关闭">
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
                <FieldItem label="项目名称" required value={receipt.projectName} onChange={v => updateField('projectName', v)} />
                <FieldItem label="接收凭证编号" value={receipt.receiptNo} onChange={v => updateField('receiptNo', v)} />
              </div>
              <FieldRow
                leftLabel="接收登记号" leftValue={receipt.receiptRegistrationNo || ''} leftOnChange={v => updateField('receiptRegistrationNo', v)}
                rightLabel="工程地点" rightValue={receipt.location} rightOnChange={v => updateField('location', v)}
              />
              <FieldRow
                leftLabel="建设单位" leftValue={receipt.constructionUnit} leftOnChange={v => updateField('constructionUnit', v)}
                rightLabel="施工许可证号" rightValue={receipt.permitNumber || ''} rightPlaceholder="请输入施工许可证号" rightOnChange={v => updateField('permitNumber', v)}
              />
              <FieldRow
                leftLabel="项目代码" leftValue={receipt.projectCode || ''} leftPlaceholder="请输入项目代码" leftOnChange={v => updateField('projectCode', v)}
                rightLabel="质监编号" rightValue={receipt.qualityNumber || ''} rightOnChange={v => updateField('qualityNumber', v)}
              />
            </div>
          </section>

          <Divider />

          {/* Section 2: 投资与面积 */}
          <section>
            <SectionTitle title="投资与面积" />
            <div className="space-y-4">
              <FieldRow
                leftLabel="项目总投资（万元）" leftValue={receipt.totalCost || ''} leftOnChange={v => updateField('totalCost', v)}
                rightLabel="工程建筑面积（㎡）" rightValue={receipt.totalArea || ''} rightPlaceholder="请输入工程建筑面积" rightOnChange={v => updateField('totalArea', v)}
              />
              <div className="grid grid-cols-2 gap-6">
                <SelectField label="开工日期" value={receipt.startDate || ''} placeholder="选择开工日期"
                  options={[
                    { label: '2025-01-01', value: '2025-01-01' }, { label: '2025-06-01', value: '2025-06-01' },
                    { label: '2025-08-01', value: '2025-08-01' }, { label: '2025-10-01', value: '2025-10-01' },
                    { label: '2026-01-01', value: '2026-01-01' }, { label: '2026-03-01', value: '2026-03-01' },
                    { label: '2026-05-01', value: '2026-05-01' },
                  ]}
                  onChange={v => updateField('startDate', v)}
                />
                <SelectField label="竣工日期" value={receipt.endDate || ''} placeholder="选择竣工日期"
                  options={[
                    { label: '2025-12-31', value: '2025-12-31' }, { label: '2026-05-01', value: '2026-05-01' },
                    { label: '2026-05-30', value: '2026-05-30' }, { label: '2026-06-01', value: '2026-06-01' },
                    { label: '2026-06-15', value: '2026-06-15' }, { label: '2026-06-20', value: '2026-06-20' },
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
              <FieldRow leftLabel="施工单位" leftValue={receipt.constructionCompany} leftOnChange={v => updateField('constructionCompany', v)}
                rightLabel="勘察单位" rightValue={receipt.surveyUnit} rightOnChange={v => updateField('surveyUnit', v)} />
              <FieldRow leftLabel="设计单位" leftValue={receipt.designUnit} leftOnChange={v => updateField('designUnit', v)}
                rightLabel="监理单位" rightValue={receipt.supervisorUnit} rightOnChange={v => updateField('supervisorUnit', v)} />
            </div>
          </section>

          <Divider />

          {/* Section 4: 负责人信息 */}
          <section>
            <SectionTitle title="负责人信息" />
            <div className="space-y-4">
              <FieldRow
                leftLabel="建设单位负责人" leftValue={receipt.constructionManager || ''} leftOnChange={v => updateField('constructionManager', v)}
                rightLabel="负责人电话" rightValue={receipt.constructionManagerPhone || ''} rightOnChange={v => updateField('constructionManagerPhone', v)}
              />
              <FieldRow
                leftLabel="档案员姓名" leftValue={receipt.archivistName || ''} leftOnChange={v => updateField('archivistName', v)}
                rightLabel="档案员电话" rightValue={receipt.archivistPhone || ''} rightOnChange={v => updateField('archivistPhone', v)}
              />
            </div>
          </section>

          <Divider />

          {/* Section 5: 档案统计 */}
          <section>
            <SectionTitle title="档案统计" />
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <FieldItem label="总卷数" value={String(receipt.totalVolumes)} onChange={v => updateField('totalVolumes', Number(v) || 0)} />
                <FieldItem label="文字卷数" value={String(receipt.textVolumeCount)} onChange={v => updateField('textVolumeCount', Number(v) || 0)} />
                <FieldItem label="图纸卷数" value={String(receipt.drawingVolumeCount)} onChange={v => updateField('drawingVolumeCount', Number(v) || 0)} />
                <FieldItem label="照片张数" value={String(receipt.photoCount)} onChange={v => updateField('photoCount', Number(v) || 0)} />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <FieldItem label="光盘盒数" value={String(receipt.discCount)} onChange={v => updateField('discCount', Number(v) || 0)} />
                <FieldItem label="视频数" value={String(receipt.videoCount)} onChange={v => updateField('videoCount', Number(v) || 0)} />
                <FieldItem label="总页数" value={String(receipt.totalPageCount)} onChange={v => updateField('totalPageCount', Number(v) || 0)} />
              </div>
            </div>
          </section>

          <Divider />

          {/* Section 6: 接收信息 */}
          <section>
            <SectionTitle title="接收信息" />
            <div className="space-y-4">
              <SelectField label="项目接收人" value={receipt.projectReceiver || ''} placeholder="选择项目接收人"
                options={[
                  { label: '李娜', value: '李娜' }, { label: '岑源', value: '岑源' },
                  { label: '谢林', value: '谢林' }, { label: '许志平', value: '许志平' },
                ]}
                onChange={v => updateField('projectReceiver', v)}
              />
              <FieldItem label="接收单位名称" value={receipt.receivingUnitName || ''} onChange={v => updateField('receivingUnitName', v)} />
            </div>
          </section>

          <Divider />

          {/* Section 7: 备注 */}
          <section>
            <SectionTitle title="备注" />
            <div className="grid grid-cols-2 gap-6">
              <TextareaField label="备注" value={receipt.remarks || ''} placeholder="请输入内容" onChange={v => updateField('remarks', v)} rows={3} />
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">创建时间</label>
                <input type="text" value={receipt.createTime} readOnly
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 bg-slate-50 outline-none cursor-default" />
                <label className="block text-xs font-bold text-slate-700 mb-1.5 mt-4">修改时间</label>
                <input type="text" value={receipt.modifyTime} readOnly
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 bg-slate-50 outline-none cursor-default" />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center justify-end gap-2 text-xs font-bold">
            {/* 下载 */}
            <button onClick={() => alert(`正在下载接收凭证 Excel：${receipt.receiptNo}.xlsx`)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5">
              <FileSpreadsheet size={13} /> 下载
            </button>

            {/* 预览 */}
            <button onClick={() => alert(`正在预览接收凭证 PDF：${receipt.receiptNo}\n（实际将打开 PDF 预览页）`)}
              className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition cursor-pointer flex items-center gap-1.5">
              <FileText size={13} /> 预览接收凭证
            </button>

            {/* 保存 */}
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60">
              {saving ? <Loader2 size={14} className="animate-spin" /> : saveSuccess ? <CheckCircle size={14} /> : <Save size={14} />}
              {saving ? '保存中...' : saveSuccess ? '已保存' : '保存'}
            </button>

            {/* 发起签章 - 仅待发送状态可用，发起后不可再点击 */}
            <button onClick={handleSendToSign} disabled={!isUnsent || sending}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              title="发送至建设单位签章">
              {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {sending ? '发送中...' : '发起签章'}
            </button>

            {/* 电子签章 - 仅建设单位已签章后可用 */}
            <button onClick={handleArchiveSign} disabled={receipt.signStatus !== 'construction_unit_signed'}
              className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
              <FileSignature size={14} /> 电子签章
            </button>

            {/* 查看 - 发起签章后可查看，根据状态显示不同提示 */}
            <button onClick={handleView} disabled={receipt.signStatus === 'unsent'}
              className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed">
              <Eye size={13} /> 查看
            </button>

            {/* 取消 */}
            <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition cursor-pointer">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptCertificateEditor;
