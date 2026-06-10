import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { Task } from '@/types';
import { getStatusText, getStatusColor } from '@/utils';

interface TaskItemProps {
  data: Task;
  onSubmit?: (taskId: string, feedback: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ data, onSubmit }) => {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState(data.feedback || '');
  const [isEditing, setIsEditing] = useState(false);

  const { title, description, deadline, publisher, status, returnReason, createTime } = data;
  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleFeedbackChange = (e: any) => {
    setFeedback(e.detail.value);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setFeedback(data.feedback || '');
  };

  const handleSubmit = () => {
    if (!feedback.trim()) {
      Taro.showToast({ title: '请输入反馈内容', icon: 'none' });
      return;
    }
    console.log('[Task] 提交任务反馈:', data.id, feedback);
    if (onSubmit) {
      onSubmit(data.id, feedback);
    }
    setIsEditing(false);
    setExpanded(false);
    Taro.showToast({ title: '提交成功', icon: 'success' });
  };

  const canSubmit = status === 'pending' || status === 'in_progress' || status === 'returned';
  const showEditBtn = (status === 'submitted' || status === 'returned') && !isEditing;

  return (
    <View className={styles.taskCard}>
      <View className={styles.taskHeader} onClick={handleToggleExpand}>
        <View className={styles.taskTitleRow}>
          <Text className={styles.taskTitle}>{title}</Text>
          <View
            className={styles.statusTag}
            style={{ backgroundColor: `${statusColor}15`, color: statusColor }}
          >
            {statusText}
          </View>
        </View>
        <View className={styles.taskMeta}>
          <Text className={styles.metaItem}>📅 截止：{deadline}</Text>
          <Text className={styles.metaItem}>👤 {publisher}</Text>
        </View>
        <View className={styles.expandIcon}>
          <Text className={expanded ? styles.arrowUp : styles.arrowDown}>›</Text>
        </View>
      </View>

      {expanded && (
        <View className={styles.taskDetail}>
          <View className={styles.detailSection}>
            <Text className={styles.detailLabel}>任务描述</Text>
            <Text className={styles.detailText}>{description}</Text>
          </View>

          {returnReason && (
            <View className={styles.returnSection}>
              <View className={styles.returnHeader}>
                <Text className={styles.returnIcon}>⚠️</Text>
                <Text className={styles.returnTitle}>退回原因</Text>
              </View>
              <Text className={styles.returnText}>{returnReason}</Text>
            </View>
          )}

          <View className={styles.detailSection}>
            <Text className={styles.detailLabel}>任务反馈</Text>
            {isEditing || canSubmit ? (
              <View>
                <Textarea
                  className={styles.feedbackInput}
                  placeholder="请输入任务完成情况或反馈内容..."
                  value={feedback}
                  onInput={handleFeedbackChange}
                  maxlength={1000}
                />
                <View className={styles.actionRow}>
                  {isEditing && status === 'submitted' && (
                    <Button
                      className={styles.cancelBtn}
                      onClick={() => setIsEditing(false)}
                    >
                      取消
                    </Button>
                  )}
                  <Button
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                  >
                    {status === 'returned' ? '重新提交' : '提交反馈'}
                  </Button>
                </View>
              </View>
            ) : (
              <View>
                <Text className={styles.detailText}>
                  {feedback || '暂无反馈内容'}
                </Text>
                {showEditBtn && (
                  <View className={styles.editLink} onClick={handleStartEdit}>
                    <Text>修改反馈 ›</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          <View className={styles.detailFooter}>
            <Text className={styles.createTime}>发布时间：{createTime}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default TaskItem;
