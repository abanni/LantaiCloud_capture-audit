import React, { useState } from 'react';
import { AcceptanceOpinionList } from './AcceptanceOpinionList';
import { AcceptanceOpinionEditor } from './AcceptanceOpinionEditor';

export const AcceptanceOpinionPage: React.FC = () => {
  const [createId, setCreateId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const handleCreate = (id: string) => setCreateId(id);
  const handleView = (id: string) => {
    alert(`正在打开已签章的验收意见书文件...\n项目档案编号: ${id}\n（实际将跳转到文件预览页）`);
  };

  return (
    <>
      <AcceptanceOpinionList onCreate={handleCreate} onView={handleView} />

      {createId && (
        <AcceptanceOpinionEditor
          opinionId={createId}
          onClose={() => setCreateId(null)}
          onSigned={() => {
            setTimeout(() => setCreateId(null), 500);
          }}
        />
      )}
    </>
  );
};

export default AcceptanceOpinionPage;
