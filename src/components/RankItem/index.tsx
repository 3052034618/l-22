import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { RankItem as RankItemType } from '@/types';

interface RankItemProps {
  data: RankItemType;
  isCurrentStore?: boolean;
}

const RankItem: React.FC<RankItemProps> = ({ data, isCurrentStore = false }) => {
  const { rank, storeName, value, unit, change, changeType } = data;

  const getRankClass = () => {
    if (rank === 1) return styles.rank1;
    if (rank === 2) return styles.rank2;
    if (rank === 3) return styles.rank3;
    return '';
  };

  return (
    <View className={classnames(styles.rankItem, isCurrentStore && styles.currentStore)}>
      <View className={classnames(styles.rankNum, getRankClass())}>
        {rank}
      </View>
      <View className={styles.storeInfo}>
        <Text className={styles.storeName}>{storeName}</Text>
        <View className={styles.valueRow}>
          <Text className={styles.value}>{value}</Text>
          <Text className={styles.unit}>{unit}</Text>
        </View>
      </View>
      <View className={classnames(styles.change, changeType === 'up' && styles.changeUp, changeType === 'down' && styles.changeDown)}>
        {changeType === 'up' ? '↑' : '↓'}{change}
      </View>
    </View>
  );
};

export default RankItem;
