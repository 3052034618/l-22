import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { StoreCompare } from '@/types';

interface StoreItemProps {
  data: StoreCompare;
  rank: number;
  isCurrentStore?: boolean;
}

const StoreItem: React.FC<StoreItemProps> = ({ data, rank, isCurrentStore = false }) => {
  const { name, region, energyIntensity, completionRate, bestPractice, carbonReduction } = data;

  const getRankBadgeClass = () => {
    if (rank === 1) return styles.rankBadge1;
    if (rank === 2) return styles.rankBadge2;
    if (rank === 3) return styles.rankBadge3;
    return '';
  };

  return (
    <View className={classnames(styles.storeItem, isCurrentStore && styles.current)}>
      <View className={styles.storeHeader}>
        <View className={classnames(styles.rankBadge, getRankBadgeClass())}>
          <Text className={classnames(styles.rankText, rank <= 3 && styles.rankTextTop)}>{rank}</Text>
        </View>
        <View className={styles.storeInfo}>
          <Text className={styles.storeName}>
            {name}
            {isCurrentStore && <Text className={styles.currentTag}>本店</Text>}
          </Text>
          <Text className={styles.region}>{region}</Text>
        </View>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{energyIntensity}</Text>
          <Text className={styles.statLabel}>能耗强度 (kWh/㎡)</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{completionRate}%</Text>
          <Text className={styles.statLabel}>完成率</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{carbonReduction}</Text>
          <Text className={styles.statLabel}>减排 (kg)</Text>
        </View>
      </View>

      <View className={styles.practiceSection}>
        <View className={styles.practiceLabel}>
          <Text className={styles.practiceIcon}>✨</Text>
          <Text>优秀做法</Text>
        </View>
        <Text className={styles.practiceText}>{bestPractice}</Text>
      </View>

      <View className={styles.progressBar}>
        <View className={styles.progressFill} style={{ width: `${completionRate}%` }} />
      </View>
    </View>
  );
};

export default StoreItem;
