import React, { useState } from 'react';
import { Plus, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SelectionItem } from '../../types';
import BorrowBasket from './BorrowBasket';

interface ApplyPanelProps {
  basket: SelectionItem[];
  onBasketClear: () => void;
  onRegisterSubmit: (form: ApplyFormData) => void;
  onToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export interface ApplyFormData {
  username: string;
  identityCard: string;
  company: string;
  phone: string;
  purpose: string;
  type: string;
  userRole: string;
  credentialType: string;
  utilType: string;
  remarks: string;
}

const defaultForm: ApplyFormData = {
  username: '张大勇',
  identityCard: 'EMPID-88942',
  company: '工程部 / 项目开发部',
  phone: '17751239920',
  purpose: '因微调高新技术产业园1号厂房冷库地基加固设计，需要核验一期结构受力检测数据与地质报告',
  type: '在线脱敏调阅',
  userRole: '集团内部员工',
  credentialType: '部门主管/项目经理签批件',
  utilType: '生产建设需求',
  remarks: '',
};

const ApplyPanel: React.FC<ApplyPanelProps> = ({
  basket,
  onBasketClear,
  onRegisterSubmit,
  onToast,
}) => {
  const [showRegisterForm, setShowRegisterForm] = useState(true);
  const [registerForm, setRegisterForm] = useState<ApplyFormData>(defaultForm);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (basket.length === 0) {
      const msg = '⚠️ 利用清单为空，请先在"我的档案馆"或"查询"中找到所需案卷或文件，点击"添加到利用"后继续。';
      if (onToast) {
        onToast(msg, 'error');
      } else {
        alert(msg);
      }
      return;
    }
    onRegisterSubmit(registerForm);
    setShowRegisterForm(false);
  };

  const handleCancel = () => {
    onBasketClear();
    setShowRegisterForm(false);
  };

  return (
    <>
      {/* Action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl shadow-xs gap-4">
        <div>
          <h3 className="font-bold text-sm text-slate-800 font-sans">
            1. 新建借阅或用印申请
          </h3>
          <p className="text-[10px] text-slate-450 font-medium">
            查看已提交的借阅和出证清单，获取水印数字证照副本。
          </p>
        </div>

        <div className="flex gap-2">
          {basket.length > 0 && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-2 flex items-center text-xs font-bold text-primary animate-bounce">
              📌 待关联资源: {basket.length} 项
            </div>
          )}
          <button
            onClick={() => setShowRegisterForm(!showRegisterForm)}
            className="px-5 py-2.5 bg-primary hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{showRegisterForm ? '收起申请单' : '立即起草借阅或用印申请'}</span>
          </button>
        </div>
      </div>

      {/* Expandable form */}
      <AnimatePresence>
        {showRegisterForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
              {/* Header info bar */}
              <div className="flex flex-col sm:flex-row justify-between items-center pb-4 gap-2 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏢</span>
                  <h2 className="text-sm font-black text-slate-900 tracking-wide">
                    档案借阅及用印申请
                  </h2>
                </div>
                <div className="text-right font-mono text-slate-400">
                  <span>受理流报批号: </span>
                  <span className="text-slate-800 font-bold decoration-dotted underline">AUTO-{Date.now().toString().slice(-8)}</span>
                </div>
              </div>

              <BorrowBasket basket={basket} />

              {/* Paper table style inputs */}
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-bold">
                <div className="rounded-lg overflow-hidden">
                  {/* Box 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 align-middle">
                    <div className="bg-slate-50 p-3 flex items-center justify-center shrink-0 text-slate-700 text-center">
                      借阅人 *
                    </div>
                    <div className="p-2">
                      <input
                        type="text"
                        required
                        title="借阅利用人"
                        className="w-full bg-transparent outline-none text-slate-800 focus:bg-slate-50 p-1"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      />
                    </div>
                    <div className="bg-slate-50 p-3 flex items-center justify-center shrink-0 text-slate-700 text-center">
                      员工工号或身份证 *
                    </div>
                    <div className="p-2">
                      <input
                        type="text"
                        required
                        title="员工工号/身份证"
                        className="w-full bg-transparent outline-none text-slate-800 font-mono focus:bg-slate-50 p-1"
                        value={registerForm.identityCard}
                        onChange={(e) => setRegisterForm({ ...registerForm, identityCard: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Box 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 align-middle">
                    <div className="bg-slate-50 p-3 flex items-center justify-center shrink-0 text-slate-700 text-center">
                      申请部门或分公司 *
                    </div>
                    <div className="p-2 col-span-2">
                      <input
                        type="text"
                        required
                        title="申请所属部门/分公司"
                        className="w-full bg-transparent outline-none text-slate-800 focus:bg-slate-50 p-1"
                        onChange={(e) => setRegisterForm({ ...registerForm, company: e.target.value })}
                      />
                    </div>
                    <div className="p-2 md:col-span-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 shrink-0">联络电话:</span>
                        <input
                          type="text"
                          required
                          title="联络电话"
                          className="w-full bg-transparent outline-none text-slate-800 font-mono focus:bg-slate-50 p-1"
                          onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Box 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 align-middle">
                    <div className="bg-slate-50 p-3 flex items-center justify-center shrink-0 text-slate-700 text-center">
                      申请调阅者身份 *
                    </div>
                    <div className="p-2">
                      <select
                        title="申请调阅者身份"
                        className="w-full bg-transparent outline-none text-slate-800 font-bold"
                        onChange={(e) => setRegisterForm({ ...registerForm, userRole: e.target.value })}
                      >
                        <option value="集团内部员工">集团内部员工 (总部/各中心)</option>
                        <option value="下属项目部/子公司人员">下属施工项目部 / 二级分公司成员</option>
                        <option value="外部审计特派员">外部审计师 / 律所协查人员</option>
                        <option value="集团股东/大业主代表">股东方代表 / 合作投资人 / 产权大业主</option>
                        <option value="政府驻厂检查组">政府驻厂代表 / 安全应急监察组</option>
                      </select>
                    </div>
                    <div className="bg-slate-50 p-3 flex items-center justify-center shrink-0 text-slate-700 text-center">
                      利用方式 *
                    </div>
                    <div className="p-2">
                      <select
                        title="授权利用形式"
                        className="w-full bg-transparent outline-none text-slate-800 font-bold"
                        value={registerForm.type}
                        onChange={(e) => setRegisterForm({ ...registerForm, type: e.target.value })}
                      >
                        <option value="在线脱敏调阅">在线阅读（不留底稿）</option>
                        <option value="副本下载">PDF副本离线下载</option>
                        <option value="加盖红章出证">打印并加盖企业红章</option>
                      </select>
                    </div>
                  </div>

                  {/* Box 4 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 align-middle">
                    <div className="bg-slate-50 p-3 flex items-center justify-center shrink-0 text-slate-700 text-center">
                      授权凭证 *
                    </div>
                    <div className="p-2">
                      <select
                        title="利用控制凭证"
                        className="w-full bg-transparent outline-none text-slate-800 font-bold"
                        value={registerForm.credentialType}
                        onChange={(e) => setRegisterForm({ ...registerForm, credentialType: e.target.value })}
                      >
                        <option value="部门主管/项目经理签批件">部门主管或OA系统签批</option>
                        <option value="项目经理签字/二级业务委托单">项目经理签字 / 业务指派委托书</option>
                        <option value="员工工作证 & 居民身份证">员工工作证 / 集团数字工作牌</option>
                        <option value="外部协查函">外部协查公函 / 联席会审公文</option>
                      </select>
                    </div>
                    <div className="bg-slate-50 p-3 flex items-center justify-center shrink-0 text-slate-700 text-center">
                      调阅用途大类 *
                    </div>
                    <div className="p-2">
                      <select
                        title="调阅用途大类"
                        className="w-full bg-transparent outline-none text-slate-800 font-bold"
                        value={registerForm.utilType}
                        onChange={(e) => setRegisterForm({ ...registerForm, utilType: e.target.value })}
                      >
                        <option value="生产建设需求">项目复盘、运维扩建与现场施工参考</option>
                        <option value="法庭诉讼举证">公司合规审计、法务诉讼与纠纷举证</option>
                        <option value="备案质量会审">项目决算、工程设计变更与关联上报</option>
                        <option value="学术科研或历史修缮">日常运营、新进员工培训与经验交流</option>
                      </select>
                    </div>
                  </div>

                  {/* Box 5 (utilization purpose) */}
                  <div className="grid grid-cols-1 md:grid-cols-4 align-middle">
                    <div className="bg-slate-50 p-3 flex items-center justify-center shrink-0 text-slate-700 text-center">
                      调阅事由 *
                    </div>
                    <div className="p-2 col-span-3">
                      <textarea
                        required
                        rows={2}
                        placeholder="请准确描述调阅事由。例如：因承建高新技术产业园1号厂房进行二期施工，需提取一期地下桩基测试数据进行核算。"
                        className="w-full bg-transparent outline-none text-slate-800 focus:bg-slate-50 p-1 resize-none text-[11px] leading-normal"
                        value={registerForm.purpose}
                        onChange={(e) => setRegisterForm({ ...registerForm, purpose: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Box 6 (sign and remarks) */}
                  <div className="grid grid-cols-1 md:grid-cols-4 align-middle">
                    <div className="bg-slate-50 p-3 flex items-center justify-center shrink-0 text-slate-700 text-center">
                      安全声明
                    </div>
                    <div className="p-2 col-span-3 text-slate-500 font-medium">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <span className="text-[10px] leading-relaxed text-left text-slate-450">
                          🔒 安全声明：下载及打印的档案副本受加密保护，请妥善保管。所有副本均已加密处理，防止篡改。
                        </span>
                        <span className="text-[10px] font-mono shrink-0 bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                          防伪证件: LANTAICLOUD-SECURE-VAULT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit and Cancel block */}
                <div className="flex justify-end gap-3 text-xs pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-xl hover:bg-slate-100 cursor-pointer text-slate-600 font-semibold"
                  >
                    清空并取消
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>提交审核申请 🚀</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ApplyPanel;
