import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { storeCompareList } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';
import type { StoreCompare, GoodPractice } from '@/types';

const StoreDetailPage: React.FC = () => {
  const router = useRouter();
  const { toggleFavoritePractice, isPracticeFavorite, addMessage, addActionRecord } = useAppStore();
  const [storeId, setStoreId] = useState('');
  const [activeTab, setActiveTab] = useState<'energy' | 'completion'>('energy');

  useEffect(() => {
    const id = router.params.id || 's001';
    setStoreId(id);
    console.log('[StoreDetail] 门店ID:', id);
  }, [router.params]);

  const storeInfo = useMemo((): StoreCompare | undefined => {
    return storeCompareList.find((s) => s.storeId === storeId);
  }, [storeId]);

  useDidShow(() => {
    if (storeInfo) {
      Taro.setNavigationBarTitle({ title: storeInfo.storeName });
    }
  });

  const energyTrendData = storeInfo?.energyTrend || [];
  const completionTrendData = storeInfo?.completionTrend || [];
  const goodPractices = storeInfo?.goodPractices || [];

  const maxEnergyValue = useMemo(() => {
    if (energyTrendData.length === 0) return 100;
    return Math.max(...energyTrendData.map((d) => Math.max(d.value, d.baseline)));
  }, [energyTrendData]);

  if (!storeInfo) {
    return (
      <View className={styles.pageContainer}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyText}>加载中...</Text>
        </View>
      </View>
    );
  }

  const getRankClass = (rank: number): string => {
    if (rank === 1) return styles.rankGold;
    if (rank === 2) return styles.rankSilver;
    if (rank === 3) return styles.rankBronze;
    return '';
  };

  const handleToggleFavorite = (practice: GoodPractice) => {
    console.log('[StoreDetail] 切换收藏:', practice.id);
    toggleFavoritePractice(practice.id);
    
    const isFav = isPracticeFavorite(practice.id);
    Taro.showToast({
      title: isFav ? '已取消收藏' : '已收藏',
      icon: 'none',
      duration: 1500
    });
  };

  const handleCreateLearningTask = (practice: GoodPractice) => {
    console.log('[StoreDetail] 生成学习任务:', practice.id, practice.title);
    
    Taro.showModal({
      title: '生成学习任务',
      content: `是否基于「${practice.title}」生成本店学习任务？`,
      confirmText: '生成',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '学习任务已生成',
            icon: 'success',
            duration: 1500
          });
          
          setTimeout(() => {
            Taro.switchTab({ url: '/pages/task/index' });
          }, 1000);
        }
      }
    });
  };

  return (
    <ScrollView className={styles.pageContainer} scrollY enhanced showScrollbar={false}>
      <View className={styles.header}>
        <View className={styles.headerContent}>
          <View className={styles.storeHeader}>
            <View className={classnames(styles.rankBadge, getRankClass(storeInfo.rank || 99))}>
              {storeInfo.rank}
            </View>
            <View className={styles.storeInfo}>
              <Text className={styles.storeName}>{storeInfo.storeName}</Text>
              <Text className={styles.storeRegion}>📍 {storeInfo.region}区域</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.statsCard}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{storeInfo.energyIntensity}</Text>
            <Text className={styles.statUnit}>kWh/㎡</Text>
            <Text className={styles.statLabel}>能耗强度</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue} style={{ color: '#00B42A' }}>{storeInfo.completionRate}%</Text>
            <Text className={styles.statUnit}></Text>
            <Text className={styles.statLabel}>完成率</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue} style={{ color: '#FF7D00' }}>{storeInfo.carbonSaving || storeInfo.carbonReduction}</Text>
            <Text className={styles.statUnit}>kg</Text>
            <Text className={styles.statLabel}>累计减排</Text>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>数据趋势</Text>
          </View>
          <View className={styles.trendTabs}>
            <View
              className={classnames(styles.trendTab, activeTab === 'energy' && styles.active)}
              onClick={() => setActiveTab('energy')}
            >
              <Text className={styles.trendTabText}>能耗趋势</Text>
            </View>
            <View
              className={classnames(styles.trendTab, activeTab === 'completion' && styles.active)}
              onClick={() => setActiveTab('completion')}
            >
              <Text className={styles.trendTabText}>完成率变化</Text>
            </View>
          </View>

          {activeTab === 'energy' ? (
            <View className={styles.chartContainer}>
              <View className={styles.chartLegend}>
                <View className={styles.legendItem}>
                  <View className={classnames(styles.legendDot, styles.legendPrimary)} />
                  <Text className={styles.legendText}>实际能耗</Text>
                </View>
                <View className={styles.legendItem}>
                  <View className={classnames(styles.legendDot, styles.legendSecondary)} />
                  <Text className={styles.legendText}>基准值</Text>
                </View>
              </View>
              <View className={styles.barChart}>
                {energyTrendData.map((item, index) => (
                  <View key={index} className={styles.barGroup}>
                    <View className={styles.bars}>
                      <View
                        className={classnames(styles.bar, styles.barPrimary)}
                        style={{ height: `${(item.value / maxEnergyValue) * 100}%` }}
                      >
                        <Text className={styles.barValue}>{item.value}</Text>
                      </View>
                      <View
                        className={classnames(styles.bar, styles.barSecondary)}
                        style={{ height: `${(item.baseline / maxEnergyValue) * 100}%` }}
                      />
                    </View>
                    <Text className={styles.barLabel}>{item.month}</Text>
                  </View>
                ))}
              </View>
              <View className={styles.chartNote}>
                <Text className={styles.chartNoteText}>💡 连续6个月能耗呈下降趋势，节能效果显著</Text>
              </View>
            </View>
          ) : (
            <View className={styles.chartContainer}>
              <View className={styles.lineChart}>
                <View className={styles.lineChartGrid}>
                  {[100, 75, 50, 25, 0].map((val, i) => (
                    <View key={i} className={styles.gridLine}>
                      <Text className={styles.gridLabel}>{val}%</Text>
                      <View className={styles.gridLineBar} />
                    </View>
                  ))}
                </View>
                <View className={styles.lineChartBars}>
                  {completionTrendData.map((item, index) => (
                    <View key={index} className={styles.lineBarGroup}>
                      <View
                        className={styles.lineBar}
                        style={{ height: `${item.value}%` }}
                      />
                      <Text className={styles.lineBarLabel}>{item.month}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {completionTrendData.length > 0 && (
                <View className={styles.completionHighlight}>
                  <Text className={styles.highlightLabel}>本月完成率</Text>
                  <Text className={styles.highlightValue}>
                    {completionTrendData[completionTrendData.length - 1].value}%
                  </Text>
                  <Text className={styles.highlightTrend}>
                    ↑ 较上月提升 {
                      completionTrendData.length > 1
                        ? completionTrendData[completionTrendData.length - 1].value - completionTrendData[completionTrendData.length - 2].value
                        : 0
                    } 个百分点
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>优秀做法</Text>
            <Text className={styles.sectionBadge}>{goodPractices.length}项</Text>
          </View>
          <View className={styles.practicesList}>
            {goodPractices.map((practice) => {
              const isFav = isPracticeFavorite(practice.id);
              return (
                <View key={practice.id} className={styles.practiceCard}>
                  <View className={styles.practiceHeader}>
                    <Text className={styles.practiceTitle}>{practice.title}</Text>
                    <View className={styles.practiceCategory}>
                      {practice.category}
                    </View>
                  </View>
                  <Text className={styles.practiceDesc}>{practice.description}</Text>
                  <View className={styles.practiceEffect}>
                    <Text className={styles.effectIcon}>✨</Text>
                    <Text className={styles.effectText}>{practice.effect}</Text>
                  </View>
                  <View className={styles.practiceActions}>
                    <View
                      className={classnames(styles.actionBtn, styles.favBtn, isFav && styles.faved)}
                      onClick={() => handleToggleFavorite(practice)}
                    >
                      <Text className={styles.actionBtnIcon}>{isFav ? '⭐' : '☆'}</Text>
                      <Text className={styles.actionBtnText}>{isFav ? '已收藏' : '收藏'}</Text>
                    </View>
                    <View
                      className={classnames(styles.actionBtn, styles.learnBtn)}
                      onClick={() => handleCreateLearningTask(practice)}
                    >
                      <Text className={styles.actionBtnIcon}>📚</Text>
                      <Text className={styles.actionBtnText}>生成学习任务</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>门店信息</Text>
          </View>
          <View className={styles.infoList}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>门店类型</Text>
              <Text className={styles.infoValue}>标准店</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>门店面积</Text>
              <Text className={styles.infoValue}>280 ㎡</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>营业时间</Text>
              <Text className={styles.infoValue}>10:00 - 22:00</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>员工人数</Text>
              <Text className={styles.infoValue}>15 人</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>店长</Text>
              <Text className={styles.infoValue}>张经理</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.bottomSpace} />
    </ScrollView>
  );
};

export default StoreDetailPage;
