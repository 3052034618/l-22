import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import type { TodoTask } from '@/types';
import { getPriorityColor, getPriorityText } from '@/utils';

interface TodoItemProps {
  data: TodoTask;
  onClick?: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ data, onClick }) => {
  const { title, deadline, priority, type } = data;

  return (
    <View className={styles.todoItem} onClick={onClick}>
      <View className={styles.todoContent}>
        <View className={styles.todoHeader}>
          <Text className={styles.title}>{title}</Text>
          <View
            className={styles.priorityTag}
            style={{ backgroundColor: `${getPriorityColor(priority)}15`, color: getPriorityColor(priority) }}
          >
            {getPriorityText(priority)}优先
          </View>
        </View>
        <View className={styles.todoFooter}>
          <Text className={styles.type}>{type}</Text>
          <Text className={styles.deadline}>截止：{deadline}</Text>
        </View>
      </View>
      <Text className={styles.arrow}>›</Text>
    </View>
  );
};

export default TodoItem;
