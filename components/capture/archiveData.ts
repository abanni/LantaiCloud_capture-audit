import { SelectionItem } from '../../types';

export interface ArchiveItem {
  id: string;
  projectName: string;
  constructionUnit: string;
  formationDate: string;
  securityLevel: '公开' | '限阅' | '机密';
  retentionPeriod: '永久' | '30年' | '10年';
  archiveCode: string;
  originalCode: string;
  totalVolumes: number;
  totalFiles: number;
  year: string;
  cost: number; // in RMB
  projectType: '房建' | '市政' | '工业';
  archiveType: '建设档案' | '司法档案' | '文书档案';
  location: string;
  summary: string;
}

export const ARCHIVES_DATA: ArchiveItem[] = [
  {
    id: 'arc-1',
    projectName: '张浦镇德国工业园标准厂房四期项目',
    constructionUnit: '上海无无科技有限公司',
    formationDate: '2025-10-12',
    securityLevel: '公开',
    retentionPeriod: '永久',
    archiveCode: 'A.320583-2025-001',
    originalCode: 'Y-ZP-2025-001A',
    totalVolumes: 12,
    totalFiles: 145,
    year: '2025',
    cost: 45000000,
    projectType: '工业',
    archiveType: '建设档案',
    location: '昆山市张浦镇德国工业园',
    summary: '该项目包括4座标准化轻钢单层厂房及其附属多功能研发配楼，总建筑面积超48000平方米，已完成桩基验收与钢结构主体质监备案。',
  },
  {
    id: 'arc-2',
    projectName: '昆山开发区城市广场地下主体工程',
    constructionUnit: '昆山城市发展投资有限公司',
    formationDate: '2024-11-20',
    securityLevel: '限阅',
    retentionPeriod: '30年',
    archiveCode: 'A.320583-2024-035',
    originalCode: 'Y-KS-CSGC-035',
    totalVolumes: 24,
    totalFiles: 350,
    year: '2024',
    cost: 128000000,
    projectType: '市政',
    archiveType: '司法档案',
    location: '昆山开发区前进东路城市广场',
    summary: '此档案包含地下二层重型人防防护掩蔽站、地铁综合换乘中转骨架梁钢板桩、超大型防水地下连续墙抗震会审备件。',
  },
  {
    id: 'arc-3',
    projectName: '上海未来芯球体育文化装修工程',
    constructionUnit: '上海未来芯球文化发展有限公司',
    formationDate: '2025-03-15',
    securityLevel: '公开',
    retentionPeriod: '10年',
    archiveCode: 'A.310115-2025-014',
    originalCode: 'Y-SH-XQ-014',
    totalVolumes: 8,
    totalFiles: 92,
    year: '2025',
    cost: 12000000,
    projectType: '房建',
    archiveType: '文书档案',
    location: '上海市浦东新区张江高科园区',
    summary: '上海未来芯球体育项目，核心涵盖体育馆钢桁架吊装、高密度多层消音装潢、大型中央变配电间调试及综合消防出证图。',
  },
  {
    id: 'arc-4',
    projectName: '陆家镇童趣小镇幼儿园新建级配工程',
    constructionUnit: '昆山市陆家镇人民政府',
    formationDate: '2025-06-01',
    securityLevel: '公开',
    retentionPeriod: '永久',
    archiveCode: 'A.320583-2025-068',
    originalCode: 'Y-LJ-TQ-068',
    totalVolumes: 15,
    totalFiles: 180,
    year: '2025',
    cost: 28000000,
    projectType: '房建',
    archiveType: '建设档案',
    location: '昆山市陆家镇童趣小镇园区',
    summary: '该精品幼儿园新建级配工程，涵盖教学辅楼地基静载试验报告、无盲区低位监控铺设及幼儿活动房低能耗全辐射制冷系统调试大纲。',
  }
];

export interface SearchField {
  label: string;
  value: string;
  type?: 'text' | 'select' | 'number';
  options?: string[];
}

export const SEARCH_FIELDS: SearchField[] = [
  { label: '档案项目名称', value: 'projectName' },
  { label: '档号', value: 'archiveCode' },
  { label: '原原档号', value: 'originalCode' },
  { label: '编制单位', value: 'constructionUnit' },
  { label: '档案类型', value: 'archiveType', type: 'select', options: ['建设档案', '司法档案', '文书档案'] },
  { label: '密级', value: 'securityLevel', type: 'select', options: ['公开', '限阅', '机密'] },
  { label: '保管期限', value: 'retentionPeriod', type: 'select', options: ['永久', '30年', '10年'] },
  { label: '形成年度', value: 'year', type: 'select', options: ['2026', '2025', '2024', '2023'] }
];

export const LOGIC_OPERATORS = [
  { label: '包含', value: 'includes' },
  { label: '等于', value: 'equals' },
  { label: '不包含', value: 'excludes' },
  { label: '大于', value: 'gt' },
  { label: '小于', value: 'lt' }
];

export interface QueryCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  level?: string;
}

export interface RegistrationItem {
  id: string;
  registerName: string;
  identityCard: string;
  company: string;
  phone: string;
  purpose: string;
  useType: string;
  items: SelectionItem[];
  date: string;
  status: 'PENDING' | 'APPROVED';
}

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'ARC-LOG-4091',
    accessTime: '2026-06-05 16:34:12',
    userName: '张伟',
    userType: '建设单位',
    archiveTitle: '张浦镇德国工业园标准厂房四期项目 施工图会审记录',
    type: '在线查阅',
    purpose: '工程移交及备案查照',
    result: 'Success'
  },
  {
    id: 'ARC-LOG-4090',
    accessTime: '2026-06-05 14:22:05',
    userName: '李娜',
    userType: '产权单位',
    archiveTitle: '昆山开发区城市广场地下主体工程 地下二层防护图纸',
    type: '副本下载',
    purpose: '施工图多段联合审批',
    result: 'Success'
  },
  {
    id: 'ARC-LOG-4089',
    accessTime: '2026-06-04 11:15:30',
    userName: '岑源',
    userType: '党政、纪检机关',
    archiveTitle: '上海未来芯球体育文化装修工程 声学吸音质检明细表',
    type: '加章打复印',
    purpose: '现场执法核查与合规调阅',
    result: 'Success'
  },
  {
    id: 'ARC-LOG-4088',
    accessTime: '2026-06-03 09:12:44',
    userName: '王志军',
    userType: '律师/自然人',
    archiveTitle: '陆家镇童趣小镇幼儿园新建级配工程 机密桩基质心检测报告',
    type: '在线查阅',
    purpose: '民事安全事件取证',
    result: 'Denied'
  }
];

// Helper to load/save data in localStorage to synchronize state across routes
export const getStoredBasket = (): SelectionItem[] => {
  try {
    const data = localStorage.getItem('archive_basket');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

export const setStoredBasket = (basket: SelectionItem[]) => {
  try {
    localStorage.setItem('archive_basket', JSON.stringify(basket));
  } catch (error) {
    console.error('Failed to store basket', error);
  }
};

export const getStoredRegistrations = (): RegistrationItem[] => {
  try {
    const data = localStorage.getItem('archive_registrations');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

export const setStoredRegistrations = (regs: RegistrationItem[]) => {
  try {
    localStorage.setItem('archive_registrations', JSON.stringify(regs));
  } catch (error) {
    console.error('Failed to store registrations', error);
  }
};

export const getStoredAuditLogs = () => {
  try {
    const data = localStorage.getItem('archive_audit_logs');
    return data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
  } catch (error) {
    return INITIAL_AUDIT_LOGS;
  }
};

export const setStoredAuditLogs = (logs: any[]) => {
  try {
    localStorage.setItem('archive_audit_logs', JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to store audit logs', error);
  }
};
