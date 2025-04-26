import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import { H1, H2, Body, Caption } from '../atoms/Typography';

interface ResultCardProps {
  plantImage?: ImageSourcePropType;
  diseaseName: string;
  description: string;
  treatments: string[];
  isError?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({
  plantImage,
  diseaseName,
  description,
  treatments,
  isError = false,
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
        
        <Body className="mb-4">{description}</Body>
        
        {!isError && treatments.length > 0 && (
          <>
            <H2 className="mb-2">Suggested Treatment</H2>
            <View className="space-y-2">
              {treatments.map((treatment, index) => (
                <View key={index} className="flex-row">
                  <Caption className="text-base mr-2">•</Caption>
                  <Body className="flex-1">{treatment}</Body>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default ResultCard; 