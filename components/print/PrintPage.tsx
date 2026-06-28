import React from 'react';
import { Outlet } from 'react-router-dom';

export const PrintPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default PrintPage;
