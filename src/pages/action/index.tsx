import React, { useState, useMemo } from 'react';
import { View, Text, Textarea, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ActionTypeCard from '@/components/ActionTypeCard';
import { actionTypes, shiftOptions } from '@/data/mockData';
import type { ActionType, ShiftType } from '@/types';

const categories = [
  { key: 'all', label: '全部' },
  { key: 'lighting', label: '照明空调' },
  { key: 'equipment', label: '设备管理' },
  { key: 'packaging', label: '低碳包装' },
  { key: 'exception', label: '异常说明' }
];

const ActionPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [selectedShift, setSelectedShift] = useState<ShiftType>('morning');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const filteredActions = useMemo(() => {
    if (activeCategory === 'all') return actionTypes;
    return actionTypes.filter((action) => action.category === activeCategory);
  }, [activeCategory]);

  const totalCarbonSaving = useMemo(() => {
    return selectedAction ? selectedAction.carbonSaving : 0;
  }, [selectedAction]);

  const handleCategoryClick = (category: string) => {
    console.log('[Action] 切换分类:', category);
    setActiveCategory(category);
  };

  const handleActionSelect = (action: ActionType) => {
    console.log('[Action] 选择行动类型:', action.id, action.name);
    setSelectedAction(action);
  };

  const handleShiftSelect = (shift: ShiftType) => {
    console.log('[Action] 选择班次:', shift);
    setSelectedShift(shift);
  };

  const handleDescriptionChange = (e: any) => {
    const value = e.detail.value;
    if (value.length <= 500) {
      setDescription(value);
    }
  };

  const handleAddPhoto = () => {
    console.log('[Action] 添加照片');
    Taro.chooseImage({
      count: 9 - photos.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFiles = res.tempFilePaths;
        console.log('[Action] 选择照片成功:', tempFiles.length, '张');
        setPhotos((prev) => [...prev, ...tempFiles]);
      },
      fail: (err) => {
        console.error('[Action] 选择照片失败:', err);
      }
    });
  };

  const handleDeletePhoto = (index: number) => {
    console.log('[Action] 删除照片:', index);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedAction) {
      Taro.showToast({ title: '请选择行动类型', icon: 'none' });
      return;
    }
    if (!description.trim()) {
      Taro.showToast({ title: '请填写行动描述', icon: 'none' });
      return;
    }
    if (photos.length === 0) {
      Taro.showModal({
        title: '提示',
        content: '建议上传照片留证，是否继续提交？',
        confirmText: '继续提交',
        cancelText: '去上传',
        success: (res) => {
          if (res.confirm) {
            doSubmit();
          }
        }
      });
      return;
    }
    doSubmit();
  };

  const doSubmit = () => {
    console.log('[Action] 提交填报:', {
      action: selectedAction?.name,
      shift: selectedShift,
      description,
      photos: photos.length
    });

    Taro.showLoading({ title: '提交中...' });

    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      });

      setTimeout(() => {
        setSelectedAction(null);
        setDescription('');
        setPhotos([]);
        Taro.switchTab({ url: '/pages/home/index' });
      }, 1500);
    }, 1000);
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.content}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>选择行动类型</Text>
          <View className={styles.categoryTabs}>
            {categories.map((cat) => (
              <View
                key={cat.key}
                className={classnames(styles.categoryTab, activeCategory === cat.key && styles.active)}
                onClick={() => handleCategoryClick(cat.key)}
              >
                {cat.label}
              </View>
            ))}
          </View>
          <View className={styles.actionList}>
            {filteredActions.map((action) => (
              <ActionTypeCard
                key={action.id}
                data={action}
                selected={selectedAction?.id === action.id}
                onClick={() => handleActionSelect(action)}
              />
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>选择班次</Text>
          <View className={styles.shiftOptions}>
            {shiftOptions.map((shift) => (
              <View
                key={shift.value}
                className={classnames(styles.shiftOption, selectedShift === shift.value && styles.active)}
                onClick={() => handleShiftSelect(shift.value)}
              >
                <Text className={styles.shiftLabel}>{shift.label}</Text>
                <Text className={styles.shiftTime}>{shift.time}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.formGroup}>
            <Text className={styles.formLabel}>行动描述</Text>
            <Textarea
              className={styles.textarea}
              placeholder="请详细描述本次节能行动的具体内容..."
              value={description}
              onInput={handleDescriptionChange}
              maxlength={500}
              autoHeight={false}
            />
            <Text className={styles.wordCount}>{description.length}/500</Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>照片留证</Text>
          <View className={styles.photoGrid}>
            {photos.map((photo, index) => (
              <View key={index} className={styles.photoItem}>
                <Image className={styles.photoImage} src={photo} mode="aspectFill" />
                <View className={styles.photoDelete} onClick={() => handleDeletePhoto(index)}>
                  ×
                </View>
              </View>
            ))}
            {photos.length < 9 && (
              <View className={styles.addPhoto} onClick={handleAddPhoto} />
            )}
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.summaryInfo}>
          <Text className={styles.summaryLabel}>预计减排</Text>
          <Text className={styles.summaryValue}>{totalCarbonSaving.toFixed(1)} kg CO₂</Text>
        </View>
        <View
          className={classnames(styles.submitBtn, !selectedAction && styles.disabled)}
          onClick={handleSubmit}
        >
          <Text className={styles.submitBtnText}>提交</Text>
        </View>
      </View>
    </View>
  );
};

export default ActionPage;
