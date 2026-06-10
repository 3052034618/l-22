import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import type { ActionRecord, Task, Message } from '@/types';
import { taskList as initialTaskList, messageList as initialMessageList } from '@/data/mockData';

interface AppState {
  actionRecords: ActionRecord[];
  tasks: Task[];
  messages: Message[];
  currentStoreId: string;
  currentStoreName: string;

  addActionRecord: (record: ActionRecord) => void;
  updateTaskStatus: (taskId: string, status: Task['status'], feedback?: string) => void;
  markMessageRead: (messageId: string) => void;
  markAllMessagesRead: () => void;
  addMessage: (message: Message) => void;
  getUnreadMessageCount: () => number;
  getPendingTaskCount: () => number;
  getTodayActionCount: () => number;
  getMonthCarbonReduction: () => number;
}

const taroStorage = {
  getItem: (name: string) => {
    try {
      const value = Taro.getStorageSync(name);
      return value || null;
    } catch (e) {
      console.error('[Storage] getItem error:', e);
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      Taro.setStorageSync(name, value);
    } catch (e) {
      console.error('[Storage] setItem error:', e);
    }
  },
  removeItem: (name: string) => {
    try {
      Taro.removeStorageSync(name);
    } catch (e) {
      console.error('[Storage] removeItem error:', e);
    }
  },
};

const initialActionRecords: ActionRecord[] = [
  {
    id: 'record_001',
    typeId: 'lighting_2',
    typeName: '空调温度调整',
    shift: 'morning',
    shiftName: '早班',
    description: '今日客流较少，将空调温度从24℃调高至26℃，既保证舒适度又节约能耗。',
    photos: [],
    carbonSaving: 5.8,
    createTime: '2024-06-10 09:30',
    status: 'approved'
  },
  {
    id: 'record_002',
    typeId: 'equipment_1',
    typeName: '设备停用',
    shift: 'night',
    shiftName: '晚班',
    description: '闭店后关闭了非必要设备电源，包括展示柜照明、次要区域空调等。',
    photos: [],
    carbonSaving: 8.2,
    createTime: '2024-06-09 22:15',
    status: 'approved'
  },
  {
    id: 'record_003',
    typeId: 'packaging_1',
    typeName: '低碳包装使用',
    shift: 'afternoon',
    shiftName: '中班',
    description: '今日外卖订单全部使用可降解打包袋，共使用约120个。',
    photos: [],
    carbonSaving: 1.2,
    createTime: '2024-06-09 16:45',
    status: 'pending'
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      actionRecords: initialActionRecords,
      tasks: initialTaskList,
      messages: initialMessageList,
      currentStoreId: 's003',
      currentStoreName: '国贸商城店',

      addActionRecord: (record) => {
        console.log('[Store] 添加行动记录:', record.id, record.typeName);
        set((state) => ({
          actionRecords: [record, ...state.actionRecords]
        }));

        const newMsg: Message = {
          id: `msg_${Date.now()}`,
          type: 'review_result',
          title: '节能行动提交成功',
          content: `您提交的「${record.typeName}」行动记录已提交，等待审核。预计减排${record.carbonSaving}kg CO₂。`,
          time: '刚刚',
          read: false,
          relatedId: record.id
        };
        get().addMessage(newMsg);
      },

      updateTaskStatus: (taskId, status, feedback) => {
        console.log('[Store] 更新任务状态:', taskId, status);
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, status, feedback: feedback || task.feedback }
              : task
          )
        }));

        if (status === 'submitted') {
          const task = get().tasks.find((t) => t.id === taskId);
          if (task) {
            const newMsg: Message = {
              id: `msg_task_${Date.now()}`,
              type: 'review_result',
              title: '任务反馈已提交',
              content: `您提交的任务「${task.title}」反馈已提交，等待审核。`,
              time: '刚刚',
              read: false,
              relatedId: taskId
            };
            get().addMessage(newMsg);
          }
        }

        if (status === 'returned') {
          const task = get().tasks.find((t) => t.id === taskId);
          if (task) {
            const newMsg: Message = {
              id: `msg_return_${Date.now()}`,
              type: 'review_result',
              title: '任务反馈被退回',
              content: `您提交的任务「${task.title}」被退回，请补充完善后重新提交。`,
              time: '刚刚',
              read: false,
              relatedId: taskId
            };
            get().addMessage(newMsg);
          }
        }
      },

      markMessageRead: (messageId) => {
        console.log('[Store] 标记消息已读:', messageId);
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        }));
      },

      markAllMessagesRead: () => {
        console.log('[Store] 全部标为已读');
        set((state) => ({
          messages: state.messages.map((msg) => ({ ...msg, read: true }))
        }));
      },

      addMessage: (message) => {
        console.log('[Store] 添加消息:', message.id, message.title);
        set((state) => ({
          messages: [message, ...state.messages]
        }));
      },

      getUnreadMessageCount: () => {
        return get().messages.filter((msg) => !msg.read).length;
      },

      getPendingTaskCount: () => {
        return get().tasks.filter(
          (t) => t.status === 'pending' || t.status === 'in_progress' || t.status === 'returned'
        ).length;
      },

      getTodayActionCount: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().actionRecords.filter((r) => r.createTime.includes(today)).length;
      },

      getMonthCarbonReduction: () => {
        const records = get().actionRecords;
        return records.reduce((sum, r) => sum + r.carbonSaving, 0);
      }
    }),
    {
      name: 'carbon-neutral-app-storage',
      storage: createJSONStorage(() => taroStorage),
      partialize: (state) => ({
        actionRecords: state.actionRecords,
        tasks: state.tasks,
        messages: state.messages,
        currentStoreId: state.currentStoreId,
        currentStoreName: state.currentStoreName
      }),
    }
  )
);
