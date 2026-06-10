import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { StatCardData } from '@/types';

interface StatCardProps {
  data: StatCardData;
  size?: 'normal' | 'large';
}

const StatCard: React.FC<StatCardProps> = ({ data, size = 'normal' }) => {
  const { label, value, unit, change, changeType, icon, trend, trendText, isUpGood } = data;

  const useNewFormat = trend !== undefined;

  const getTrendIcon = (): string => {
    if (!useNewFormat) return changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '';
    const isUp = trend && trend > 0;
    return isUp ? '↑' : '↓';
  };

  const getTrendValue = (): string => {
    if (!useNewFormat) return change || '';
    if (typeof trend === 'number') {
      return Math.abs(trend).toString();
    }
    return String(trend || '');
  };

  const getTrendClass = (): string => {
    if (!useNewFormat) {
      if (changeType === 'up') return styles.changeUp;
      if (changeType === 'down') return styles.changeDown;
      return '';
    }
    const isUp = trend && trend > 0;
    const isGood = isUpGood ? isUp : !isUp;
    return isGood ? styles.changeUp : styles.changeDown;
  };

  const getTrendLabel = (): string => {
    if (!useNewFormat) return '较上月';
    return trendText || '';
  };

  const hasTrend = useNewFormat ? trend !== undefined : !!change;

  return (
    <View className={classnames(styles.statCard, size === 'large' && styles.large)}>
      <View className={styles.cardHeader}>
        <Text className={styles.icon}>{icon}</Text>
        <Text className={styles.label}>{label}</Text>
      </View>
      <View className={styles.cardBody}>
        <Text className={styles.value}>{value}</Text>
        <Text className={styles.unit}>{unit}</Text>
      </View>
      {hasTrend && (
        <View className={styles.cardFooter}>
          <Text
            className={classnames(
              styles.change,
              getTrendClass()
            )}
          >
            {getTrendIcon()} {getTrendValue()}
          </Text>
          <Text className={styles.changeLabel}>{getTrendLabel()}</Text>
        </View>
      )}
    </View>
  );
};

export default StatCard;
