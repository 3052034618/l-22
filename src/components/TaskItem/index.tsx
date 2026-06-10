import React, { useState } from 'react';
import { View, Text, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { Task } from '@/types';
import { getStatusText, getStatusColor, getPriorityText, getPriorityColor } from '@/utils';

interface TaskItemProps {
  data: Task;
  onSubmit?: (taskId: string, feedback: string) => void;
  onResubmit?: (taskId: string, feedback: string) => void;
  onStart?: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ data, onSubmit, onResubmit, onStart }) => {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState(data.feedback || '');
  const [isEditing, setIsEditing] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { title, description, deadline, publisher, status, returnReason, createTime, priority, auditLogs, feedbackHistory, currentVersion } = data;
  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status);
  const priorityColor = getPriorityColor(priority);
  const priorityText = getPriorityText(priority);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
    if (expanded) {
      setShowTimeline(false);
      setShowHistory(false);
    }
  };

  const handleFeedbackChange = (e: any) => {
    setFeedback(e.detail.value);
  };

  const handleStart = () => {
    console.log('[TaskItem] 开始处理:', data.id);
    if (onStart) {
      onStart(data.id);
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setFeedback(data.feedback || '');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFeedback(data.feedback || '');
  };

  const handleSubmit = () => {
    if (!feedback.trim()) {
      Taro.showToast({ title: '请输入反馈内容', icon: 'none' });
      return;
    }
    console.log('[TaskItem] 提交反馈:', data.id, feedback);

    if (status === 'returned') {
      if (onResubmit) {
        onResubmit(data.id, feedback);
      }
    } else {
      if (onSubmit) {
        onSubmit(data.id, feedback);
      }
    }

    setIsEditing(false);
  };

  const isPendingOrProgress = status === 'pending' || status === 'in_progress';
  const isReturned = status === 'returned';
  const isSubmitted = status === 'submitted';
  const isCompleted = status === 'completed';
  const canEdit = isPendingOrProgress || isReturned;

  const showStartBtn = status === 'pending';
  const showSubmitBtn = isPendingOrProgress || isReturned || (isSubmitted && isEditing);

  const getTimelineIcon = (logStatus: string): string => {
    switch (logStatus) {
      case 'pending': return '📋';
      case 'in_progress': return '🔄';
      case 'submitted': return '📤';
      case 'returned': return '↩️';
      case 'completed': return '✅';
      default: return '📝';
    }
  };

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
          <View
            className={styles.priorityTag}
            style={{ backgroundColor: `${priorityColor}15`, color: priorityColor }}
          >
            {priorityText}
          </View>
        </View>
        <View className={styles.expandIcon}>
          <Text className={classnames(styles.arrow, expanded && styles.arrowUp)}>›</Text>
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
            <View className={styles.detailLabelRow}>
              <Text className={styles.detailLabel}>任务反馈</Text>
              {feedbackHistory && feedbackHistory.length > 0 && (
                <Text
                  className={styles.detailLink}
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? '收起历史' : `历史版本(${currentVersion || 0})`} ›
                </Text>
              )}
              {isSubmitted && !isEditing && (
                <Text className={styles.editLink} onClick={handleStartEdit}>
                  修改反馈 ›
                </Text>
              )}
            </View>

            {showHistory && feedbackHistory && feedbackHistory.length > 0 && (
              <View className={styles.historyList}>
                {[...feedbackHistory].reverse().map((version) => (
                  <View key={version.version} className={styles.historyItem}>
                    <View className={styles.historyHeader}>
                      <Text className={styles.historyVersion}>
                        v{version.version}
                      </Text>
                      <View
                        className={classnames(
                          styles.historyStatus,
                          version.status === 'approved' && styles.statusApproved,
                          version.status === 'returned' && styles.statusReturned,
                          version.status === 'submitted' && styles.statusSubmitted
                        )}
                      >
                        {version.status === 'approved' ? '已通过' :
                         version.status === 'returned' ? '已退回' : '已提交'}
                      </View>
                      <Text className={styles.historyTime}>{version.submitTime}</Text>
                    </View>
                    <Text className={styles.historyContent}>{version.content}</Text>
                  </View>
                ))}
              </View>
            )}

            {canEdit || isEditing ? (
              <View>
                <Textarea
                  className={styles.feedbackInput}
                  placeholder="请输入任务完成情况或反馈内容，包括具体措施、效果数据等..."
                  value={feedback}
                  onInput={handleFeedbackChange}
                  maxlength={1000}
                  autoHeight
                />
                <View className={styles.wordCount}>
                  {feedback.length}/1000
                </View>
                <View className={styles.actionRow}>
                  {showStartBtn && (
                    <View
                      className={classnames(styles.actionBtn, styles.startBtn)}
                      onClick={handleStart}
                    >
                      <Text className={styles.actionBtnText}>开始处理</Text>
                    </View>
                  )}
                  {isEditing && (
                    <View
                      className={classnames(styles.actionBtn, styles.cancelBtn)}
                      onClick={handleCancelEdit}
                    >
                      <Text className={styles.cancelBtnText}>取消</Text>
                    </View>
                  )}
                  {showSubmitBtn && (
                    <View
                      className={classnames(styles.actionBtn, styles.submitBtn)}
                      onClick={handleSubmit}
                    >
                      <Text className={styles.submitBtnText}>
                        {isReturned ? '重新提交' : '提交反馈'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View className={styles.feedbackView}>
                <Text className={styles.detailText}>
                  {feedback || '暂无反馈内容'}
                </Text>
              </View>
            )}
          </View>

          {auditLogs && auditLogs.length > 0 && (
            <View className={styles.detailSection}>
              <View className={styles.detailLabelRow}>
                <Text className={styles.detailLabel}>审核流转</Text>
                <Text
                  className={styles.detailLink}
                  onClick={() => setShowTimeline(!showTimeline)}
                >
                  {showTimeline ? '收起' : '展开'} ›
                </Text>
              </View>
              {showTimeline && (
                <View className={styles.timeline}>
                  {auditLogs.map((log, index) => (
                    <View key={log.id} className={styles.timelineItem}>
                      <View className={styles.timelineDot}>
                        <Text className={styles.timelineIcon}>{getTimelineIcon(log.status)}</Text>
                      </View>
                      <View className={styles.timelineContent}>
                        <View className={styles.timelineHeader}>
                          <Text className={styles.timelineStatus}>{log.statusText}</Text>
                          <Text className={styles.timelineTime}>{log.time}</Text>
                        </View>
                        <Text className={styles.timelineOperator}>{log.operator}</Text>
                        {log.comment && (
                          <Text className={styles.timelineComment}>{log.comment}</Text>
                        )}
                      </View>
                      {index < auditLogs.length - 1 && (
                        <View className={styles.timelineLine} />
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          <View className={styles.detailFooter}>
            <Text className={styles.createTime}>发布时间：{createTime}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default TaskItem;
