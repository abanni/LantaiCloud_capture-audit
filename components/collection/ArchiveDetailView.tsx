import React, { useState } from 'react';
import { 
  FileText, 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  Download, 
  Edit3, 
  ArrowLeft,
  Printer,
  ZoomIn,
  ZoomOut,
  MoreHorizontal,
  Briefcase,
  Trash2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { SelectionItem } from '../../types';

interface TreeNode {
  id: string;
  label: string;
  type: 'project' | 'unit' | 'volume' | 'file';
  children?: TreeNode[];
  isOpen?: boolean;
}

const MOCK_TREE_DATA: TreeNode[] = [
  {
    id: 'p1',
    label: '苏州吉丰新材料有限公司 生产车间',
    type: 'project',
    isOpen: true,
    children: [
      {
        id: 'u1',
        label: '生产车间',
        type: 'unit',
        isOpen: true,
        children: [
          {
            id: 'v1',
            label: '苏州吉丰新材料有限公司 生产车间 工程准备阶段',
            type: 'volume',
            children: [
              { id: 'f1', label: '工程准备阶段文件清单', type: 'file' },
              { id: 'f2', label: '立项申请书', type: 'file' }
            ]
          },
          {
            id: 'v2',
            label: '苏州吉丰新材料有限公司 生产车间 监理文件',
            type: 'volume',
            isOpen: true,
            children: [
              { id: 'f3', label: '总监理工程师任命书及证书', type: 'file' },
              { id: 'f4', label: '监理规划', type: 'file' },
              { id: 'f5', label: '监理实施细则', type: 'file' }
            ]
          },
          {
            id: 'v3',
            label: '苏州吉丰新材料有限公司 生产车间 竣工验收文件',
            type: 'volume',
            children: []
          }
        ]
      }
    ]
  }
];

interface ArchiveDetailViewProps {
  onBack: () => void;
  initialData?: any;
  basket: SelectionItem[];
  setBasket: React.Dispatch<React.SetStateAction<SelectionItem[]>>;
  onRegister: () => void;
}

const ArchiveDetailView: React.FC<ArchiveDetailViewProps> = ({ 
  onBack, 
  initialData, 
  basket, 
  setBasket,
  onRegister
}) => {
  const [activeTab, setActiveTab] = useState<'metadata' | 'file'>('metadata');
  const [treeData, setTreeData] = useState(MOCK_TREE_DATA);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [showUtilizationDropdown, setShowUtilizationDropdown] = useState(false);

  const handleAddToUtilization = () => {
    if (!selectedNode) return;
    
    // Only allow files and volumes to be added
    if (selectedNode.type !== 'file' && selectedNode.type !== 'volume') return;

    // Check if already added
    if (basket.some(item => item.id === selectedNode.id)) return;

    const newItem: SelectionItem = {
      id: selectedNode.id,
      title: selectedNode.label,
      type: selectedNode.type === 'file' ? 'FILE' : 'VOLUME',
      code: initialData?.archiveCode || 'A.0.1-2024-001' // Fallback code
    };
    
    setBasket(prev => [...prev, newItem]);
  };

  const removeFromUtilization = (id: string) => {
    setBasket(prev => prev.filter(item => item.id !== id));
  };

  const clearUtilization = () => {
    setBasket([]);
    setShowUtilizationDropdown(false);
  };

  const fileCount = basket.filter(item => item.type === 'FILE').length;
  const volumeCount = basket.filter(item => item.type === 'VOLUME').length;

  const toggleNode = (id: string) => {
    const updateNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };
    setTreeData(updateNodes(treeData));
  };

  const renderTree = (nodes: TreeNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id} className="select-none">
        <div 
          className={`flex items-center py-1 px-2 hover:bg-blue-50 cursor-pointer rounded transition-colors ${selectedNode?.id === node.id ? 'bg-blue-100 text-blue-700' : 'text-slate-600'} pl-[${(level * 16 + 8).toString()}px]`}
          onClick={() => {
            setSelectedNode(node);
            if (node.type === 'file') setActiveTab('file');
          }}
        >
          {node.children && node.children.length > 0 ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="mr-1 p-0.5 hover:bg-slate-200 rounded"
            >
              {node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-5" />
          )}
          {node.type === 'file' ? (
            <FileText size={14} className="mr-2 text-blue-500" />
          ) : (
            <Folder size={14} className="mr-2 text-amber-500" />
          )}
          <span className="text-xs truncate">{node.label}</span>
        </div>
        {node.isOpen && node.children && (
          <div>{renderTree(node.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  const metadataFields = [
    { label: '工程编号', value: '3205810202404811221' },
    { label: '档案项目名称', value: initialData?.projectName || initialData?.title || initialData?.unitName || '苏州吉丰新材料有限公司 生产车间' },
    { label: '生产车间', value: '生产车间' },
    { label: '编制单位', value: initialData?.constructionUnit || '苏州华扬建设咨询有限公司' },
    { label: '质量安全监督单位', value: '苏州华扬建设咨询有限公司' },
    { label: '规划许可证号', value: '建字第32058120240001号' },
    { label: '施工许可证号', value: '320581202404010101' },
    { label: '建筑面积(m²)', value: '12500.50' },
    { label: '高度', value: '24.5m' },
    { label: '地下层数', value: '1' },
    { label: '地上层数', value: '3' },
    { label: '结构类型', value: '钢筋混凝土' },
    { label: '栋数', value: '1' },
    { label: '开工时间', value: '2024-04-01' },
    { label: '竣工时间', value: '2025-12-31' },
    { label: '工程造价', value: '5800.00万元' },
    { label: '工程结算', value: '进行中' },
    { label: '总卷数', value: '14' },
    { label: '文字卷', value: '8' },
    { label: '图纸卷', value: '6' },
    { label: '图纸张', value: '120' },
    { label: '底图张', value: '0' },
    { label: '照片张', value: '45' },
    { label: '底片张', value: '0' },
    { label: '录音带盒', value: '0' },
    { label: '录像带盒', value: '0' },
    { label: '光盘张', value: '2' },
    { label: '磁带盒', value: '0' },
    { label: '磁盘张', value: '0' },
    { label: '缩微片盘', value: '0' },
    { label: '缩微片张', value: '0' },
    { label: '保管期限', value: '永久' },
    { label: '入库日期', value: initialData?.formationDate || '2026-01-15' },
    { label: '移交单位', value: '苏州吉丰新材料有限公司' },
    { label: '档号', value: initialData?.archiveCode || 'A.0.1-2024-001' },
    { label: '存放位置起始号', value: '01-02-03' },
    { label: '密级', value: initialData?.securityLevel || '公开' },
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="h-12 border-b border-slate-200 flex items-center px-4 justify-between bg-slate-50">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            title="返回"
            className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-600 cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-bold text-slate-800 text-sm">档案详情查看: {initialData?.projectName || initialData?.title || '苏州吉丰新材料有限公司 生产车间'}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleAddToUtilization}
            disabled={!selectedNode || (selectedNode.type !== 'file' && selectedNode.type !== 'volume')}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-colors shadow-sm h-[30px] cursor-pointer ${
              !selectedNode || (selectedNode.type !== 'file' && selectedNode.type !== 'volume')
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
            }`}
          >
            <Download size={14} />
            <span>添加到利用</span>
          </button>

          {basket.length > 0 && (
            <div className="relative">
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => setShowUtilizationDropdown(!showUtilizationDropdown)}
                  className="flex items-center space-x-2 px-3 py-1 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 transition-colors shadow-sm cursor-pointer"
                >
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] opacity-90 font-medium">{fileCount} 文件, {volumeCount} 案卷</span>
                    <span className="text-xs font-bold">档案待利用清单</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform ${showUtilizationDropdown ? 'rotate-180' : ''}`} />
                </button>
                <button 
                  onClick={onRegister}
                  className="flex items-center space-x-1 px-3 py-1 bg-primary text-white rounded text-xs hover:bg-indigo-700 transition-colors shadow-sm h-[30px] cursor-pointer font-bold"
                >
                  <Briefcase size={14} />
                  <span>去利用登记</span>
                </button>
              </div>

              {/* Utilization Dropdown */}
              <AnimatePresence>
                {showUtilizationDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <span className="text-xs font-bold text-slate-700">待利用列表 ({basket.length})</span>
                      <button 
                        onClick={clearUtilization}
                        className="text-[10px] text-red-500 hover:text-red-600 flex items-center space-x-1 px-2 py-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>清空列表</span>
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {basket.map((item) => (
                        <div key={item.id} className="p-2 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 group">
                          <div className="flex items-center space-x-2 overflow-hidden">
                            {item.type === 'FILE' ? <FileText size={12} className="text-blue-500 flex-shrink-0" /> : <Folder size={12} className="text-amber-500 flex-shrink-0" />}
                            <span className="text-xs text-slate-600 truncate">{item.title}</span>
                          </div>
                          <button 
                            onClick={() => removeFromUtilization(item.id)}
                            title="移除"
                            className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors h-[30px] cursor-pointer">
            <Printer size={14} />
            <span>打印</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-2 border-b border-slate-200 bg-slate-100/50">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-3 h-3 rounded text-blue-600" defaultChecked />
              <span className="text-xs text-slate-600 font-medium">过滤空文件夹</span>
            </label>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {renderTree(treeData)}
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Tabs */}
          <div className="h-12 border-b border-slate-200 flex items-center px-4 space-x-1 bg-slate-50">
            <button 
              onClick={() => setActiveTab('metadata')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${activeTab === 'metadata' ? 'bg-white border-x border-t border-slate-200 text-blue-600 -mb-[1px]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              元数据
            </button>
            <button 
              onClick={() => setActiveTab('file')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${activeTab === 'file' ? 'bg-white border-x border-t border-slate-200 text-blue-600 -mb-[1px]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              文件
            </button>
            <div className="flex-1" />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden p-6 space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'metadata' ? (
                <motion.div 
                  key="metadata"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full overflow-y-auto"
                >
                  <div className="grid grid-cols-3 border-l border-t border-slate-200">
                    {metadataFields.map((field, idx) => (
                      <React.Fragment key={idx}>
                        <div className="bg-slate-50 p-3 border-r border-b border-slate-200 text-xs font-bold text-slate-600 flex items-center">
                          {field.label}
                        </div>
                        <div className="p-3 border-r border-b border-slate-200 text-xs text-slate-800 col-span-2 md:col-span-1">
                          {field.value}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="file"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="h-full flex flex-col bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-inner"
                >
                  {/* PDF Toolbar */}
                  <div className="h-10 bg-slate-700 text-white flex items-center px-4 justify-between shrink-0">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-slate-600 rounded cursor-pointer" title="上一页"><ChevronRight size={16} className="rotate-180" /></button>
                        <input type="text" className="w-8 h-6 bg-slate-800 border border-slate-600 rounded text-center text-xs" defaultValue="1" title="当前页码" placeholder="1" />
                        <span className="text-xs text-slate-400">/ 3</span>
                        <button className="p-1 hover:bg-slate-600 rounded cursor-pointer" title="下一页"><ChevronRight size={16} /></button>
                      </div>
                      <div className="h-4 w-[1px] bg-slate-600" />
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-slate-600 rounded cursor-pointer" title="缩小"><ZoomOut size={16} /></button>
                        <button className="p-1 hover:bg-slate-600 rounded cursor-pointer" title="放大"><ZoomIn size={16} /></button>
                        <select className="bg-slate-800 border border-slate-600 rounded text-xs px-1 h-6" title="缩放比例">
                          <option>自动缩放</option>
                          <option>50%</option>
                          <option>100%</option>
                          <option>200%</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="p-1 hover:bg-slate-600 rounded cursor-pointer" title="编辑"><Edit3 size={16} /></button>
                      <button className="p-1 hover:bg-slate-600 rounded cursor-pointer" title="打印"><Printer size={16} /></button>
                      <button className="p-1 hover:bg-slate-600 rounded cursor-pointer" title="下载"><Download size={16} /></button>
                      <button className="p-1 hover:bg-slate-600 rounded cursor-pointer" title="更多"><MoreHorizontal size={16} /></button>
                    </div>
                  </div>
                  
                  {/* PDF Content Area */}
                  <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-500">
                    <div className="bg-white shadow-2xl w-[800px] min-h-[1100px] p-16 relative">
                      <div className="absolute top-8 right-8 text-slate-400 font-mono text-sm">A.0.1</div>
                      <h1 className="text-3xl font-bold text-center mt-20 mb-12">总监理工程师任命书</h1>
                      <div className="space-y-6 text-lg leading-relaxed">
                        <p>工程名称：<span className="border-b border-slate-400 px-4">生产车间监理</span></p>
                        <p className="text-right">编号：A.0.1-____</p>
                        
                        <div className="border border-slate-800 p-8 mt-12">
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <p className="mb-4">建设单位签收人</p>
                              <p className="mb-2">姓名及时间</p>
                              <div className="h-12 border-b border-slate-200 italic font-serif text-2xl">王梓骏</div>
                            </div>
                            <div className="flex items-end justify-end">
                              <div className="w-32 h-32 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 font-bold border-dashed opacity-50 rotate-12">
                                建设单位公章
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-12">
                          <p>致：<span className="border-b border-slate-400 px-4">苏州吉丰新材料有限公司</span>（建设单位）</p>
                          <p className="mt-6 indent-8">
                            兹任命 <span className="border-b border-slate-400 px-4">李震宇</span> 为我单位 <span className="border-b border-slate-400 px-4">生产车间监理</span> 项目总监理工程师，负责履行《建设工程监理合同》，主持项目监理机构工作。
                          </p>
                        </div>

                        <div className="mt-20 flex justify-between items-end">
                          <div className="space-y-4">
                            <p>总监理工程师执业印章和项目监理机构用章的样章为：</p>
                            <div className="flex space-x-8">
                              <div className="w-24 h-12 border border-slate-300" />
                              <div className="w-24 h-24 border border-slate-300 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveDetailView;
