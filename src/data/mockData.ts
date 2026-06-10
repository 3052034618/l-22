import type { StatCardData, ActionType, TodoTask, RankItem, StoreCompare, Task, Message, ShiftOption, GoodPractice, AuditLog, FeedbackVersion } from '@/types';

export const statCards: StatCardData[] = [
  {
    label: '本月减排估算',
    value: '156.8',
    unit: 'kg CO₂',
    change: '+12.5%',
    changeType: 'down',
    icon: '🌱'
  },
  {
    label: '节能行动次数',
    value: '48',
    unit: '次',
    change: '+8',
    changeType: 'up',
    icon: '⚡'
  },
  {
    label: '门店能耗强度',
    value: '0.85',
    unit: 'kWh/㎡',
    change: '-5.2%',
    changeType: 'down',
    icon: '📉'
  },
  {
    label: '完成率',
    value: '92',
    unit: '%',
    change: '+3%',
    changeType: 'up',
    icon: '✅'
  }
];

export const actionTypes: ActionType[] = [
  {
    id: 'lighting_1',
    name: '照明调整',
    icon: '💡',
    category: 'lighting',
    description: '根据客流情况调整照明亮度和开启数量',
    carbonSaving: 2.5
  },
  {
    id: 'lighting_2',
    name: '空调温度调整',
    icon: '❄️',
    category: 'lighting',
    description: '合理设置空调温度，夏季26℃以上',
    carbonSaving: 5.8
  },
  {
    id: 'equipment_1',
    name: '设备停用',
    icon: '🔌',
    category: 'equipment',
    description: '非营业时间关闭不必要的设备电源',
    carbonSaving: 8.2
  },
  {
    id: 'equipment_2',
    name: '设备定期维护',
    icon: '🔧',
    category: 'equipment',
    description: '定期清洁维护设备，提高能效',
    carbonSaving: 3.5
  },
  {
    id: 'packaging_1',
    name: '低碳包装使用',
    icon: '📦',
    category: 'packaging',
    description: '使用可降解包装材料，减少塑料使用',
    carbonSaving: 1.2
  },
  {
    id: 'packaging_2',
    name: '包装回收利用',
    icon: '♻️',
    category: 'packaging',
    description: '回收纸箱、包装袋等可重复利用材料',
    carbonSaving: 0.8
  },
  {
    id: 'exception_1',
    name: '异常能耗说明',
    icon: '⚠️',
    category: 'exception',
    description: '记录异常能耗情况及原因说明',
    carbonSaving: 0
  }
];

export const shiftOptions: ShiftOption[] = [
  { value: 'morning', label: '早班', time: '07:00-15:00' },
  { value: 'afternoon', label: '中班', time: '14:00-22:00' },
  { value: 'night', label: '晚班', time: '21:00-次日07:00' }
];

export const todoTasks: TodoTask[] = [
  {
    id: 'todo_1',
    title: '提交今日节能行动记录',
    deadline: '今天 18:00',
    priority: 'high',
    type: '日常填报',
    isDaily: true
  },
  {
    id: 'todo_2',
    title: '完成Q2节能目标拆解',
    deadline: '本周日',
    priority: 'medium',
    type: '任务'
  },
  {
    id: 'todo_3',
    title: '补充设备维护记录',
    deadline: '明天 12:00',
    priority: 'low',
    type: '补充材料'
  }
];

export const rankList: RankItem[] = [
  { rank: 1, storeName: '朝阳大悦城店', storeId: 's001', value: 0.72, unit: 'kWh/㎡', change: 3, changeType: 'up' },
  { rank: 2, storeName: '三里屯太古里店', storeId: 's002', value: 0.78, unit: 'kWh/㎡', change: 1, changeType: 'up' },
  { rank: 3, storeName: '国贸商城店', storeId: 's003', value: 0.85, unit: 'kWh/㎡', change: 2, changeType: 'down' },
  { rank: 4, storeName: '西单大悦城店', storeId: 's004', value: 0.89, unit: 'kWh/㎡', change: 1, changeType: 'up' },
  { rank: 5, storeName: '王府井百货店', storeId: 's005', value: 0.92, unit: 'kWh/㎡', change: 4, changeType: 'down' }
];

const generateEnergyTrend = (baseValue: number, decreasing: boolean = true) => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
  return months.map((month, i) => ({
    month,
    value: Math.round((baseValue + (decreasing ? -i * 0.03 : i * 0.02)) * 100) / 100,
    baseline: Math.round((baseValue + 0.1 + (decreasing ? -i * 0.02 : i * 0.01)) * 100) / 100
  }));
};

const generateCompletionTrend = (startValue: number, increasing: boolean = true) => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
  return months.map((month, i) => ({
    month,
    value: Math.min(99, Math.max(50, startValue + (increasing ? i * 5 : -i * 3)))
  }));
};

const generateGoodPractices = (storeId: string): GoodPractice[] => {
  const practicesByStore: Record<string, GoodPractice[]> = {
    s001: [
      { id: 'gp_001_1', storeId: 's001', title: '智能照明控制系统', description: '安装人体感应传感器和光照传感器，实现人来灯亮、人走灯灭，根据自然光照自动调节灯光亮度。', effect: '月度节电约 15%', category: '照明空调' },
      { id: 'gp_001_2', storeId: 's001', title: '空调温度智能管理', description: '夏季设置26℃基准温度，根据客流密度和室外温度动态调整，高峰时段提前预冷。', effect: '月度空调节能约 12%', category: '照明空调' },
      { id: 'gp_001_3', storeId: 's001', title: '设备定时巡检制度', description: '建立每日设备巡检台账，及时发现并处理设备异常运行，避免无效能耗。', effect: '设备运行效率提升 8%', category: '设备管理' },
      { id: 'gp_001_4', storeId: 's001', title: '全员节能竞赛', description: '开展班组节能竞赛，设立月度节能之星奖项，激发员工节能积极性。', effect: '全员节能意识显著提升', category: '管理创新' }
    ],
    s002: [
      { id: 'gp_002_1', storeId: 's002', title: '空调分区控制', description: '将门店划分为多个空调区域，根据各区域客流和使用情况独立控制温度。', effect: '空调节能约 10%', category: '照明空调' },
      { id: 'gp_002_2', storeId: 's002', title: '人员感应系统', description: '在库房、卫生间等人员流动较少区域安装人体感应开关，无人时自动关闭。', effect: '照明节电约 8%', category: '照明空调' },
      { id: 'gp_002_3', storeId: 's002', title: '冷链设备优化', description: '对冷藏冷冻设备进行能效优化，定期除霜，减少能耗损失。', effect: '冷链节能约 12%', category: '设备管理' },
      { id: 'gp_002_4', storeId: 's002', title: '节能晨会制度', description: '每日晨会强调节能要点，各班组汇报昨日节能情况。', effect: '节能执行率提升 15%', category: '管理创新' }
    ],
    s003: [
      { id: 'gp_003_1', storeId: 's003', title: '设备定时开关', description: '制定设备开关机时间表，非营业时间自动关闭非必要设备。', effect: '月度节电约 10%', category: '设备管理' },
      { id: 'gp_003_2', storeId: 's003', title: '能效监控系统', description: '安装分区域能耗监控系统，实时掌握各区域能耗情况，及时发现异常。', effect: '异常能耗发现率 100%', category: '设备管理' },
      { id: 'gp_003_3', storeId: 's003', title: 'LED照明改造', description: '将传统荧光灯全部更换为LED灯具，大幅降低照明能耗。', effect: '照明节电约 40%', category: '照明空调' },
      { id: 'gp_003_4', storeId: 's003', title: '节能培训常态化', description: '每月开展一次节能培训，分享节能技巧和最佳实践。', effect: '员工节能知识普及率 95%', category: '管理创新' }
    ],
    s004: [
      { id: 'gp_004_1', storeId: 's004', title: '包装回收再利用', description: '建立纸箱、购物袋回收再利用机制，减少新包装采购。', effect: '包装成本降低 20%', category: '低碳包装' },
      { id: 'gp_004_2', storeId: 's004', title: '可降解包装推广', description: '全面推广使用可降解购物袋和餐盒，减少塑料污染。', effect: '塑料使用量减少 60%', category: '低碳包装' },
      { id: 'gp_004_3', storeId: 's004', title: '空调滤网定期清洗', description: '建立空调滤网清洗计划，每月清洗一次，保证空调效率。', effect: '空调效率提升 10%', category: '设备管理' },
      { id: 'gp_004_4', storeId: 's004', title: '节能积分兑换', description: '员工节能建议一经采纳可获得积分，兑换礼品。', effect: '节能建议数量增长 3倍', category: '管理创新' }
    ],
    s005: [
      { id: 'gp_005_1', storeId: 's005', title: '员工节能培训', description: '定期开展节能培训，提高员工节能意识和技能。', effect: '全员参与率 85%', category: '管理创新' },
      { id: 'gp_005_2', storeId: 's005', title: '激励机制建立', description: '设立节能专项奖金，对节能表现突出的班组和个人进行奖励。', effect: '节能积极性显著提高', category: '管理创新' },
      { id: 'gp_005_3', storeId: 's005', title: '自然采光利用', description: '充分利用自然采光，白天尽量减少人工照明。', effect: '白天照明节电约 25%', category: '照明空调' },
      { id: 'gp_005_4', storeId: 's005', title: '电梯节能模式', description: '非高峰时段启用电梯节能模式，减少空载运行。', effect: '电梯节电约 15%', category: '设备管理' }
    ],
    s006: [
      { id: 'gp_006_1', storeId: 's006', title: 'LED照明全面改造', description: '将店内所有照明更换为LED节能灯，包括货架照明、装饰照明等。', effect: '整体照明节电约 45%', category: '照明空调' },
      { id: 'gp_006_2', storeId: 's006', title: '智能电表监控', description: '安装智能电表，实时监控各设备能耗，及时发现异常。', effect: '异常响应时间缩短 50%', category: '设备管理' },
      { id: 'gp_006_3', storeId: 's006', title: '空调外机散热优化', description: '对空调外机安装位置进行优化，改善散热条件，提高制冷效率。', effect: '空调节能约 8%', category: '设备管理' },
      { id: 'gp_006_4', storeId: 's006', title: '节能目标责任制', description: '将节能目标分解到各班组，责任到人，定期考核。', effect: '目标完成率提升 20%', category: '管理创新' }
    ]
  };
  return practicesByStore[storeId] || practicesByStore['s001'];
};

export const storeCompareList: StoreCompare[] = [
  {
    id: 's001',
    storeId: 's001',
    name: '朝阳大悦城店',
    storeName: '朝阳大悦城店',
    region: '北京东部',
    rank: 1,
    energyIntensity: 0.72,
    completionRate: 96,
    bestPractice: '智能照明系统+客流联动控制',
    carbonReduction: 234.5,
    carbonSaving: 234.5,
    energyTrend: generateEnergyTrend(0.82),
    completionTrend: generateCompletionTrend(72),
    goodPractices: generateGoodPractices('s001')
  },
  {
    id: 's002',
    storeId: 's002',
    name: '三里屯太古里店',
    storeName: '三里屯太古里店',
    region: '北京东部',
    rank: 2,
    energyIntensity: 0.78,
    completionRate: 94,
    bestPractice: '空调分区控制+人员感应',
    carbonReduction: 198.2,
    carbonSaving: 198.2,
    energyTrend: generateEnergyTrend(0.88),
    completionTrend: generateCompletionTrend(68),
    goodPractices: generateGoodPractices('s002')
  },
  {
    id: 's003',
    storeId: 's003',
    name: '国贸商城店',
    storeName: '国贸商城店',
    region: '北京中部',
    rank: 3,
    energyIntensity: 0.85,
    completionRate: 91,
    bestPractice: '设备定时开关+能效监控',
    carbonReduction: 167.8,
    carbonSaving: 167.8,
    energyTrend: generateEnergyTrend(0.95),
    completionTrend: generateCompletionTrend(65),
    goodPractices: generateGoodPractices('s003')
  },
  {
    id: 's004',
    storeId: 's004',
    name: '西单大悦城店',
    storeName: '西单大悦城店',
    region: '北京西部',
    rank: 4,
    energyIntensity: 0.89,
    completionRate: 88,
    bestPractice: '包装回收再利用计划',
    carbonReduction: 145.6,
    carbonSaving: 145.6,
    energyTrend: generateEnergyTrend(0.98),
    completionTrend: generateCompletionTrend(60),
    goodPractices: generateGoodPractices('s004')
  },
  {
    id: 's005',
    storeId: 's005',
    name: '王府井百货店',
    storeName: '王府井百货店',
    region: '北京中部',
    rank: 5,
    energyIntensity: 0.92,
    completionRate: 85,
    bestPractice: '员工节能培训+激励机制',
    carbonReduction: 132.4,
    carbonSaving: 132.4,
    energyTrend: generateEnergyTrend(1.0, false),
    completionTrend: generateCompletionTrend(58),
    goodPractices: generateGoodPractices('s005')
  },
  {
    id: 's006',
    storeId: 's006',
    name: '中关村店',
    storeName: '中关村店',
    region: '北京西部',
    rank: 6,
    energyIntensity: 0.95,
    completionRate: 82,
    bestPractice: 'LED照明全面改造',
    carbonReduction: 120.1,
    carbonSaving: 120.1,
    energyTrend: generateEnergyTrend(1.05, false),
    completionTrend: generateCompletionTrend(55),
    goodPractices: generateGoodPractices('s006')
  }
];

const task1AuditLogs: AuditLog[] = [
  { id: 'log_1_1', taskId: 'task_1', status: 'pending', statusText: '任务下发', operator: '总部运营部', time: '2026-06-01 09:00', comment: '请各店长认真落实' },
  { id: 'log_1_2', taskId: 'task_1', status: 'in_progress', statusText: '开始处理', operator: '张店长', time: '2026-06-02 10:30', comment: '已开始推进相关工作' }
];

const task3AuditLogs: AuditLog[] = [
  { id: 'log_3_1', taskId: 'task_3', status: 'pending', statusText: '任务下发', operator: '总部供应链部', time: '2026-06-05 10:00' },
  { id: 'log_3_2', taskId: 'task_3', status: 'in_progress', statusText: '开始处理', operator: '张店长', time: '2026-06-06 14:00' },
  { id: 'log_3_3', taskId: 'task_3', status: 'submitted', statusText: '已提交', operator: '张店长', time: '2026-06-08 16:30', comment: '已按要求完成报告' }
];

const task4FeedbackHistory: FeedbackVersion[] = [
  { version: 1, content: '已对冷藏设备进行检查，发现部分设备运行时间较长，计划调整开关机时间。', submitTime: '2026-06-08 11:00', status: 'returned' },
  { version: 2, content: '经过详细排查，主要原因是2号冷藏柜压缩机效率下降，已联系厂家安排维修，预计本周五完成。同时已调整其他设备的运行时间。', submitTime: '2026-06-10 09:30', status: 'submitted' }
];

const task4AuditLogs: AuditLog[] = [
  { id: 'log_4_1', taskId: 'task_4', status: 'pending', statusText: '任务下发', operator: '总部工程部', time: '2026-06-03 16:00', comment: '请尽快排查整改' },
  { id: 'log_4_2', taskId: 'task_4', status: 'in_progress', statusText: '开始处理', operator: '张店长', time: '2026-06-04 09:00' },
  { id: 'log_4_3', taskId: 'task_4', status: 'submitted', statusText: '已提交', operator: '张店长', time: '2026-06-08 11:00' },
  { id: 'log_4_4', taskId: 'task_4', status: 'returned', statusText: '已退回', operator: '李工(工程部)', time: '2026-06-09 14:20', comment: '整改方案不够具体，缺少时间节点和责任人' },
  { id: 'log_4_5', taskId: 'task_4', status: 'in_progress', statusText: '重新处理', operator: '张店长', time: '2026-06-09 16:00' }
];

const task5AuditLogs: AuditLog[] = [
  { id: 'log_5_1', taskId: 'task_5', status: 'pending', statusText: '任务下发', operator: '总部数据中心', time: '2026-06-02 09:30' },
  { id: 'log_5_2', taskId: 'task_5', status: 'in_progress', statusText: '开始处理', operator: '张店长', time: '2026-06-03 10:00' },
  { id: 'log_5_3', taskId: 'task_5', status: 'submitted', statusText: '已提交', operator: '张店长', time: '2026-06-05 17:00' },
  { id: 'log_5_4', taskId: 'task_5', status: 'completed', statusText: '已完成', operator: '王经理(数据中心)', time: '2026-06-06 10:00', comment: '数据完整，审核通过' }
];

export const taskList: Task[] = [
  {
    id: 'task_1',
    title: '6月门店节能优化专项行动',
    description: '为落实公司碳中和目标，要求各门店在6月完成以下工作：1. 全面检查照明系统，更换低效灯具；2. 优化空调温度设置，夏季不低于26℃；3. 建立设备开关机时间表。请各店长于6月20日前完成并提交反馈。',
    deadline: '2026-06-20 18:00',
    publisher: '总部运营部',
    priority: 'high',
    status: 'in_progress',
    createTime: '2026-06-01 09:00',
    auditLogs: task1AuditLogs,
    feedbackHistory: [],
    currentVersion: 0
  },
  {
    id: 'task_2',
    title: 'Q2节能数据复盘与Q3目标制定',
    description: '请各店于6月30日前完成Q2节能数据复盘，分析未达标原因，并制定Q3节能目标和具体行动计划。',
    deadline: '2026-06-30 23:59',
    publisher: '总部可持续发展部',
    priority: 'medium',
    status: 'pending',
    createTime: '2026-06-10 14:30',
    auditLogs: [{ id: 'log_2_1', taskId: 'task_2', status: 'pending', statusText: '任务下发', operator: '总部可持续发展部', time: '2026-06-10 14:30' }],
    feedbackHistory: [],
    currentVersion: 0
  },
  {
    id: 'task_3',
    title: '低碳包装推广落实情况检查',
    description: '总部要求5月起全面推行可降解包装，请各店提交当前包装使用情况、存在的问题及改进建议。',
    deadline: '2026-06-15 12:00',
    publisher: '总部供应链部',
    priority: 'medium',
    status: 'submitted',
    feedback: '已按要求提交本门店低碳包装推广落实情况报告，包括使用占比、供应商信息及改进建议。',
    createTime: '2026-06-05 10:00',
    auditLogs: task3AuditLogs,
    feedbackHistory: [{ version: 1, content: '已按要求提交本门店低碳包装推广落实情况报告，包括使用占比、供应商信息及改进建议。', submitTime: '2026-06-08 16:30', status: 'submitted' }],
    currentVersion: 1
  },
  {
    id: 'task_4',
    title: '设备能耗异常整改',
    description: '根据上月能耗监控数据，你店冷藏设备能耗异常偏高，请排查原因并制定整改方案。',
    deadline: '2026-06-12 18:00',
    publisher: '总部工程部',
    priority: 'high',
    status: 'returned',
    feedback: '经过详细排查，主要原因是2号冷藏柜压缩机效率下降，已联系厂家安排维修，预计本周五完成。同时已调整其他设备的运行时间。',
    returnReason: '整改方案不够具体，缺少时间节点和责任人',
    createTime: '2026-06-03 16:00',
    auditLogs: task4AuditLogs,
    feedbackHistory: task4FeedbackHistory,
    currentVersion: 2
  },
  {
    id: 'task_5',
    title: '5月节能行动数据补录',
    description: '请补录5月25日-31日的节能行动记录，确保数据完整。',
    deadline: '2026-06-08 18:00',
    publisher: '总部数据中心',
    priority: 'low',
    status: 'completed',
    feedback: '已完成5月最后一周的节能行动记录补录，共补录12条记录。',
    createTime: '2026-06-02 09:30',
    auditLogs: task5AuditLogs,
    feedbackHistory: [{ version: 1, content: '已完成5月最后一周的节能行动记录补录，共补录12条记录。', submitTime: '2026-06-05 17:00', status: 'approved' }],
    currentVersion: 1
  }
];

export const messageList: Message[] = [
  {
    id: 'msg_1',
    type: 'data_missing',
    title: '节能行动数据缺失提醒',
    content: '您负责的门店昨日（6月9日）未提交节能行动记录，请及时补录。',
    time: '今天 09:00',
    read: false,
    relatedId: 'action_fill',
    relatedType: 'action'
  },
  {
    id: 'msg_2',
    type: 'index_fluctuation',
    title: '能耗指标异常波动提醒',
    content: '贵店近3日日均能耗较上周上升15.8%，请关注并排查原因。',
    time: '今天 08:30',
    read: false,
    relatedId: 'compare_view',
    relatedType: 'action'
  },
  {
    id: 'msg_3',
    type: 'review_result',
    title: '节能行动审核结果通知',
    content: '您6月8日提交的「空调温度调整」行动记录已审核通过，预计减排5.8kg CO₂。',
    time: '昨天 17:20',
    read: true,
    relatedId: 'record_001',
    relatedType: 'record'
  },
  {
    id: 'msg_4',
    type: 'review_result',
    title: '节能行动审核退回通知',
    content: '您6月7日提交的「设备停用」记录被退回，原因：缺少照片凭证，请补充后重新提交。',
    time: '昨天 14:15',
    read: true,
    relatedId: 'record_002',
    relatedType: 'record'
  },
  {
    id: 'msg_5',
    type: 'data_missing',
    title: '月度数据完整性提醒',
    content: '本月您店数据完整率为85%，距离目标90%还有差距，请确保每日按时填报。',
    time: '3天前',
    read: true,
    relatedId: 'action_fill',
    relatedType: 'action'
  },
  {
    id: 'msg_6',
    type: 'index_fluctuation',
    title: '区域排名变化提醒',
    content: '贵店本周区域排名上升2位，目前位列第3名，继续保持！',
    time: '5天前',
    read: true,
    relatedId: 'compare_view',
    relatedType: 'action'
  },
  {
    id: 'msg_7',
    type: 'task_notice',
    title: '新任务通知',
    content: '总部下发新任务「Q2节能数据复盘与Q3目标制定」，请于6月30日前完成。',
    time: '2小时前',
    read: false,
    relatedId: 'task_2',
    relatedType: 'task'
  }
];

export const regions = ['全部', '北京东部', '北京西部', '北京中部'];
