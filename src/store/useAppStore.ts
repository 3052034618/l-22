import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import type { ActionRecord, Task, Message, GoodPractice, AuditLog, FeedbackVersion } from '@/types';
import { taskList as initialTaskList, messageList as initialMessageList } from '@/data/mockData';

interface AppState {
  actionRecords: ActionRecord[];
  tasks: Task[];
  messages: Message[];
  currentStoreId: string;
  currentStoreName: string;
  favoritePractices: string[];
  dailyTaskCompleted: Record<string, boolean>;

  addActionRecord: (record: ActionRecord) => void;
  updateTaskStatus: (taskId: string, status: Task['status'], feedback?: string, auditLog?: AuditLog) => void;
  addTaskFeedbackVersion: (taskId: string, version: FeedbackVersion) => void;
  markMessageRead: (messageId: string) => void;
  markAllMessagesRead: () => void;
  markMessagesReadByIds: (ids: string[]) => void;
  addMessage: (message: Message) => void;
  toggleFavoritePractice: (practiceId: string) => void;
  markDailyTaskComplete: (date: string) => void;
  getUnreadMessageCount: () => number;
  getPendingTaskCount: () => number;
  getTodayActionCount: () => number;
  getMonthCarbonReduction: () => number;
  getActionCategoryBreakdown: () => { category: string; name: string; count: number; carbonSaving: number }[];
  getWeeklyTrend: () => { week: string; carbonSaving: number; actionCount: number; taskCompletion: number }[];
  getTaskCompletionRate: () => number;
  isDailyTaskCompleted: () => boolean;
  isPracticeFavorite: (practiceId: string) => boolean;
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
    category: 'lighting',
    shift: 'morning',
    shiftName: '早班',
    description: '今日客流较少，将空调温度从24℃调高至26℃，既保证舒适度又节约能耗。',
    photos: [],
    carbonSaving: 5.8,
    createTime: '2026-06-10 09:30',
    status: 'approved'
  },
  {
    id: 'record_002',
    typeId: 'equipment_1',
    typeName: '设备停用',
    category: 'equipment',
    shift: 'night',
    shiftName: '晚班',
    description: '闭店后关闭了非必要设备电源，包括展示柜照明、次要区域空调等。',
    photos: [],
    carbonSaving: 8.2,
    createTime: '2026-06-09 22:15',
    status: 'approved'
  },
  {
    id: 'record_003',
    typeId: 'packaging_1',
    typeName: '低碳包装使用',
    category: 'packaging',
    shift: 'afternoon',
    shiftName: '中班',
    description: '今日外卖订单全部使用可降解打包袋，共使用约120个。',
    photos: [],
    carbonSaving: 1.2,
    createTime: '2026-06-09 16:45',
    status: 'pending'
  },
  {
    id: 'record_004',
    typeId: 'lighting_1',
    typeName: '照明灯具调整',
    category: 'lighting',
    shift: 'morning',
    shiftName: '早班',
    description: '根据自然光亮度，关闭了部分照明灯具，保持店内舒适照度。',
    photos: [],
    carbonSaving: 3.5,
    createTime: '2026-06-08 10:20',
    status: 'approved'
  },
  {
    id: 'record_005',
    typeId: 'exception_1',
    typeName: '异常能耗说明',
    category: 'exception',
    shift: 'afternoon',
    shiftName: '中班',
    description: '下午3点空调故障维修，导致能耗临时上升，已处理完毕。',
    photos: [],
    carbonSaving: 0,
    createTime: '2026-06-07 15:30',
    status: 'approved'
  }
];

const categoryNameMap: Record<string, string> = {
  lighting: '照明空调',
  equipment: '设备管理',
  packaging: '低碳包装',
  exception: '异常说明'
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      actionRecords: initialActionRecords,
      tasks: initialTaskList,
      messages: initialMessageList,
      currentStoreId: 's003',
      currentStoreName: '国贸商城店',
      favoritePractices: [],
      dailyTaskCompleted: {},

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
          relatedId: record.id,
          relatedType: 'record'
        };
        get().addMessage(newMsg);

        const today = new Date().toISOString().split('T')[0];
        const todayRecords = get().actionRecords.filter(r => r.createTime.includes(today));
        if (todayRecords.length >= 1) {
          get().markDailyTaskComplete(today);
        }
      },

      updateTaskStatus: (taskId, status, feedback, auditLog) => {
        console.log('[Store] 更新任务状态:', taskId, status);
        set((state) => {
          const tasks = state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            
            const newAuditLogs = [...(task.auditLogs || [])];
            if (auditLog) {
              newAuditLogs.push(auditLog);
            }
            
            return {
              ...task,
              status,
              feedback: feedback !== undefined ? feedback : task.feedback,
              auditLogs: newAuditLogs
            };
          });
          return { tasks };
        });

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
              relatedId: taskId,
              relatedType: 'task'
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
              relatedId: taskId,
              relatedType: 'task'
            };
            get().addMessage(newMsg);
          }
        }

        if (status === 'completed') {
          const task = get().tasks.find((t) => t.id === taskId);
          if (task) {
            const newMsg: Message = {
              id: `msg_complete_${Date.now()}`,
              type: 'review_result',
              title: '任务已完成',
              content: `您的任务「${task.title}」已审核通过，任务完成！`,
              time: '刚刚',
              read: false,
              relatedId: taskId,
              relatedType: 'task'
            };
            get().addMessage(newMsg);
          }
        }
      },

      addTaskFeedbackVersion: (taskId, version) => {
        console.log('[Store] 添加任务反馈版本:', taskId, version.version);
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const history = [...(task.feedbackHistory || [])];
            history.push(version);
            return {
              ...task,
              feedbackHistory: history,
              currentVersion: version.version
            };
          })
        }));
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

      markMessagesReadByIds: (ids) => {
        console.log('[Store] 批量标记已读:', ids.length, '条');
        set((state) => ({
          messages: state.messages.map((msg) =>
            ids.includes(msg.id) ? { ...msg, read: true } : msg
          )
        }));
      },

      addMessage: (message) => {
        console.log('[Store] 添加消息:', message.id, message.title);
        set((state) => ({
          messages: [message, ...state.messages]
        }));
      },

      toggleFavoritePractice: (practiceId) => {
        console.log('[Store] 切换收藏:', practiceId);
        set((state) => {
          const favorites = [...state.favoritePractices];
          const index = favorites.indexOf(practiceId);
          if (index > -1) {
            favorites.splice(index, 1);
          } else {
            favorites.push(practiceId);
          }
          return { favoritePractices: favorites };
        });
      },

      markDailyTaskComplete: (date) => {
        console.log('[Store] 标记每日任务完成:', date);
        set((state) => ({
          dailyTaskCompleted: {
            ...state.dailyTaskCompleted,
            [date]: true
          }
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
      },

      getActionCategoryBreakdown: () => {
        const records = get().actionRecords;
        const breakdown: Record<string, { category: string; name: string; count: number; carbonSaving: number }> = {};

        records.forEach((r) => {
          const cat = r.category || 'lighting';
          if (!breakdown[cat]) {
            breakdown[cat] = {
              category: cat,
              name: categoryNameMap[cat] || cat,
              count: 0,
              carbonSaving: 0
            };
          }
          breakdown[cat].count += 1;
          breakdown[cat].carbonSaving += r.carbonSaving;
        });

        return Object.values(breakdown).sort((a, b) => b.carbonSaving - a.carbonSaving);
      },

      getWeeklyTrend: () => {
        const records = get().actionRecords;
        const tasks = get().tasks;
        const weeks = ['第1周', '第2周', '第3周', '第4周'];
        
        return weeks.map((week, index) => {
          const weekRecords = records.filter((_, i) => i % 4 === index % 4);
          const carbonSaving = weekRecords.reduce((sum, r) => sum + r.carbonSaving, 0) || (index + 1) * 3.5;
          const actionCount = weekRecords.length || index + 2;
          const taskCompletion = Math.min(100, 60 + index * 10);
          
          return {
            week,
            carbonSaving: Math.round(carbonSaving * 10) / 10,
            actionCount,
            taskCompletion
          };
        });
      },

      getTaskCompletionRate: () => {
        const tasks = get().tasks;
        if (tasks.length === 0) return 0;
        const completed = tasks.filter((t) => t.status === 'completed').length;
        return Math.round((completed / tasks.length) * 100);
      },

      isDailyTaskCompleted: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().dailyTaskCompleted[today] === true;
      },

      isPracticeFavorite: (practiceId) => {
        return get().favoritePractices.includes(practiceId);
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
        currentStoreName: state.currentStoreName,
        favoritePractices: state.favoritePractices,
        dailyTaskCompleted: state.dailyTaskCompleted
      }),
    }
  )
);
