import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import StatCard from '@/components/StatCard';
import TodoItem from '@/components/TodoItem';
import RankItem from '@/components/RankItem';
import ActionRecordCard from '@/components/ActionRecordCard';
import { rankList, actionTypes } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';
import type { StatCardData } from '@/types';

const HomePage: React.FC = () => {
  const {
    actionRecords,
    tasks,
    currentStoreName,
    getTodayActionCount,
    getMonthCarbonReduction,
    getPendingTaskCount
  } = useAppStore();

  usePullDownRefresh(() => {
    console.log('[Home] 下拉刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  useDidShow(() => {
    console.log('[Home] 页面显示，刷新数据');
  });

  const currentDate = useMemo(() => {
    const now = new Date();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${weekdays[now.getDay()]}`;
  }, []);

  const statCards = useMemo((): StatCardData[] => {
    const monthCarbon = getMonthCarbonReduction();
    const todayCount = getTodayActionCount();
    const pendingCount = getPendingTaskCount();
    const rank = 3;

    return [
      {
        icon: '🌱',
        label: '本月减排',
        value: monthCarbon.toFixed(1),
        unit: 'kg CO₂',
        trend: 12.5,
        trendText: '较上月'
      },
      {
        icon: '📝',
        label: '行动次数',
        value: String(actionRecords.length),
        unit: '次',
        trend: todayCount,
        trendText: '今日新增'
      },
      {
        icon: '✅',
        label: '完成率',
        value: '87',
        unit: '%',
        trend: 5.2,
        trendText: '较上周'
      },
      {
        icon: '🏆',
        label: '区域排名',
        value: `第${rank}`,
        unit: '名',
        trend: 2,
        trendText: '上升',
        isUpGood: true
      }
    ];
  }, [actionRecords, getMonthCarbonReduction, getTodayActionCount, getPendingTaskCount]);

  const pendingTodos = useMemo(() => {
    const filtered = tasks.filter(
      (t) => t.status === 'pending' || t.status === 'in_progress' || t.status === 'returned'
    );
    return filtered.slice(0, 3).map((t) => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      type: t.title.includes('设备') ? '设备' : '节能',
      deadline: t.deadline
    }));
  }, [tasks]);

  const recentRecords = useMemo(() => {
    return actionRecords.slice(0, 3);
  }, [actionRecords]);

  const handleQuickAction = (actionId: string) => {
    console.log('[Home] 点击快捷行动:', actionId);
    Taro.switchTab({ url: '/pages/action/index' });
  };

  const handleTodoClick = (taskId: string) => {
    console.log('[Home] 点击待办任务:', taskId);
    Taro.switchTab({ url: '/pages/task/index' });
  };

  const handleGoToReport = () => {
    console.log('[Home] 跳转填报页');
    Taro.switchTab({ url: '/pages/action/index' });
  };

  const handleSeeMoreRank = () => {
    console.log('[Home] 查看更多排名');
    Taro.switchTab({ url: '/pages/compare/index' });
  };

  const handleSeeAllRecords = () => {
    console.log('[Home] 查看全部记录');
    Taro.switchTab({ url: '/pages/action/index' });
  };

  const quickActions = actionTypes.slice(0, 4);

  return (
    <ScrollView className={styles.pageContainer} scrollY enhanced showScrollbar={false}>
      <View className={styles.header}>
        <View className={styles.storeInfo}>
          <Text className={styles.storeName}>{currentStoreName}</Text>
          <Text className={styles.dateText}>{currentDate}</Text>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.statsGrid}>
          {statCards.map((card, index) => (
            <StatCard key={card.label + index} data={card} />
          ))}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>快捷填报</Text>
          </View>
          <View className={styles.quickActions}>
            {quickActions.map((action) => (
              <View
                key={action.id}
                className={styles.quickActionItem}
                onClick={() => handleQuickAction(action.id)}
              >
                <View className={styles.quickActionIcon}>
                  <Text>{action.icon}</Text>
                </View>
                <Text className={styles.quickActionText}>{action.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              待办任务
              {getPendingTaskCount() > 0 && (
                <View className={styles.badge}>{getPendingTaskCount()}</View>
              )}
            </Text>
            <Text className={styles.sectionMore} onClick={() => handleTodoClick('')}>
              全部 ›
            </Text>
          </View>
          <View>
            {pendingTodos.length > 0 ? (
              pendingTodos.map((task) => (
                <TodoItem key={task.id} data={task} onClick={() => handleTodoClick(task.id)} />
              ))
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyText}>🎉 暂无待办任务，继续保持！</Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>最近行动</Text>
            <Text className={styles.sectionMore} onClick={handleSeeAllRecords}>
              全部 ›
            </Text>
          </View>
          <View>
            {recentRecords.length > 0 ? (
              recentRecords.map((record) => (
                <ActionRecordCard key={record.id} data={record} compact />
              ))
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyText}>暂无行动记录，快去填报吧~</Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.rankHeader}>
            <View>
              <Text className={styles.rankTitle}>区域排名</Text>
              <Text className={styles.rankSubtitle}> · 能耗强度排行</Text>
            </View>
            <Text className={styles.sectionMore} onClick={handleSeeMoreRank}>
              查看全部 ›
            </Text>
          </View>
          <View>
            {rankList.map((item) => (
              <RankItem
                key={item.storeId}
                data={item}
                isCurrentStore={item.storeId === 's003'}
              />
            ))}
          </View>
        </View>
      </View>

      <View className={styles.submitBtn} onClick={handleGoToReport}>
        <Text className={styles.submitBtnText}>立即填报节能行动</Text>
      </View>
    </ScrollView>
  );
};

export default HomePage;
