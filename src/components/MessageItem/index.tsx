import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { Message } from '@/types';
import { getMessageTypeIcon, getMessageTypeText } from '@/utils';

interface MessageItemProps {
  data: Message;
  onClick?: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ data, onClick }) => {
  const { title, content, time, read, type } = data;
  const icon = getMessageTypeIcon(type);
  const typeText = getMessageTypeText(type);

  const typeColorMap: Record<string, string> = {
    data_missing: '#FF7D00',
    index_fluctuation: '#165DFF',
    review_result: '#00B42A'
  };
  const typeColor = typeColorMap[type] || '#86909C';

  return (
    <View
      className={classnames(styles.messageItem, !read && styles.unread)}
      onClick={onClick}
    >
      {!read && <View className={styles.unreadDot} />}
      <View className={styles.messageIcon} style={{ backgroundColor: `${typeColor}15` }}>
        <Text className={styles.icon}>{icon}</Text>
      </View>
      <View className={styles.messageContent}>
        <View className={styles.messageHeader}>
          <Text className={styles.messageTitle}>{title}</Text>
          <View
            className={styles.typeTag}
            style={{ backgroundColor: `${typeColor}15`, color: typeColor }}
          >
            {typeText}
          </View>
        </View>
        <Text className={styles.messageText}>{content}</Text>
        <Text className={styles.messageTime}>{time}</Text>
      </View>
    </View>
  );
};

export default MessageItem;
