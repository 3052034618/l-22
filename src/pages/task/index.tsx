import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import TaskItem from '@/components/TaskItem';
import { useAppStore } from '@/store/useAppStore';
import type { Task, AuditLog, FeedbackVersion } from '@/types';

const formatDateTime = (): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
};

type TabType = 'all' | 'pending' | 'in_progress' | 'submitted' | 'returned' | 'completed';

const tabs: { key: TabType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处理' },
  { key: 'in_progress', label: '进行中' },
  { key: 'submitted', label: '审核中' },
  { key: 'returned', label: '已退回' },
  { key: 'completed', label: '已完成' }
];

const TaskPage: React.FC = () => {
  const { tasks, updateTaskStatus, addTaskFeedbackVersion } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  useDidShow(() => {
    console.log('[Task] 页面显示');
  });

  const filteredTasks = useMemo(() => {
    if (activeTab === 'all') return tasks;
    return tasks.filter((task) => task.status === activeTab);
  }, [tasks, activeTab]);

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      inProgress: tasks.filter((t) => t.status === 'in_progress').length,
      returned: tasks.filter((t) => t.status === 'returned').length,
      submitted: tasks.filter((t) => t.status === 'submitted').length,
      completed: tasks.filter((t) => t.status === 'completed').length
    };
  }, [tasks]);

  const handleTabClick = (tab: TabType) => {
    console.log('[Task] 切换标签:', tab);
    setActiveTab(tab);
  };

  const handleTaskSubmit = (taskId: string, feedback: string) => {
    console.log('[Task] 提交任务反馈:', taskId, feedback);
    Taro.showLoading({ title: '提交中...' });

    setTimeout(() => {
      Taro.hideLoading();
      
      const task = tasks.find((t) => t.id === taskId);
      const nextVersion = (task?.currentVersion || 0) + 1;
      
      const auditLog: AuditLog = {
        id: `audit_${Date.now()}`,
        status: 'submitted',
        statusText: '已提交',
        operator: '店长',
        time: formatDateTime(),
        comment: '提交任务反馈'
      };
      
      const feedbackVersion: FeedbackVersion = {
        version: nextVersion,
        content: feedback,
        submitTime: formatDateTime(),
        status: 'submitted'
      };
      
      addTaskFeedbackVersion(taskId, feedbackVersion);
      updateTaskStatus(taskId, 'submitted', feedback, auditLog);
      
      Taro.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1500
      });
    }, 800);
  };

  const handleTaskResubmit = (taskId: string, feedback: string) => {
    console.log('[Task] 重新提交任务反馈:', taskId, feedback);
    Taro.showLoading({ title: '提交中...' });

    setTimeout(() => {
      Taro.hideLoading();
      
      const task = tasks.find((t) => t.id === taskId);
      const nextVersion = (task?.currentVersion || 0) + 1;
      
      const auditLog: AuditLog = {
        id: `audit_${Date.now()}`,
        status: 'submitted',
        statusText: '重新提交',
        operator: '店长',
        time: formatDateTime(),
        comment: '补充完善后重新提交'
      };
      
      const feedbackVersion: FeedbackVersion = {
        version: nextVersion,
        content: feedback,
        submitTime: formatDateTime(),
        status: 'submitted'
      };
      
      addTaskFeedbackVersion(taskId, feedbackVersion);
      updateTaskStatus(taskId, 'submitted', feedback, auditLog);
      
      Taro.showToast({
        title: '重新提交成功',
        icon: 'success',
        duration: 1500
      });
    }, 800);
  };

  const handleTaskStart = (taskId: string) => {
    console.log('[Task] 开始处理任务:', taskId);
    
    const auditLog: AuditLog = {
      id: `audit_${Date.now()}`,
      status: 'in_progress',
      statusText: '开始处理',
      operator: '店长',
      time: formatDateTime(),
      comment: '店长开始处理任务'
    };
    
    updateTaskStatus(taskId, 'in_progress', undefined, auditLog);
    
    Taro.showToast({
      title: '已开始处理',
      icon: 'none'
    });
  };

  const getBadgeCount = (tabKey: TabType): number => {
    switch (tabKey) {
      case 'pending':
        return tasks.filter((t) => t.status === 'pending').length;
      case 'in_progress':
        return tasks.filter((t) => t.status === 'in_progress').length;
      case 'returned':
        return tasks.filter((t) => t.status === 'returned').length;
      case 'submitted':
        return tasks.filter((t) => t.status === 'submitted').length;
      default:
        return 0;
    }
  };

  const pendingTotal = taskStats.pending + taskStats.inProgress + taskStats.returned;

  return (
    <View className={styles.pageContainer}>
      <View className={styles.tabsContainer}>
        <ScrollView
          className={styles.tabsScroll}
          scrollX
          enhanced
          showScrollbar={false}
        >
          {tabs.map((tab) => {
            const badgeCount = getBadgeCount(tab.key);
            return (
              <View
                key={tab.key}
                className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
                onClick={() => handleTabClick(tab.key)}
              >
                <Text className={styles.tabText}>{tab.label}</Text>
                {badgeCount > 0 && (
                  <View className={styles.tabBadge}>{badgeCount}</View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        className={styles.content}
        scrollY
        enhanced
        showScrollbar={false}
      >
        <View className={styles.statsBar}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{taskStats.total}</Text>
            <Text className={styles.statLabel}>全部任务</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue} style={{ color: '#FF7D00' }}>{pendingTotal}</Text>
            <Text className={styles.statLabel}>待处理</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue} style={{ color: '#F53F3F' }}>{taskStats.returned}</Text>
            <Text className={styles.statLabel}>已退回</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue} style={{ color: '#00B42A' }}>{taskStats.completed}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
        </View>

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              data={task}
              onSubmit={handleTaskSubmit}
              onResubmit={handleTaskResubmit}
              onStart={handleTaskStart}
            />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无相关任务</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TaskPage;
