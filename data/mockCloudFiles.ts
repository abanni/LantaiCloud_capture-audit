import { FileItem } from '../types';

export const INITIAL_CLOUD_FILES: FileItem[] = [
    { id: '1', name: '2024年施工日志', type: 'folder', date: '2024-03-01' },
    { id: '2', name: '变更签证单据', type: 'folder', date: '2024-02-15' },
    { id: '3', name: '施工组织设计方案_V2.docx', type: 'word', size: '12MB', date: '刚刚', collaborators: ['JD', 'AL'] },
    { id: '4', name: '材料进场台账.xlsx', type: 'excel', size: '24KB', date: '10分钟前', collaborators: ['JD'] },
    { id: '5', name: '地下二层结构平面图.dwg', type: 'cad', size: '156MB', date: '昨天' },
    { id: '6', name: '施工许可证扫描件.pdf', type: 'pdf', size: '2.4MB', date: '3天前', isDoubleLayer: true },
    { id: '7', name: '电子发票_001.ofd', type: 'ofd', size: '512KB', date: '1周前', isDoubleLayer: false },
    { id: '8', name: '竣工验收报告_扫描版.pdf', type: 'pdf', size: '45MB', date: '2周前', isDoubleLayer: false },
    { id: '9', name: '地基验槽记录.pdf', type: 'pdf', size: '1.8MB', date: '3周前', isDoubleLayer: true },
    { id: '10', name: '质量监督申报表(1).pdf', type: 'pdf', size: '1.2MB', date: '3周前', isDoubleLayer: true },
    { id: '11', name: '检测合同.pdf', type: 'pdf', size: '3.5MB', date: '1月前', isDoubleLayer: true },
    { id: '12', name: 'JDG镀锌管.pdf', type: 'pdf', size: '0.8MB', date: '1月前', isDoubleLayer: true },
    { id: '13', name: '墙体龙骨.pdf', type: 'pdf', size: '1.1MB', date: '1月前', isDoubleLayer: true },
    { id: '14', name: '吊顶龙骨.pdf', type: 'pdf', size: '1.5MB', date: '1月前', isDoubleLayer: true },
    { id: '15', name: '陶瓷砖检测报告1.pdf', type: 'pdf', size: '2.2MB', date: '1月前', isDoubleLayer: true },
];
