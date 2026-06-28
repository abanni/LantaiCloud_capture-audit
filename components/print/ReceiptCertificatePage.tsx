import React, { useState } from 'react';
import { ReceiptCertificateList } from './ReceiptCertificateList';
import { ReceiptCertificateEditor } from './ReceiptCertificateEditor';

export const ReceiptCertificatePage: React.FC = () => {
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const handleCreate = (id: string) => setEditId(id);
  const handleView = (id: string) => {
    alert(`正在打开已签署的接收凭证文件...\n项目档案编号: ${id}\n（实际将跳转到文件预览页）`);
  };
  const handleSign = (id: string) => {
    setEditId(id);
  };

  return (
    <>
      <ReceiptCertificateList 
        onCreate={handleCreate} 
        onView={handleView}
        onSign={handleSign}
      />

      {editId && (
        <ReceiptCertificateEditor
          receiptId={editId}
          onClose={() => setEditId(null)}
          onSaved={() => {
            // Stay open after save
          }}
          onSentToSign={() => {
            setTimeout(() => setEditId(null), 500);
          }}
        />
      )}
    </>
  );
};

export default ReceiptCertificatePage;
