import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { ActionType } from '@/types';
import { getCategoryColor } from '@/utils';

interface ActionTypeCardProps {
  data: ActionType;
  selected?: boolean;
  onClick?: () => void;
}

const ActionTypeCard: React.FC<ActionTypeCardProps> = ({ data, selected = false, onClick }) => {
  const { name, icon, description, carbonSaving, category } = data;
  const categoryColor = getCategoryColor(category);

  return (
    <View
      className={classnames(styles.actionCard, selected && styles.selected)}
      style={{ borderColor: selected ? categoryColor : 'transparent' }}
      onClick={onClick}
    >
      <View className={styles.cardIcon} style={{ backgroundColor: `${categoryColor}15` }}>
        <Text className={styles.icon}>{icon}</Text>
      </View>
      <View className={styles.cardContent}>
        <Text className={styles.name}>{name}</Text>
        <Text className={styles.description}>{description}</Text>
      </View>
      <View className={styles.cardFooter}>
        {carbonSaving > 0 && (
          <View className={styles.carbonTag} style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}>
            <Text>预计减排 {carbonSaving}kg CO₂</Text>
          </View>
        )}
      </View>
      {selected && (
        <View className={styles.selectedBadge} style={{ backgroundColor: categoryColor }}>
          <Text className={styles.selectedIcon}>✓</Text>
        </View>
      )}
    </View>
  );
};

export default ActionTypeCard;
