import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import StoreItem from '@/components/StoreItem';
import { storeCompareList, regions } from '@/data/mockData';
import type { StoreCompare } from '@/types';

type SortType = 'energy' | 'completion' | 'carbon';

const ComparePage: React.FC = () => {
  const [activeRegion, setActiveRegion] = useState('全部');
  const [sortType, setSortType] = useState<SortType>('energy');

  const filteredStores = useMemo(() => {
    let list: StoreCompare[] = [...storeCompareList];

    if (activeRegion !== '全部') {
      list = list.filter((store) => store.region === activeRegion);
    }

    switch (sortType) {
      case 'energy':
        list.sort((a, b) => a.energyIntensity - b.energyIntensity);
        break;
      case 'completion':
        list.sort((a, b) => b.completionRate - a.completionRate);
        break;
      case 'carbon':
        list.sort((a, b) => b.carbonReduction - a.carbonReduction);
        break;
    }

    return list;
  }, [activeRegion, sortType]);

  const summaryData = useMemo(() => {
    const list = filteredStores;
    if (list.length === 0) {
      return { avgEnergy: 0, avgCompletion: 0, totalStores: 0 };
    }
    const avgEnergy = list.reduce((sum, s) => sum + s.energyIntensity, 0) / list.length;
    const avgCompletion = list.reduce((sum, s) => sum + s.completionRate, 0) / list.length;
    return {
      avgEnergy: avgEnergy.toFixed(2),
      avgCompletion: avgCompletion.toFixed(1),
      totalStores: list.length
    };
  }, [filteredStores]);

  const handleRegionChange = (region: string) => {
    console.log('[Compare] 切换区域:', region);
    setActiveRegion(region);
  };

  const handleSortChange = (type: SortType) => {
    console.log('[Compare] 切换排序:', type);
    setSortType(type);
  };

  const sortOptions = [
    { key: 'energy', label: '能耗强度' },
    { key: 'completion', label: '完成率' },
    { key: 'carbon', label: '减排量' }
  ];

  return (
    <ScrollView className={styles.pageContainer} scrollY enhanced showScrollbar={false}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>门店对比</Text>
        <Text className={styles.headerSubtitle}>查看区域内门店能耗排名与优秀做法</Text>
      </View>

      <ScrollView
        className={styles.regionTabs}
        scrollX
        enhanced
        showScrollbar={false}
      >
        {regions.map((region) => (
          <View
            key={region}
            className={classnames(styles.regionTab, activeRegion === region && styles.active)}
            onClick={() => handleRegionChange(region)}
          >
            {region}
          </View>
        ))}
      </ScrollView>

      <View className={styles.content}>
        <View className={styles.summaryCard}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{summaryData.totalStores}</Text>
            <Text className={styles.summaryLabel}>门店数量</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{summaryData.avgEnergy}</Text>
            <Text className={styles.summaryLabel}>平均能耗强度</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{summaryData.avgCompletion}%</Text>
            <Text className={styles.summaryLabel}>平均完成率</Text>
          </View>
        </View>

        <View className={styles.sectionTitle}>
          <Text>🏆</Text>
          <Text>门店排名</Text>
        </View>

        <View className={styles.sortBar}>
          {sortOptions.map((option) => (
            <View
              key={option.key}
              className={classnames(styles.sortItem, sortType === option.key && styles.active)}
              onClick={() => handleSortChange(option.key as SortType)}
            >
              <Text>{option.label}</Text>
              <Text className={styles.sortIcon}>↕</Text>
            </View>
          ))}
        </View>

        <View className={styles.storeList}>
          {filteredStores.length > 0 ? (
            filteredStores.map((store, index) => (
              <StoreItem
                key={store.id}
                data={store}
                rank={index + 1}
                isCurrentStore={store.id === 's003'}
              />
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text>暂无数据</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ComparePage;
