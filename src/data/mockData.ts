import type { StatCardData, ActionType, TodoTask, RankItem, StoreCompare, Task, Message, ShiftOption } from '@/types';

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
    type: '日常填报'
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
    carbonSaving: 234.5
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
    carbonSaving: 198.2
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
    carbonSaving: 167.8
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
    carbonSaving: 145.6
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
    carbonSaving: 132.4
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
    carbonSaving: 120.1
  }
];

export const taskList: Task[] = [
  {
    id: 'task_1',
    title: '6月门店节能优化专项行动',
    description: '为落实公司碳中和目标，要求各门店在6月完成以下工作：1. 全面检查照明系统，更换低效灯具；2. 优化空调温度设置，夏季不低于26℃；3. 建立设备开关机时间表。请各店长于6月20日前完成并提交反馈。',
    deadline: '2024-06-20 18:00',
    publisher: '总部运营部',
    priority: 'high',
    status: 'in_progress',
    createTime: '2024-06-01 09:00'
  },
  {
    id: 'task_2',
    title: 'Q2节能数据复盘与Q3目标制定',
    description: '请各店于6月30日前完成Q2节能数据复盘，分析未达标原因，并制定Q3节能目标和具体行动计划。',
    deadline: '2024-06-30 23:59',
    publisher: '总部可持续发展部',
    priority: 'medium',
    status: 'pending',
    createTime: '2024-06-10 14:30'
  },
  {
    id: 'task_3',
    title: '低碳包装推广落实情况检查',
    description: '总部要求5月起全面推行可降解包装，请各店提交当前包装使用情况、存在的问题及改进建议。',
    deadline: '2024-06-15 12:00',
    publisher: '总部供应链部',
    priority: 'medium',
    status: 'submitted',
    feedback: '已按要求提交本门店低碳包装推广落实情况报告，包括使用占比、供应商信息及改进建议。',
    createTime: '2024-06-05 10:00'
  },
  {
    id: 'task_4',
    title: '设备能耗异常整改',
    description: '根据上月能耗监控数据，你店冷藏设备能耗异常偏高，请排查原因并制定整改方案。',
    deadline: '2024-06-12 18:00',
    publisher: '总部工程部',
    priority: 'high',
    status: 'returned',
    feedback: '上次提交的整改方案不够具体，缺少设备型号、具体整改措施和时间节点，请补充完善后重新提交。',
    returnReason: '整改方案不够具体，缺少时间节点和责任人',
    createTime: '2024-06-03 16:00'
  },
  {
    id: 'task_5',
    title: '5月节能行动数据补录',
    description: '请补录5月25日-31日的节能行动记录，确保数据完整。',
    deadline: '2024-06-08 18:00',
    publisher: '总部数据中心',
    priority: 'low',
    status: 'completed',
    feedback: '已完成5月最后一周的节能行动记录补录，共补录12条记录。',
    createTime: '2024-06-02 09:30'
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
    relatedId: 'action_fill'
  },
  {
    id: 'msg_2',
    type: 'index_fluctuation',
    title: '能耗指标异常波动提醒',
    content: '贵店近3日日均能耗较上周上升15.8%，请关注并排查原因。',
    time: '今天 08:30',
    read: false,
    relatedId: 'compare_view'
  },
  {
    id: 'msg_3',
    type: 'review_result',
    title: '节能行动审核结果通知',
    content: '您6月8日提交的「空调温度调整」行动记录已审核通过，预计减排5.8kg CO₂。',
    time: '昨天 17:20',
    read: true,
    relatedId: 'record_001'
  },
  {
    id: 'msg_4',
    type: 'review_result',
    title: '节能行动审核退回通知',
    content: '您6月7日提交的「设备停用」记录被退回，原因：缺少照片凭证，请补充后重新提交。',
    time: '昨天 14:15',
    read: true,
    relatedId: 'record_002'
  },
  {
    id: 'msg_5',
    type: 'data_missing',
    title: '月度数据完整性提醒',
    content: '本月您店数据完整率为85%，距离目标90%还有差距，请确保每日按时填报。',
    time: '3天前',
    read: true,
    relatedId: 'action_fill'
  },
  {
    id: 'msg_6',
    type: 'index_fluctuation',
    title: '区域排名变化提醒',
    content: '贵店本周区域排名上升2位，目前位列第3名，继续保持！',
    time: '5天前',
    read: true,
    relatedId: 'compare_view'
  }
];

export const regions = ['全部', '北京东部', '北京西部', '北京中部'];
