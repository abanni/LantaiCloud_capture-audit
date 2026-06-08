import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  mode: 'FULL_TEXT' | 'COMPREHENSIVE';
  fullTextKey: string;
  onFullTextChange: (value: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ mode, fullTextKey, onFullTextChange, onClear }) => {
  if (mode !== 'FULL_TEXT') return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder="输入关键字搜索（如：钢结构、人防掩蔽、项目地点等）..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
          value={fullTextKey}
          onChange={(e) => onFullTextChange(e.target.value)}
        />
      </div>
      {fullTextKey && (
        <button 
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 border border-transparent rounded-lg px-2.5 py-2.5 flex items-center font-bold"
        >
          清空
        </button>
      )}
    </div>
  );
};

export default SearchBar;
