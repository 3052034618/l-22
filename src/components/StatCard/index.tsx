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
  const { label, value, unit, change, changeType, icon } = data;

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
      {change && (
        <View className={styles.cardFooter}>
          <Text
            className={classnames(
              styles.change,
              changeType === 'up' && styles.changeUp,
              changeType === 'down' && styles.changeDown
            )}
          >
            {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : ''} {change}
          </Text>
          <Text className={styles.changeLabel}>较上月</Text>
        </View>
      )}
    </View>
  );
};

export default StatCard;
