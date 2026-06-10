import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import TaskItem from '@/components/TaskItem';
import { taskList } from '@/data/mockData';
import type { Task } from '@/types';

type TabType = 'all' | 'pending' | 'in_progress' | 'submitted' | 'returned' | 'completed';

const tabs: { key: TabType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处理' },
  { key: 'in_progress', label: '进行中' },
  { key: 'submitted', label: '已提交' },
  { key: 'returned', label: '已退回' },
  { key: 'completed', label: '已完成' }
];

const TaskPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [tasks, setTasks] = useState<Task[]>(taskList);

  const filteredTasks = useMemo(() => {
    if (activeTab === 'all') return tasks;
    return tasks.filter((task) => task.status === activeTab);
  }, [tasks, activeTab]);

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').length,
      returned: tasks.filter((t) => t.status === 'returned').length,
      completed: tasks.filter((t) => t.status === 'completed').length
    };
  }, [tasks]);

  const handleTabClick = (tab: TabType) => {
    console.log('[Task] 切换标签:', tab);
    setActiveTab(tab);
  };

  const handleTaskSubmit = (taskId: string, feedback: string) => {
    console.log('[Task] 提交任务反馈:', taskId, feedback);
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: 'submitted', feedback }
          : task
      )
    );
  };

  const getBadgeCount = (tabKey: TabType): number => {
    switch (tabKey) {
      case 'pending':
        return tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').length;
      case 'returned':
        return tasks.filter((t) => t.status === 'returned').length;
      default:
        return 0;
    }
  };

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
                {tab.label}
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
            <Text className={styles.statValue}>{taskStats.pending}</Text>
            <Text className={styles.statLabel}>待处理</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{taskStats.returned}</Text>
            <Text className={styles.statLabel}>已退回</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{taskStats.completed}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
        </View>

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              data={task}
              onSubmit={handleTaskSubmit}
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
