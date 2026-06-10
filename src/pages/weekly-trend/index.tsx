import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ActionRecordCard from '@/components/ActionRecordCard';
import { useAppStore } from '@/store/useAppStore';

const WeeklyTrendPage: React.FC = () => {
  const { actionRecords, getWeeklyTrend, getActionCategoryBreakdown, getTaskCompletionRate } = useAppStore();
  const [selectedWeek, setSelectedWeek] = useState<number>(0);

  const weeklyData = useMemo(() => getWeeklyTrend(), [getWeeklyTrend]);
  const categoryBreakdown = useMemo(() => getActionCategoryBreakdown(), [getActionCategoryBreakdown]);
  const taskCompletionRate = useMemo(() => getTaskCompletionRate(), [getTaskCompletionRate]);

  const weekRecords = useMemo(() => {
    if (actionRecords.length === 0) return [];
    
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - selectedWeek * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() - 6);
    
    const startStr = weekEnd.toISOString().split('T')[0];
    const endStr = weekStart.toISOString().split('T')[0];
    
    return actionRecords.filter((r) => {
      const dateStr = r.createTime.split(' ')[0];
      return dateStr >= startStr && dateStr <= endStr;
    });
  }, [actionRecords, selectedWeek]);

  const weekLabels = useMemo(() => {
    const labels = ['本周', '上周', '上上周'];
    return labels;
  }, []);

  const currentWeekData = weeklyData[selectedWeek] || weeklyData[0];

  useDidShow(() => {
    Taro.setNavigationBarTitle({ title: '周趋势详情' });
  });

  const maxCarbonValue = useMemo(() => {
    if (weeklyData.length === 0) return 10;
    return Math.max(...weeklyData.map((d) => d.carbonSaving)) * 1.2;
  }, [weeklyData]);

  return (
    <ScrollView className={styles.pageContainer} scrollY enhanced showScrollbar={false}>
      <View className={styles.headerCard}>
        <View className={styles.headerTitle}>
          <Text className={styles.headerTitleText}>本月减排进度</Text>
        </View>
        <View className={styles.headerStats}>
          <View className={styles.headerStat}>
            <Text className={styles.headerStatValue}>{currentWeekData?.carbonSaving || 0} kg</Text>
            <Text className={styles.headerStatLabel}>本周减排</Text>
          </View>
          <View className={styles.headerStat}>
            <Text className={styles.headerStatValue}>{currentWeekData?.actionCount || 0} 次</Text>
            <Text className={styles.headerStatLabel}>行动次数</Text>
          </View>
          <View className={styles.headerStat}>
            <Text className={styles.headerStatValue}>{currentWeekData?.taskCompletion || 0}%</Text>
            <Text className={styles.headerStatLabel}>任务完成率</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>周减排趋势</Text>
        </View>
        <View className={styles.weekTabs}>
          {weeklyData.slice(0, 3).map((week, index) => (
            <View
              key={index}
              className={classnames(styles.weekTab, selectedWeek === index && styles.active)}
              onClick={() => setSelectedWeek(index)}
            >
              <Text className={styles.weekTabText}>{weekLabels[index]}</Text>
            </View>
          ))}
        </View>

        <View className={styles.trendChart}>
          {weeklyData.slice(0, 4).map((week, index) => (
            <View key={index} className={styles.trendBarGroup}>
              <View className={styles.trendBar}>
                <View
                  className={classnames(styles.trendBarFill, selectedWeek === index && styles.active)}
                  style={{ height: `${(week.carbonSaving / maxCarbonValue) * 100}%` }}
                >
                  <Text className={styles.trendBarValue}>{week.carbonSaving}</Text>
                </View>
              </View>
              <Text className={styles.trendBarLabel}>{week.week}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>行动类型分布</Text>
        </View>
        <View className={styles.categoryList}>
          {categoryBreakdown.map((cat, index) => (
            <View key={index} className={styles.categoryItem}>
              <View className={styles.categoryInfo}>
                <Text className={styles.categoryName}>{cat.name}</Text>
                <Text className={styles.categoryCount}>{cat.count} 次</Text>
              </View>
              <View className={styles.categoryBar}>
                <View
                  className={styles.categoryBarFill}
                  style={{
                    width: `${categoryBreakdown.length > 0 ? (cat.count / Math.max(...categoryBreakdown.map(c => c.count))) * 100 : 0}%`,
                    backgroundColor: ['#00B42A', '#165DFF', '#FF7D00', '#F53F3F'][index % 4]
                  }}
                />
              </View>
              <Text className={styles.categoryCarbon}>减排 {cat.carbonSaving.toFixed(1)} kg</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>本周行动记录</Text>
          <Text className={styles.sectionCount}>{weekRecords.length} 条</Text>
        </View>
        {weekRecords.length > 0 ? (
          <View className={styles.recordList}>
            {weekRecords.map((record) => (
              <ActionRecordCard key={record.id} data={record} compact />
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyText}>本周暂无行动记录</Text>
          </View>
        )}
      </View>

      <View className={styles.bottomSpace} />
    </ScrollView>
  );
};

export default WeeklyTrendPage;
