/**
 * 接收凭证 — 数据类型定义
 * 
 * 签署流程：
 * 1. 档案馆确认/修改字段，创建接收凭证 → 状态: unsent
 * 2. 发起签章，等待建设单位签章 → 状态: signing
 * 3. 建设单位完成签章 → 状态: construction_unit_signed
 * 4. 档案馆完成签章 → 状态: signed
 */

export type ReceiptSignStatus = 'unsent' | 'signing' | 'construction_unit_signed' | 'signed' | 'rejected';

/** 接收凭证文件记录（支持同一项目多次开具） */
export interface ReceiptCertificateFile {
  id: string;                    // 文件ID
  receiptNo: string;             // 接收凭证编号
  signStatus: ReceiptSignStatus;
  signedAt?: string;
  createTime: string;
  modifyTime: string;
  remarks?: string;              // 备注
}

export interface ReceiptCertificate {
  id: string;                // 与 ArchiveItem.id 关联
  projectName: string;
  projectShortName?: string;

  // 凭证编号
  receiptNo: string;            // 接收凭证编号
  receiptRegistrationNo?: string; // 接收登记号
  permitNumber?: string;         // 施工许可证号
  planningPermitNumber?: string; // 规划许可证编号
  projectCode?: string;          // 项目代码
  qualityNumber?: string;        // 质监编号

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
  totalPageCount: number;      // 总页数

  // 接收信息
  projectReceiver?: string;      // 项目接收人
  receivingUnitName?: string;    // 接收单位名称

  // 备注
  remarks?: string;

  // 签章状态
  signStatus: ReceiptSignStatus;
  signedAt?: string;

  // 历史文件列表（按时间倒序）
  fileHistory?: ReceiptCertificateFile[];

  // 时间戳
  createTime: string;
  modifyTime: string;
}

/** 列表页展示行 */
export interface ReceiptCertificateListItem {
  id: string;
  projectName: string;
  projectShortName?: string;
  constructionUnit: string;       // 建设单位
  location: string;               // 项目地点
  permitNumber?: string;          // 施工许可证号
  qualityNumber?: string;         // 质监号
  receiptRegistrationNo?: string; // 登记号
  receiptNo: string;              // 接收凭证编号
  signStatus: ReceiptSignStatus;
  signedFileUrl?: string;         // 已签章文件查看链接
  fileCount?: number;             // 文件数量
  latestCreateTime?: string;      // 最新文件创建时间
}
