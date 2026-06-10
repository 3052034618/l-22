export const formatNumber = (num: number, decimals: number = 1): string => {
  return num.toFixed(decimals);
};

export const getPriorityColor = (priority: string): string => {
  const colorMap: Record<string, string> = {
    high: '#F53F3F',
    medium: '#FF7D00',
    low: '#00B42A'
  };
  return colorMap[priority] || '#86909C';
};

export const getPriorityText = (priority: string): string => {
  const textMap: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  };
  return textMap[priority] || '';
};

export const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    pending: '待处理',
    in_progress: '进行中',
    submitted: '已提交',
    returned: '已退回',
    completed: '已完成',
    approved: '已通过',
    rejected: '已退回'
  };
  return textMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: '#FF7D00',
    in_progress: '#165DFF',
    submitted: '#00B42A',
    returned: '#F53F3F',
    completed: '#00B42A',
    approved: '#00B42A',
    rejected: '#F53F3F'
  };
  return colorMap[status] || '#86909C';
};

export const getMessageTypeIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    data_missing: '📋',
    index_fluctuation: '📊',
    review_result: '✅'
  };
  return iconMap[type] || '📢';
};

export const getMessageTypeText = (type: string): string => {
  const textMap: Record<string, string> = {
    data_missing: '数据缺失',
    index_fluctuation: '指标波动',
    review_result: '审核结果'
  };
  return textMap[type] || '';
};

export const getCategoryName = (category: string): string => {
  const nameMap: Record<string, string> = {
    lighting: '照明空调',
    equipment: '设备管理',
    packaging: '低碳包装',
    exception: '异常说明'
  };
  return nameMap[category] || '';
};

export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    lighting: '#FF7D00',
    equipment: '#165DFF',
    packaging: '#00B42A',
    exception: '#F53F3F'
  };
  return colorMap[category] || '#86909C';
};
