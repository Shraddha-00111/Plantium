import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AppBar from '../molecules/AppBar';

interface CameraViewAlternativeProps {
  onCapture: (imageUri: string) => void;
}

const CameraViewAlternative: React.FC<CameraViewAlternativeProps> = ({ onCapture }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const takePicture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPreviewImage(result.assets[0].uri);
        onCapture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking picture with native camera:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPreviewImage(result.assets[0].uri);
        onCapture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <AppBar title="Scan Plant" showBackButton />
      
      {previewImage ? (
        <View className="flex-1 p-4">
          <Image 
            source={{ uri: previewImage }} 
            className="flex-1 rounded-lg" 
            resizeMode="cover" 
          />
          <TouchableOpacity 
            className="bg-primary p-4 rounded-lg mt-4"
            onPress={takePicture}
          >
            <Text className="text-white font-medium text-center">Take Another Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center p-6">
          <View className="bg-primary/10 p-8 rounded-lg w-full items-center mb-8">
            <Ionicons name="camera-outline" size={64} color="#3A7D44" className="mb-4" />
            <Text className="text-primary font-medium text-lg text-center mb-2">
              Camera Access Required
            </Text>
            <Text className="text-gray-600 text-center mb-4">
              The main camera couldn't be accessed. You can use your device's native camera instead.
            </Text>
          </View>

          <TouchableOpacity
            className="bg-primary p-4 rounded-lg w-full mb-4"
            onPress={takePicture}
          >
            <Text className="text-white font-medium text-center">Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="border border-primary p-4 rounded-lg w-full"
            onPress={pickImage}
          >
            <Text className="text-primary font-medium text-center">Select from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CameraViewAlternative; 