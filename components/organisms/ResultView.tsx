import React, { useState } from 'react';
import { View, Image, ScrollView, ActivityIndicator, Animated } from 'react-native';
import AppBar from '../molecules/AppBar';
import ResultCard from '../molecules/ResultCard';
import Button from '../atoms/Button';
import { Body } from '../atoms/Typography';

interface ResultViewProps {
  imageUri: string;
  diseaseName: string;
  description: string;
  treatments: string[];
  isLoading?: boolean;
  isError?: boolean;
  onScanAgain: () => void;
  onViewDetails?: () => void;
  plantName?: string;
  scientificName?: string;
  careInstructions?: {
    watering?: string;
    light?: string;
    soil?: string;
    temperature?: string;
    humidity?: string;
  };
}

const ResultView: React.FC<ResultViewProps> = ({
  imageUri,
  diseaseName,
  description,
  treatments,
  isLoading = false,
  isError = false,
  onScanAgain,
  onViewDetails,
  plantName,
  scientificName,
  careInstructions
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const onImageLoad = () => {
    setImageLoaded(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="flex-1 bg-background">
      <AppBar 
        title="Diagnosis Result" 
        showBackButton 
        className="shadow-md"
        titleClassName="text-lg font-bold"
      />
      
      <ScrollView className="flex-1 px-4 py-4">
        {imageUri && (
          <Animated.View style={{ opacity: fadeAnim }} className="mb-6">
            <Image
              source={{ uri: imageUri }}
              className="w-full h-56 rounded-2xl border-2 border-white shadow-sm"
              resizeMode="cover"
              onLoad={onImageLoad}
            />
          </Animated.View>
        )}
        
        {isLoading ? (
          <View className="p-8 bg-white rounded-xl shadow-sm items-center justify-center my-6">
            <ActivityIndicator size="large" color="#4CAF50" />
            <Body className="text-center mt-4">Analyzing your plant...</Body>
          </View>
        ) : (
          <>
            <ResultCard
              diseaseName={isError ? 'Diagnosis Failed' : diseaseName}
              description={isError ? 'We could not identify the disease. Please try again with a clearer image.' : description}
              treatments={treatments}
              isError={isError}
              plantName={plantName}
              scientificName={scientificName}
            />
            
            {careInstructions && Object.values(careInstructions).some(v => v) && (
              <View className="mt-8">
                <ResultCard
                  diseaseName="Plant Care Guide"
                  description="Here's how to take care of your plant:"
                  careInstructions={careInstructions}
                />
              </View>
            )}
          </>
        )}
        
        <View className="my-8">
          {!isLoading && !isError && plantName && onViewDetails && (
            <Button
              variant="outline"
              onPress={onViewDetails}
              className="w-full mb-4 rounded-full py-4"
            >
              View Plant Details
            </Button>
          )}
          
          <Button
            variant="primary"
            onPress={onScanAgain}
            className="w-full rounded-full py-4 shadow-md"
          >
            Scan Again
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default ResultView; 