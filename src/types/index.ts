export interface StatCardData {
  label: string;
  value: string;
  unit: string;
  icon?: string;
  trend?: number;
  trendText?: string;
  isUpGood?: boolean;
  change?: string;
  changeType?: 'up' | 'down' | 'flat';
}

export interface ActionType {
  id: string;
  name: string;
  icon: string;
  category: 'lighting' | 'equipment' | 'packaging' | 'exception';
  description: string;
  carbonSaving: number;
}

export interface ActionRecord {
  id: string;
  typeId: string;
  typeName: string;
  category: string;
  shift: 'morning' | 'afternoon' | 'night';
  shiftName: string;
  description: string;
  photos: string[];
  carbonSaving: number;
  createTime: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface TodoTask {
  id: string;
  title: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  type: string;
  isDaily?: boolean;
}

export interface RankItem {
  rank: number;
  storeName: string;
  storeId: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'up' | 'down';
}

export interface StoreCompare {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  region: string;
  rank?: number;
  energyIntensity: number;
  completionRate: number;
  bestPractice: string;
  carbonReduction: number;
  carbonSaving?: number;
  energyTrend?: { month: string; value: number; baseline: number }[];
  completionTrend?: { month: string; value: number }[];
  goodPractices?: GoodPractice[];
}

export interface AuditLog {
  id: string;
  taskId: string;
  status: string;
  statusText: string;
  operator: string;
  time: string;
  comment?: string;
}

export interface FeedbackVersion {
  version: number;
  content: string;
  submitTime: string;
  status: 'submitted' | 'returned' | 'approved';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  publisher: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'submitted' | 'returned' | 'completed';
  feedback?: string;
  returnReason?: string;
  createTime: string;
  auditLogs?: AuditLog[];
  feedbackHistory?: FeedbackVersion[];
  currentVersion?: number;
}

export interface Message {
  id: string;
  type: 'data_missing' | 'index_fluctuation' | 'review_result' | 'task_notice';
  title: string;
  content: string;
  time: string;
  read: boolean;
  relatedId?: string;
  relatedType?: 'action' | 'task' | 'record';
}

export type ShiftType = 'morning' | 'afternoon' | 'night';

export interface ShiftOption {
  value: ShiftType;
  label: string;
  time: string;
}

export interface WeeklyData {
  week: string;
  carbonSaving: number;
  actionCount: number;
  taskCompletion: number;
}

export interface MonthlyDashboardData {
  totalCarbonSaving: number;
  actionCount: number;
  taskCompletionRate: number;
  categoryBreakdown: { category: string; name: string; count: number; carbonSaving: number }[];
  weeklyTrend: WeeklyData[];
  exceptions: { id: string; title: string; desc: string; level: 'high' | 'medium' | 'low' }[];
}

export interface GoodPractice {
  id: string;
  storeId: string;
  title: string;
  description: string;
  effect: string;
  category: string;
  isFavorite?: boolean;
}
