import React from 'react';
import { View, StatusBar } from 'react-native';
import { router, Href } from 'expo-router';
import HomeHero from '../components/organisms/HomeHero';

export default function HomeScreen() {
  const handleScanPress = () => {
    router.push('scan' as Href);
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <HomeHero
        title="Plant Disease Detection"
        tagline="Keep Your Plants Healthy!"
        buttonText="Scan Plant"
        onPress={handleScanPress}
      />
    </View>
  );
}
