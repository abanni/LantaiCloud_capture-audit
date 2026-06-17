import { ARCHIVES_DATA } from '../../integrator/archiveData';

// --- PROJECT LEVEL SEARCH FIELDS (建设档案 ONLY) ---
export const PROJECT_FIELDS = [
  { label: '项目名称', value: 'projectName' },
  { label: '参建单位名称', value: 'participantUnit' },
  { label: '年度', value: 'year', type: 'select', options: ['2026', '2025', '2024', '2023'] },
  { label: '项目地点', value: 'location' },
  { label: '项目类型', value: 'projectType', type: 'select', options: ['房建', '市政', '工业'] },
  { label: '施工许可证号', value: 'workPermitNo' }
];

// --- ENGINEERING LEVEL SEARCH FIELDS (建设档案 ONLY) ---
export const UNIT_FIELDS = [
  { label: '单体工程名称', value: 'unitName' },
  { label: '参建单位名称', value: 'participantUnit' },
  { label: '年度', value: 'year', type: 'select', options: ['2026', '2025', '2024', '2023'] },
  { label: '造价', value: 'cost' },
  { label: '开工日期', value: 'startDate' },
  { label: '竣工日期', value: 'endDate' },
  { label: '质量监督号', value: 'qualitySupervisionNo' }
];

// --- VOLUME LEVEL SEARCH FIELDS (ALL ARCHIVE TYPES) ---
export const VOLUME_FIELDS = [
  { label: '案卷题名', value: 'title' },
  { label: '档号', value: 'archiveCode' },
  { label: '原档号', value: 'originalCode' },
  { label: '编制单位', value: 'project' },
  { label: '载体类型', value: 'type', type: 'select', options: ['纸质', '电子', '缩微品', '电子/纸质'] },
  { label: '年度', value: 'year', type: 'select', options: ['2026', '2025', '2024', '2023'] },
  { label: '保管期限', value: 'retention', type: 'select', options: ['永久', '30年', '10年'] },
  { label: '密级', value: 'securityLevel', type: 'select', options: ['公开', '限阅', '机密'] },
  { label: '主题词', value: 'keywords' },
  { label: '进馆日期', value: 'date' }
];

// --- MOCK PROJECT-LEVEL DATA FOR 建设档案 ---
export const MOCK_SEARCH_PROJECTS = [
  {
    id: 'arc-1',
    projectName: '张浦镇德国工业园标准厂房四期项目',
    archiveCode: 'A.320583-2025-001',
    participantUnit: '苏州第二建筑安装集团有限公司 / 上海无无科技有限公司',
    constructionUnit: '上海无无科技有限公司',
    year: '2025',
    location: '昆山市张浦镇德国工业园',
    projectType: '工业',
    workPermitNo: '建字第32058320250012号',
    securityLevel: '公开',
    summary: '该项目包括4座标准化轻钢单层厂房及其附属多功能研发配楼，总建筑面积超48000平方米。',
    cost: 45000000,
    archiveType: '建设档案'
  },
  {
    id: 'arc-4',
    projectName: '陆家镇童趣小镇幼儿园新建级配工程',
    archiveCode: 'A.320583-2025-068',
    participantUnit: '昆山市第一建筑工程有限公司 / 昆山市陆家镇人民政府',
    constructionUnit: '昆山市陆家镇人民政府',
    year: '2025',
    location: '昆山市陆家镇童趣小镇园区',
    projectType: '房建',
    workPermitNo: '建字第32058320250089号',
    securityLevel: '公开',
    summary: '该精品幼儿园新建级配工程，涵盖教学辅楼地基静载试验报告、无盲区低位监控铺设。',
    cost: 28000000,
    archiveType: '建设档案'
  }
];

// --- MOCK ENGINEERING-LEVEL DATA FOR 建设档案 ---
export const MOCK_SEARCH_UNITS = [
  {
    id: 'u-1',
    archiveCode: 'A.320583-2025-001-E01',
    projectName: '张浦镇德国工业园标准厂房四期项目',
    unitName: '1号标准化轻钢单层厂房',
    participantUnit: '苏州第二建筑安装集团有限公司',
    constructionUnit: '上海无无科技有限公司',
    year: '2025',
    cost: 12000000,
    startDate: '2025-03-01',
    endDate: '2025-09-30',
    qualitySupervisionNo: '质监-2025-0018-01',
    securityLevel: '公开',
    summary: '1号车间基础静载试验，钢结构承重柱安装检测完毕。',
    archiveType: '建设档案'
  },
  {
    id: 'u-2',
    archiveCode: 'A.320583-2025-001-E02',
    projectName: '张浦镇德国工业园标准厂房四期项目',
    unitName: '2号多功能研发配楼',
    participantUnit: '昆山安装建设有限公司',
    constructionUnit: '上海无无科技有限公司',
    year: '2025',
    cost: 8000000,
    startDate: '2025-04-10',
    endDate: '2025-10-15',
    qualitySupervisionNo: '质监-2025-0018-02',
    securityLevel: '公开',
    summary: '2号配楼主体砌体施工，外檐抹灰，消防管线预埋。',
    archiveType: '建设档案'
  },
  {
    id: 'u-3',
    archiveCode: 'A.320583-2025-068-E01',
    projectName: '陆家镇童趣小镇幼儿园新建级配工程',
    unitName: '教学主楼抗震加固工程',
    participantUnit: '昆山市第一建筑工程有限公司',
    constructionUnit: '昆山市陆家镇人民政府',
    year: '2025',
    cost: 15000000,
    startDate: '2025-02-15',
    endDate: '2025-05-30',
    qualitySupervisionNo: '质监-2025-0145',
    securityLevel: '公开',
    summary: '教学主辅楼抗震加固、高强碳纤维布粘帖及主体抹浆拉毛工程。',
    archiveType: '建设档案'
  },
  {
    id: 'u-4',
    archiveCode: 'A.320583-2025-068-E02',
    projectName: '陆家镇童趣小镇幼儿园新建级配工程',
    unitName: '园区配套管网工程',
    participantUnit: '昆山市自来水集团有限公司',
    constructionUnit: '昆山市陆家镇人民政府',
    year: '2025',
    cost: 4000000,
    startDate: '2025-03-20',
    endDate: '2025-06-10',
    qualitySupervisionNo: '质监-2025-0146',
    securityLevel: '公开',
    summary: '教学主辅楼抗震加固及园区地下排水、彩色沥青道路工程。',
    archiveType: '建设档案'
  }
];

// --- FILE LEVEL SEARCH FIELDS ---
export const FILE_FIELDS = [
  { label: '文件题名', value: 'fileLabel' },
  { label: '所属案卷', value: 'parentVolume' },
  { label: '所属项目', value: 'parentProject' },
  { label: '密级', value: 'securityLevel', type: 'select', options: ['公开', '限阅', '机密'] },
  { label: '主题词', value: 'keywords' },
];

// --- MOCK FILE-LEVEL DATA ---
export const MOCK_SEARCH_FILES = [
  {
    id: 'f-1',
    fileLabel: '工程准备阶段文件清单',
    parentVolume: '苏州吉丰新材料有限公司 生产车间 工程准备阶段',
    parentProject: '苏州吉丰新材料有限公司 生产车间',
    archiveCode: 'A.0.1-2024-001-F01',
    securityLevel: '公开',
    summary: '工程准备阶段形成的各类文件清单目录',
    keywords: '准备阶段,文件清单',
  },
  {
    id: 'f-2',
    fileLabel: '立项申请书',
    parentVolume: '苏州吉丰新材料有限公司 生产车间 工程准备阶段',
    parentProject: '苏州吉丰新材料有限公司 生产车间',
    archiveCode: 'A.0.1-2024-001-F02',
    securityLevel: '公开',
    summary: '项目立项申请书及相关批复文件',
    keywords: '立项,申请书',
  },
  {
    id: 'f-3',
    fileLabel: '总监理工程师任命书及证书',
    parentVolume: '苏州吉丰新材料有限公司 生产车间 监理文件',
    parentProject: '苏州吉丰新材料有限公司 生产车间',
    archiveCode: 'A.0.1-2024-001-F03',
    securityLevel: '公开',
    summary: '总监理工程师任命书及相关资质证书',
    keywords: '监理,任命书,证书',
  },
  {
    id: 'f-4',
    fileLabel: '监理规划',
    parentVolume: '苏州吉丰新材料有限公司 生产车间 监理文件',
    parentProject: '苏州吉丰新材料有限公司 生产车间',
    archiveCode: 'A.0.1-2024-001-F04',
    securityLevel: '公开',
    summary: '针对生产车间项目的监理工作规划方案',
    keywords: '监理,规划',
  },
  {
    id: 'f-5',
    fileLabel: '监理实施细则',
    parentVolume: '苏州吉丰新材料有限公司 生产车间 监理文件',
    parentProject: '苏州吉丰新材料有限公司 生产车间',
    archiveCode: 'A.0.1-2024-001-F05',
    securityLevel: '限阅',
    summary: '监理工作实施细则和操作规范',
    keywords: '监理,实施细则',
  },
];

// --- HELPER TO EXPAND ARCHIVES INTO VOLUME-LEVEL DATA ---
export const getVolumeDataList = (archiveType: string) => {
  return ARCHIVES_DATA.filter(item => item.archiveType === archiveType).map(item => ({
    id: item.id,
    archiveCode: item.archiveCode,
    originalCode: item.originalCode,
    projectName: item.projectName,
    title: item.projectName + ' 案卷整卷',
    project: item.constructionUnit,
    type: '电子/纸质',
    year: item.year,
    retention: item.retentionPeriod,
    securityLevel: item.securityLevel,
    keywords: item.summary,
    date: item.formationDate,
    constructionUnit: item.constructionUnit,
    cost: item.cost,
    summary: item.summary,
    archiveType: item.archiveType,
    rawArchive: item
  }));
};
