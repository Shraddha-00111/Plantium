import React, { useState } from 'react';
import { View, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { H1, H2, H3, Body, Caption } from '../atoms/Typography';
import { Ionicons } from '@expo/vector-icons';

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
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [expandedTreatments, setExpandedTreatments] = useState(false);
  const [expandedCareTypes, setExpandedCareTypes] = useState<string[]>([]);

  // Function to get the appropriate icon for each care instruction
  const getCareIcon = (careType: string) => {
    switch (careType) {
      case 'watering':
        return 'water-outline';
      case 'light':
        return 'sunny-outline';
      case 'soil':
        return 'leaf-outline';
      case 'temperature':
        return 'thermometer-outline';
      case 'humidity':
        return 'water';
      default:
        return 'help-circle-outline';
    }
  };

  // Truncate text function
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Toggle care instruction expansion
  const toggleCareExpansion = (careType: string) => {
    if (expandedCareTypes.includes(careType)) {
      setExpandedCareTypes(expandedCareTypes.filter(type => type !== careType));
    } else {
      setExpandedCareTypes([...expandedCareTypes, careType]);
    }
  };

  return (
    <View className="bg-white rounded-xl shadow-md overflow-hidden">
      {plantImage && (
        <Image
          source={plantImage}
          className="w-full h-56 rounded-t-xl"
          resizeMode="cover"
        />
      )}
      
      <View className="p-5">
        <H1 
          className={`text-2xl font-extrabold mb-4 ${isError ? 'text-red-500' : 'text-gray-800'}`}
        >
          {diseaseName}
        </H1>
        
        {(plantName || scientificName) && (
          <View className="mb-5 bg-green-100 p-4 rounded-xl flex-row items-center">
            <Ionicons name="leaf" size={24} color="#4CAF50" className="mr-2" />
            <View className="flex-1">
              {plantName && <Body className="font-semibold">{plantName}</Body>}
              {scientificName && <Caption className="italic">{scientificName}</Caption>}
            </View>
          </View>
        )}
        
        <View>
          <Body className="text-gray-600 leading-relaxed">
            {showFullDescription ? description : truncateText(description, 120)}
          </Body>
          {description.length > 120 && (
            <TouchableOpacity 
              onPress={() => setShowFullDescription(!showFullDescription)}
              className="mt-1"
            >
              <Body className="text-primary font-medium">
                {showFullDescription ? 'Read less' : 'Read more'}
              </Body>
            </TouchableOpacity>
          )}
        </View>
        
        {!isError && treatments.length > 0 && (
          <>
            <View className="border-t border-gray-200 my-4" />
            <H2 className="text-lg font-bold mb-4">Suggested Treatment</H2>
            <View className="space-y-3 mb-4">
              {(expandedTreatments ? treatments : treatments.slice(0, 2)).map((treatment, index) => (
                <View key={index} className="flex-row">
                  <View className="w-1 bg-green-500 rounded-full mr-3 mt-1 h-full" />
                  <Body className="flex-1 text-gray-700">{treatment}</Body>
                </View>
              ))}
              
              {treatments.length > 2 && (
                <TouchableOpacity 
                  onPress={() => setExpandedTreatments(!expandedTreatments)}
                  className="mt-1 flex-row items-center"
                >
                  <Ionicons 
                    name={expandedTreatments ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color="#4CAF50" 
                  />
                  <Body className="text-primary font-medium ml-1">
                    {expandedTreatments ? 'Show less' : `${treatments.length - 2} more suggestions`}
                  </Body>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
        
        {careInstructions && Object.values(careInstructions).some(value => value) && (
          <>
            <View className="border-t border-gray-200 my-4" />
            <View className="flex-row items-center mb-4">
              <Ionicons name="leaf" size={20} color="#4CAF50" className="mr-2" />
              <H2 className="text-lg font-bold">Plant Care Guide</H2>
            </View>
            <View className="space-y-4">
              {Object.entries(careInstructions).map(([key, value]) => {
                if (!value) return null;
                const isExpanded = expandedCareTypes.includes(key);
                const displayText = isExpanded ? value : truncateText(value || '', 80);
                return (
                  <View key={key} className="mb-2">
                    <View className="flex-row items-center mb-1">
                      <Ionicons name={getCareIcon(key)} size={18} color="#4CAF50" style={{ marginRight: 8 }} />
                      <H3 className="text-green-600 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</H3>
                    </View>
                    <Body className="text-gray-700 pl-6">{displayText}</Body>
                    {(value?.length || 0) > 80 && (
                      <TouchableOpacity 
                        onPress={() => toggleCareExpansion(key)}
                        className="mt-1 pl-6"
                      >
                        <Body className="text-primary font-medium">
                          {isExpanded ? 'Read less' : 'Read more'}
                        </Body>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default ResultCard; 