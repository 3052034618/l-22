import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import MessageItem from '@/components/MessageItem';
import { useAppStore } from '@/store/useAppStore';
import type { Message } from '@/types';

type TabType = 'all' | 'data_missing' | 'index_fluctuation' | 'review_result';

const tabs: { key: TabType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'data_missing', label: '数据缺失' },
  { key: 'index_fluctuation', label: '指标波动' },
  { key: 'review_result', label: '审核结果' }
];

const MessagePage: React.FC = () => {
  const { messages, markMessageRead, markAllMessagesRead } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  useDidShow(() => {
    console.log('[Message] 页面显示');
  });

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
    console.log('[Message] 点击消息:', message.id, message.title, '类型:', message.type);

    if (!message.read) {
      markMessageRead(message.id);
    }

    navigateByMessageType(message);
  };

  const navigateByMessageType = (message: Message) => {
    const { type, relatedId } = message;

    switch (type) {
      case 'data_missing':
        Taro.showModal({
          title: message.title,
          content: message.content + '\n\n是否立即去补填？',
          confirmText: '去补填',
          cancelText: '稍后',
          success: (res) => {
            if (res.confirm) {
              Taro.switchTab({ url: '/pages/action/index' });
            }
          }
        });
        break;

      case 'review_result':
        Taro.showModal({
          title: message.title,
          content: message.content,
          confirmText: '查看详情',
          cancelText: '关闭',
          success: (res) => {
            if (res.confirm) {
              if (relatedId && relatedId.startsWith('task_')) {
                Taro.switchTab({ url: '/pages/task/index' });
              } else if (relatedId && relatedId.startsWith('record_')) {
                Taro.switchTab({ url: '/pages/action/index' });
              } else {
                Taro.switchTab({ url: '/pages/task/index' });
              }
            }
          }
        });
        break;

      case 'index_fluctuation':
        Taro.showModal({
          title: message.title,
          content: message.content + '\n\n是否查看门店对比？',
          confirmText: '去查看',
          cancelText: '关闭',
          success: (res) => {
            if (res.confirm) {
              Taro.switchTab({ url: '/pages/compare/index' });
            }
          }
        });
        break;

      default:
        Taro.showModal({
          title: message.title,
          content: message.content,
          showCancel: false,
          confirmText: '我知道了'
        });
    }
  };

  const handleMarkAllRead = () => {
    console.log('[Message] 全部标为已读');
    markAllMessagesRead();
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
                <Text className={styles.tabText}>{tab.label}</Text>
                {count > 0 && (
                  <View className={styles.tabBadge}>{count > 99 ? '99+' : count}</View>
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
            <Text>全部标为已读</Text>
          </View>
        )}

        {filteredMessages.length > 0 ? (
          <View className={styles.messageList}>
            {filteredMessages.map((msg) => (
              <MessageItem
                key={msg.id}
                data={msg}
                onClick={() => handleMessageClick(msg)}
              />
            ))}
          </View>
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
