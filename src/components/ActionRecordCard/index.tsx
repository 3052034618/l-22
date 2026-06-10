import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { ActionRecord } from '@/types';
import { getStatusText, getStatusColor } from '@/utils';

interface ActionRecordCardProps {
  data: ActionRecord;
  onClick?: () => void;
  compact?: boolean;
}

const ActionRecordCard: React.FC<ActionRecordCardProps> = ({ data, onClick, compact = false }) => {
  const { typeName, shiftName, description, photos, carbonSaving, createTime, status } = data;
  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status);

  const getIconByTypeName = (name: string): string => {
    if (name.includes('照明') || name.includes('空调')) return '💡';
    if (name.includes('设备') || name.includes('维护')) return '🔌';
    if (name.includes('包装') || name.includes('回收')) return '📦';
    if (name.includes('异常')) return '⚠️';
    return '🌱';
  };

  if (compact) {
    return (
      <View className={styles.compactCard} onClick={onClick}>
        <View className={styles.compactIcon}>
          <Text>{getIconByTypeName(typeName)}</Text>
        </View>
        <View className={styles.compactContent}>
          <View className={styles.compactHeader}>
            <Text className={styles.typeName}>{typeName}</Text>
            <View
              className={styles.statusTagSmall}
              style={{ backgroundColor: `${statusColor}15`, color: statusColor }}
            >
              {statusText}
            </View>
          </View>
          <View className={styles.compactMeta}>
            <Text className={styles.metaText}>{shiftName} · {createTime}</Text>
          </View>
        </View>
        <View className={styles.compactCarbon}>
          <Text className={styles.carbonValue}>-{carbonSaving}</Text>
          <Text className={styles.carbonUnit}>kg CO₂</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.recordCard} onClick={onClick}>
      <View className={styles.cardHeader}>
        <View className={styles.iconWrapper}>
          <Text className={styles.icon}>{getIconByTypeName(typeName)}</Text>
        </View>
        <View className={styles.headerContent}>
          <View className={styles.headerTop}>
            <Text className={styles.typeName}>{typeName}</Text>
            <View
              className={styles.statusTag}
              style={{ backgroundColor: `${statusColor}15`, color: statusColor }}
            >
              {statusText}
            </View>
          </View>
          <View className={styles.headerMeta}>
            <Text className={styles.metaItem}>🕐 {shiftName}</Text>
            <Text className={styles.metaItem}>📅 {createTime}</Text>
          </View>
        </View>
      </View>

      <View className={styles.cardBody}>
        <Text className={styles.description}>{description}</Text>
      </View>

      {photos && photos.length > 0 && (
        <View className={styles.photoRow}>
          {photos.slice(0, 4).map((photo, index) => (
            <Image
              key={index}
              className={styles.photoThumb}
              src={photo}
              mode="aspectFill"
            />
          ))}
          {photos.length > 4 && (
            <View className={styles.photoMore}>
              <Text className={styles.photoMoreText}>+{photos.length - 4}</Text>
            </View>
          )}
        </View>
      )}

      <View className={styles.cardFooter}>
        <View className={styles.carbonInfo}>
          <Text className={styles.carbonLabel}>预计减排</Text>
          <View className={styles.carbonValueWrap}>
            <Text className={styles.carbonValue}>{carbonSaving}</Text>
            <Text className={styles.carbonUnit}>kg CO₂</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ActionRecordCard;
