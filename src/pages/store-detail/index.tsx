import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { storeCompareList } from '@/data/mockData';
import type { StoreCompare } from '@/types';

const energyTrendData = [
  { month: '1月', value: 85, baseline: 100 },
  { month: '2月', value: 82, baseline: 98 },
  { month: '3月', value: 78, baseline: 95 },
  { month: '4月', value: 75, baseline: 92 },
  { month: '5月', value: 70, baseline: 88 },
  { month: '6月', value: 67, baseline: 85 },
];

const completionTrendData = [
  { month: '1月', value: 65 },
  { month: '2月', value: 72 },
  { month: '3月', value: 78 },
  { month: '4月', value: 82 },
  { month: '5月', value: 85 },
  { month: '6月', value: 92 },
];

const goodPractices = [
  {
    id: 1,
    title: '智能照明控制系统',
    description: '安装人体感应传感器和光照传感器，实现人来灯亮、人走灯灭，根据自然光照自动调节灯光亮度。',
    effect: '月度节电约 15%',
    category: '照明空调'
  },
  {
    id: 2,
    title: '空调温度智能管理',
    description: '夏季设置26℃基准温度，根据客流密度和室外温度动态调整，高峰时段提前预冷。',
    effect: '月度空调节能约 12%',
    category: '照明空调'
  },
  {
    id: 3,
    title: '设备定时巡检制度',
    description: '建立每日设备巡检台账，及时发现并处理设备异常运行，避免无效能耗。',
    effect: '设备运行效率提升 8%',
    category: '设备管理'
  },
  {
    id: 4,
    title: '全员节能竞赛',
    description: '开展班组节能竞赛，设立月度节能之星奖项，激发员工节能积极性。',
    effect: '全员节能意识显著提升',
    category: '管理创新'
  }
];

const StoreDetailPage: React.FC = () => {
  const router = useRouter();
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

  const maxEnergyValue = useMemo(() => {
    return Math.max(...energyTrendData.map((d) => Math.max(d.value, d.baseline)));
  }, []);

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

  return (
    <ScrollView className={styles.pageContainer} scrollY enhanced showScrollbar={false}>
      <View className={styles.header}>
        <View className={styles.headerContent}>
          <View className={styles.storeHeader}>
            <View className={classnames(styles.rankBadge, getRankClass(storeInfo.rank))}>
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
            <Text className={styles.statValue} style={{ color: '#FF7D00' }}>{storeInfo.carbonSaving}</Text>
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
              <View className={styles.completionHighlight}>
                <Text className={styles.highlightLabel}>本月完成率</Text>
                <Text className={styles.highlightValue}>92%</Text>
                <Text className={styles.highlightTrend}>↑ 较上月提升 7 个百分点</Text>
              </View>
            </View>
          )}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>优秀做法</Text>
            <Text className={styles.sectionBadge}>{goodPractices.length}项</Text>
          </View>
          <View className={styles.practicesList}>
            {goodPractices.map((practice) => (
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
              </View>
            ))}
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
