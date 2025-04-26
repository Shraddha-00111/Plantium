import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import { H1, H2, H3, Body, Caption } from '../atoms/Typography';

interface ResultCardProps {
  plantImage?: ImageSourcePropType;
  diseaseName: string;
  description: string;
  treatments?: string[];
  isError?: boolean;
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

const ResultCard: React.FC<ResultCardProps> = ({
  plantImage,
  diseaseName,
  description,
  treatments = [],
  isError = false,
  plantName,
  scientificName,
  careInstructions
}) => {
  return (
    <View className="bg-white rounded-xl shadow-sm overflow-hidden">
      {plantImage && (
        <Image
          source={plantImage}
          className="w-full h-48"
          resizeMode="cover"
        />
      )}
      
      <View className="p-4">
        <H1 
          className={`mb-2 ${isError ? 'text-red-500' : ''}`}
        >
          {diseaseName}
        </H1>
        
        {(plantName || scientificName) && (
          <View className="mb-3 bg-green-50 p-2 rounded-md">
            {plantName && <Body className="font-semibold">{plantName}</Body>}
            {scientificName && <Caption className="italic">{scientificName}</Caption>}
          </View>
        )}
        
        <Body className="mb-4">{description}</Body>
        
        {!isError && treatments.length > 0 && (
          <>
            <H2 className="mb-2">Suggested Treatment</H2>
            <View className="space-y-2 mb-4">
              {treatments.map((treatment, index) => (
                <View key={index} className="flex-row">
                  <Caption className="text-base mr-2">•</Caption>
                  <Body className="flex-1">{treatment}</Body>
                </View>
              ))}
            </View>
          </>
        )}
        
        {careInstructions && Object.values(careInstructions).some(value => value) && (
          <>
            <H2 className="mb-2">Care Instructions</H2>
            <View className="space-y-2">
              {careInstructions.watering && (
                <View className="mb-2">
                  <H3 className="text-primary font-medium">Watering</H3>
                  <Body>{careInstructions.watering}</Body>
                </View>
              )}
              
              {careInstructions.light && (
                <View className="mb-2">
                  <H3 className="text-primary font-medium">Light</H3>
                  <Body>{careInstructions.light}</Body>
                </View>
              )}
              
              {careInstructions.soil && (
                <View className="mb-2">
                  <H3 className="text-primary font-medium">Soil</H3>
                  <Body>{careInstructions.soil}</Body>
                </View>
              )}
              
              {careInstructions.temperature && (
                <View className="mb-2">
                  <H3 className="text-primary font-medium">Temperature</H3>
                  <Body>{careInstructions.temperature}</Body>
                </View>
              )}
              
              {careInstructions.humidity && (
                <View className="mb-2">
                  <H3 className="text-primary font-medium">Humidity</H3>
                  <Body>{careInstructions.humidity}</Body>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default ResultCard; 