/**
 * 验收意见书 — 数据类型定义
 */

export type SignStatus = 'unsent' | 'pending' | 'signed' | 'rejected';

/** 验收意见书文件记录（支持同一项目多次开具） */
export interface AcceptanceOpinionFile {
  id: string;                    // 文件ID
  approvalOpinionNo: string;     // 审批意见号
  signStatus: SignStatus;
  signedAt?: string;
  createTime: string;
  modifyTime: string;
  remarks?: string;              // 备注（如：补正、重新开具等）
}

export interface AcceptanceOpinion {
  id: string;                // 与 ArchiveItem.id 关联
  projectName: string;
  projectShortName?: string;

  // 审批编号
  approvalOpinionNo: string;  // 审批意见号（最新一份）
  acceptanceVoucherNo?: string; // 验收凭证编号
  receiptRegistrationNo?: string; // 接收登记号
  permitNumber?: string;         // 施工许可证号
  planningPermitNumber?: string; // 规划许可证编号
  projectCode?: string;          // 项目代码
  qualityNumber?: string;        // 质监编号
  projectApprovalNumber?: string; // 立项批准文号

  // 项目信息
  location: string;
  constructionUnit: string;
  constructionCompany: string;
  surveyUnit: string;
  designUnit: string;
  supervisorUnit: string;

  // 投资 & 面积
  totalCost?: string;      // 项目总投资（万元）
  totalArea?: string;      // 工程建筑面积（㎡）

  // 日期
  startDate?: string;      // 开工日期
  endDate?: string;        // 竣工日期

  // 负责人
  constructionManager?: string;     // 建设单位负责人
  constructionManagerPhone?: string; // 负责人电话
  archivistName?: string;           // 档案员姓名
  archivistPhone?: string;          // 档案员电话

  // 卷册统计
  totalVolumes: number;        // 总卷数
  textVolumeCount: number;     // 文字卷数
  drawingVolumeCount: number;  // 图纸卷数
  photoCount: number;          // 照片张数
  discCount: number;           // 光盘盒数
  videoCount: number;          // 视频数
  otherMaterialCount?: number; // 其他材料数量
  totalPageCount: number;      // 总页数
  receiptRegisterCopies: number;   // 接收清册份数
  receiptRegisterPages?: number;   // 接收清册张数

  // 接收信息
  projectReceiver?: string;      // 项目接收人
  receivingUnitName?: string;    // 接收单位名称

  // 备注
  remarks?: string;

  // 签章状态（最新一份）
  signStatus: SignStatus;
  signedAt?: string;

  // 历史文件列表（按时间倒序）
  fileHistory?: AcceptanceOpinionFile[];

  // 时间戳
  createTime: string;
  modifyTime: string;
}

/** 列表页展示行 */
export interface AcceptanceOpinionListItem {
  id: string;
  projectName: string;
  projectShortName?: string;
  constructionUnit: string;       // 建设单位
  location: string;               // 项目地点
  permitNumber?: string;          // 施工许可证号
  qualityNumber?: string;         // 质监号
  receiptRegistrationNo?: string; // 登记号
  signStatus: SignStatus;
  signedFileUrl?: string;         // 已签章文件查看链接
  fileCount?: number;             // 文件数量（多份时显示）
  latestCreateTime?: string;      // 最新文件创建时间
}

/** 根据 ArchiveItem 生成默认 AcceptanceOpinion */
export function makeDefaultAcceptanceOpinion(
  id: string,
  projectName: string,
  location: string,
  constructionUnit: string,
  company: string,
  survey: string,
  design: string,
  supervisor: string,
  permitNumber?: string,
): AcceptanceOpinion {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const seq = String(Math.floor(Math.random() * 9000 + 1000));
  return {
    id,
    projectName,
    approvalOpinionNo: `2026-${seq}`,
    location,
    constructionUnit,
    constructionCompany: company,
    surveyUnit: survey,
    designUnit: design,
    supervisorUnit: supervisor,
    planningPermitNumber: permitNumber,
    totalCost: '',
    totalArea: '',
    startDate: '',
    endDate: '',
    constructionManager: '',
    constructionManagerPhone: '',
    archivistName: '',
    archivistPhone: '',
    totalVolumes: 1,
    textVolumeCount: 0,
    drawingVolumeCount: 0,
    photoCount: 0,
    discCount: 0,
    videoCount: 0,
    totalPageCount: 0,
    receiptRegisterCopies: 0,
    projectReceiver: '徐琴',
    receivingUnitName: '昆山市城建档案馆',
    signStatus: 'unsent',
    fileHistory: [],
    createTime: now,
    modifyTime: now,
  };
}
