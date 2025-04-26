import React from 'react';
import { View, Image } from 'react-native';
import { H1, Body } from '../atoms/Typography';
import Button from '../atoms/Button';

interface HomeHeroProps {
  title: string;
  tagline: string;
  buttonText: string;
  onPress: () => void;
}

const HomeHero: React.FC<HomeHeroProps> = ({
  title,
  tagline,
  buttonText,
  onPress,
}) => {
  return (
    <View className="flex-1 justify-center items-center p-6">
      <View className="w-full items-center mb-8">
        <H1 className="text-center text-3xl mb-2">{title}</H1>
        <Body className="text-center mb-8">{tagline}</Body>
        
        <Button
          variant="primary"
          onPress={onPress}
          className="w-60"
        >
          {buttonText}
        </Button>
      </View>
      
      {/* Plant images for decoration */}
      <View className="absolute left-1 bottom-12 opacity-70">
        <Image 
          source={require('../../assets/images/icon.png')} 
          className="w-20 h-20" 
          resizeMode="contain" 
        />
      </View>
      
      <View className="absolute right-1 bottom-12 opacity-70">
        <Image 
          source={require('../../assets/images/icon.png')} 
          className="w-20 h-20" 
          resizeMode="contain" 
        />
      </View>
    </View>
  );
};

export default HomeHero; 