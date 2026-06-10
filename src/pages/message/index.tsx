import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import MessageItem from '@/components/MessageItem';
import { messageList } from '@/data/mockData';
import type { Message } from '@/types';

type TabType = 'all' | 'data_missing' | 'index_fluctuation' | 'review_result';

const tabs: { key: TabType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'data_missing', label: '数据缺失' },
  { key: 'index_fluctuation', label: '指标波动' },
  { key: 'review_result', label: '审核结果' }
];

const MessagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [messages, setMessages] = useState<Message[]>(messageList);

  const filteredMessages = useMemo(() => {
    if (activeTab === 'all') return messages;
    return messages.filter((msg) => msg.type === activeTab);
  }, [messages, activeTab]);

  const unreadCount = useMemo(() => {
    return messages.filter((msg) => !msg.read).length;
  }, [messages]);

  const handleTabClick = (tab: TabType) => {
    console.log('[Message] 切换标签:', tab);
    setActiveTab(tab);
  };

  const handleMessageClick = (message: Message) => {
    console.log('[Message] 点击消息:', message.id, message.title);
    if (!message.read) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, read: true } : msg
        )
      );
    }

    Taro.showModal({
      title: message.title,
      content: message.content,
      showCancel: false,
      confirmText: '我知道了'
    });
  };

  const handleMarkAllRead = () => {
    console.log('[Message] 全部标为已读');
    setMessages((prev) => prev.map((msg) => ({ ...msg, read: true })));
    Taro.showToast({ title: '已全部标为已读', icon: 'success' });
  };

  const getTabUnreadCount = (tabKey: TabType): number => {
    if (tabKey === 'all') return unreadCount;
    return messages.filter((msg) => msg.type === tabKey && !msg.read).length;
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>消息中心</Text>
        <View className={styles.headerStats}>
          <View className={styles.headerStatItem}>
            <Text className={styles.headerStatValue}>{messages.length}</Text>
            <Text className={styles.headerStatLabel}>条消息</Text>
          </View>
          <View className={styles.headerStatItem}>
            <Text className={styles.headerStatValue}>{unreadCount}</Text>
            <Text className={styles.headerStatLabel}>条未读</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabsContainer}>
        <View className={styles.tabsRow}>
          {tabs.map((tab) => {
            const count = getTabUnreadCount(tab.key);
            return (
              <View
                key={tab.key}
                className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
                onClick={() => handleTabClick(tab.key)}
              >
                {tab.label}
                {count > 0 && (
                  <View className={styles.tabBadge}>{count}</View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      <ScrollView
        className={styles.content}
        scrollY
        enhanced
        showScrollbar={false}
      >
        {filteredMessages.length > 0 && unreadCount > 0 && activeTab === 'all' && (
          <View className={styles.markAllRead} onClick={handleMarkAllRead}>
            全部标为已读
          </View>
        )}

        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <MessageItem
              key={msg.id}
              data={msg}
              onClick={() => handleMessageClick(msg)}
            />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📭</Text>
            <Text className={styles.emptyText}>暂无相关消息</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MessagePage;
