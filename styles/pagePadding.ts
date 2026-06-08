/**
 * 页面内容区域统一间距配置
 *
 * 所有页面的主内容区使用统一的 padding 和间距，
 * 确保全局视觉一致性。
 *
 * 标准值：p-6 space-y-6
 * - p-6       → 内容区四周 24px 内边距
 * - space-y-6 → 子元素之间 24px 垂直间距
 */

export const PAGE_PADDING = 'p-6 space-y-6';
export const PAGE_CONTAINER = `flex-1 overflow-y-auto ${PAGE_PADDING}`;
