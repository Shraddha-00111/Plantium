import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { H2 } from '../atoms/Typography';
import Icon from '../atoms/Icon';
import { twMerge } from 'tailwind-merge';

interface AppBarProps {
  title: string;
  showBackButton?: boolean;
  transparent?: boolean;
  className?: string;
  titleClassName?: string;
}

const AppBar: React.FC<AppBarProps> = ({
  title,
  showBackButton = false,
  transparent = false,
  className = '',
  titleClassName = '',
}) => {
  const baseStyles = 'w-full px-4 py-3 flex-row items-center';
  const bgStyles = transparent ? 'bg-transparent' : 'bg-background';
  const mergedStyles = twMerge(baseStyles, bgStyles, className);
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <View className={mergedStyles}>
      {showBackButton && (
        <TouchableOpacity
          onPress={handleBack}
          className="mr-4"
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" color="#333333" size={24} />
        </TouchableOpacity>
      )}
      <H2 className={titleClassName}>{title}</H2>
    </View>
  );
};

export default AppBar; 