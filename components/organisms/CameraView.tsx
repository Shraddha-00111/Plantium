import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import AppBar from '../molecules/AppBar';
import { Body } from '../atoms/Typography';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface CameraViewProps {
  onCapture: (imageUri: string) => void;
  onError?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FRAME_WIDTH = SCREEN_WIDTH * 0.8;
const FRAME_HEIGHT = FRAME_WIDTH * 1.3;

// Camera types - use direct values instead of Constants which might be undefined
const CAMERA_BACK = 0;
const CAMERA_FRONT = 1;

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onError }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CAMERA_FRONT);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        if (status !== 'granted') {
          console.error('Camera permission not granted');
          if (onError) onError();
        }
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        if (onError) onError();
      }
    })();
  }, []);

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      onCapture(photo.uri);
    } catch (error) {
      console.error('Failed to take picture:', error);
      if (onError) onError();
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onCapture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      if (onError) onError();
    }
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <AppBar title="Scan Your Plant" showBackButton />
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-4">
        <AppBar title="Camera Access" showBackButton />
        <Body className="text-center">
          We need camera permissions to scan your plants. Please enable camera access in your device settings.
        </Body>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <Camera
        ref={cameraRef}
        type={type}
        style={StyleSheet.absoluteFill}
        onMountError={(error) => {
          console.error('Camera mount error:', error);
          if (onError) onError();
        }}
      >
        <AppBar 
          title="Scan Your Plant" 
          showBackButton 
          transparent
          titleClassName="text-white"
        />

        {/* Frame Overlay */}
        <View className="flex-1 justify-center items-center">
          <View 
            style={{
              width: FRAME_WIDTH,
              height: FRAME_HEIGHT,
              borderWidth: 2,
              borderColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: 16,
            }}
          />
        </View>

        {/* Bottom Section with Capture Button */}
        <View className="pb-8 pt-4">
          <View className="flex-row justify-between items-center px-5">
            <TouchableOpacity
              className="bg-white/30 w-14 h-14 rounded-full justify-center items-center"
              onPress={() => setType(type === CAMERA_FRONT ? CAMERA_BACK : CAMERA_FRONT)}
            >
              <Ionicons name="camera-reverse-outline" size={28} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-white w-20 h-20 rounded-full justify-center items-center"
              onPress={handleCapture}
            >
              <View className="bg-transparent w-16 h-16 rounded-full border-4 border-primary"></View>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-white/30 w-14 h-14 rounded-full justify-center items-center"
              onPress={handlePickImage}
            >
              <Ionicons name="images-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
};

export default CameraView; 