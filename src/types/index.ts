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
}

export interface Message {
  id: string;
  type: 'data_missing' | 'index_fluctuation' | 'review_result';
  title: string;
  content: string;
  time: string;
  read: boolean;
  relatedId?: string;
}

export type ShiftType = 'morning' | 'afternoon' | 'night';

export interface ShiftOption {
  value: ShiftType;
  label: string;
  time: string;
}
