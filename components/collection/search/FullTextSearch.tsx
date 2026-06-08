import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import SearchBar from './SearchBar';

interface FullTextSearchProps {
  fullTextKey: string;
  onFullTextChange: (value: string) => void;
  onClear: () => void;
}

const FullTextSearch: React.FC<FullTextSearchProps> = ({
  fullTextKey,
  onFullTextChange,
  onClear,
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      {/* Header Title */}
      <div className="flex items-center justify-between border-b pb-3 border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800">
            全文穿透输入检索
          </span>
        </div>
      </div>

      {/* Search Input */}
      <SearchBar
        mode="FULL_TEXT"
        fullTextKey={fullTextKey}
        onFullTextChange={onFullTextChange}
        onClear={onClear}
      />
    </div>
  );
};

export default FullTextSearch;
