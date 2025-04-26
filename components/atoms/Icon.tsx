import React from 'react';
import { View, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type IconName = 'arrow-back' | 'camera' | 'error' | 'camera-alt' | 'photo-camera' | 'refresh';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#333333',
  style,
  className = '',
}) => {
  return (
    <View className={className} style={style}>
      <MaterialIcons name={name} size={size} color={color} />
    </View>
  );
};

export default Icon; 