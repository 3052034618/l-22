import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { MonthlyDashboardData } from '@/types';

interface MonthlyDashboardProps {
  data: MonthlyDashboardData;
  onClick?: () => void;
}

const MonthlyDashboard: React.FC<MonthlyDashboardProps> = ({ data, onClick }) => {
  const { totalCarbonSaving, actionCount, taskCompletionRate, categoryBreakdown, exceptions } = data;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.showToast({ title: '查看详细数据', icon: 'none' });
    }
  };

  const getCategoryColorClass = (category: string): string => {
    switch (category) {
      case 'lighting': return styles.catLighting;
      case 'equipment': return styles.catEquipment;
      case 'packaging': return styles.catPackaging;
      case 'exception': return styles.catException;
      default: return styles.catLighting;
    }
  };

  const maxCount = Math.max(...categoryBreakdown.map(c => c.count), 1);

  return (
    <View className={styles.dashboardCard} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <View className={styles.headerLeft}>
          <Text className={styles.cardTitle}>📊 本月看板</Text>
          <Text className={styles.cardSubtitle}>数据概览</Text>
        </View>
        <View className={styles.moreBtn}>
          <Text className={styles.moreText}>查看详情 ›</Text>
        </View>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{totalCarbonSaving.toFixed(1)}</Text>
          <Text className={styles.statUnit}>kg CO₂</Text>
          <Text className={styles.statLabel}>累计减排</Text>
        </View>
        <View className={styles.statDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{actionCount}</Text>
          <Text className={styles.statUnit}>次</Text>
          <Text className={styles.statLabel}>行动次数</Text>
        </View>
        <View className={styles.statDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{taskCompletionRate}</Text>
          <Text className={styles.statUnit}>%</Text>
          <Text className={styles.statLabel}>任务完成率</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>行动类型占比</Text>
        <View className={styles.categoryList}>
          {categoryBreakdown.map((cat) => (
            <View key={cat.category} className={styles.categoryItem}>
              <View className={styles.categoryInfo}>
                <View className={classnames(styles.categoryDot, getCategoryColorClass(cat.category))} />
                <Text className={styles.categoryName}>{cat.name}</Text>
                <Text className={styles.categoryCount}>{cat.count}次</Text>
              </View>
              <View className={styles.categoryBar}>
                <View
                  className={classnames(styles.categoryBarFill, getCategoryColorClass(cat.category))}
                  style={{ width: `${(cat.count / maxCount) * 100}%` }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {exceptions.length > 0 && (
        <View className={styles.section}>
          <View className={styles.sectionTitleRow}>
            <Text className={styles.sectionTitle}>异常提醒</Text>
            <View className={styles.exceptionBadge}>{exceptions.length}</View>
          </View>
          <View className={styles.exceptionList}>
            {exceptions.slice(0, 2).map((ex) => (
              <View key={ex.id} className={styles.exceptionItem}>
                <View className={classnames(
                  styles.exceptionLevel,
                  ex.level === 'high' && styles.levelHigh,
                  ex.level === 'medium' && styles.levelMedium,
                  ex.level === 'low' && styles.levelLow
                )} />
                <View className={styles.exceptionContent}>
                  <Text className={styles.exceptionTitle}>{ex.title}</Text>
                  <Text className={styles.exceptionDesc}>{ex.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default MonthlyDashboard;
