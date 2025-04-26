import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Caption } from '../atoms/Typography';
import Icon from '../atoms/Icon';

interface CaptureButtonProps {
  onPress: () => void;
  hint?: string;
}

const CaptureButton: React.FC<CaptureButtonProps> = ({
  onPress,
  hint = 'Ensure good lighting for best results',
}) => {
  return (
    <View className="items-center">
      {hint && (
        <Caption className="mb-4 text-center px-6">{hint}</Caption>
      )}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className="w-20 h-20 rounded-full bg-white border-2 border-primary flex items-center justify-center"
      >
        <View className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
          <Icon name="photo-camera" size={30} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CaptureButton; 