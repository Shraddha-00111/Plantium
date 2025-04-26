import React from 'react';
import { View, Image, ScrollView, ActivityIndicator } from 'react-native';
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
  plantName,
  scientificName,
  careInstructions
}) => {
  return (
    <View className="flex-1 bg-background">
      <AppBar title="Diagnosis Result" showBackButton />
      
      <ScrollView className="flex-1 px-4 py-2">
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-48 rounded-xl mb-4"
            resizeMode="cover"
          />
        )}
        
        {isLoading ? (
          <View className="p-8 bg-white rounded-xl items-center justify-center">
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
              <View className="mt-4">
                <ResultCard
                  diseaseName="Plant Care Guide"
                  description="Here's how to take care of your plant:"
                  careInstructions={careInstructions}
                />
              </View>
            )}
          </>
        )}
        
        <View className="my-6">
          <Button
            variant="primary"
            onPress={onScanAgain}
            className="w-full"
          >
            Scan Again
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default ResultView; 