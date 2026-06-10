import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import StatCard from '@/components/StatCard';
import TodoItem from '@/components/TodoItem';
import RankItem from '@/components/RankItem';
import { statCards, todoTasks, rankList, actionTypes } from '@/data/mockData';

const HomePage: React.FC = () => {
  const [currentDate] = useState('2024年6月10日 星期一');

  usePullDownRefresh(() => {
    console.log('[Home] 下拉刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

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

  const quickActions = actionTypes.slice(0, 4);

  return (
    <ScrollView className={styles.pageContainer} scrollY enhanced showScrollbar={false}>
      <View className={styles.header}>
        <View className={styles.storeInfo}>
          <Text className={styles.storeName}>国贸商城店</Text>
          <Text className={styles.dateText}>{currentDate}</Text>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.statsGrid}>
          {statCards.map((card) => (
            <StatCard key={card.label} data={card} />
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
            <Text className={styles.sectionTitle}>待办任务</Text>
            <Text className={styles.sectionMore} onClick={() => handleTodoClick('')}>
              全部 ›
            </Text>
          </View>
          <View>
            {todoTasks.slice(0, 3).map((task) => (
              <TodoItem key={task.id} data={task} onClick={() => handleTodoClick(task.id)} />
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.rankHeader}>
            <View>
              <Text className={styles.rankTitle}>区域排名</Text>
              <Text className={styles.rankSubtitle}>  能耗强度排行</Text>
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
