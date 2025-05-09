import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';
import { router } from 'expo-router';
import CameraViewAlternative from '../components/organisms/CameraViewAlternative';
import ResultView from '../components/organisms/ResultView';
import { analyzePlantImage, DiagnosisResult } from '../components/services/GeminiService';

// Explicitly naming the component for Expo Router compatibility
export default function ScanScreen() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleCapture = async (imageUri: string) => {
    try {
      setCapturedImage(imageUri);
      setIsLoading(true);
      
      // Send the image to the Gemini AI model for analysis
      const result = await analyzePlantImage(imageUri);
      
      setDiagnosisResult(result);
      setIsLoading(false);
      setIsError(result.isError);
      
      // If we have a valid result and it's not an error, let's navigate to the detailed view
      if (!result.isError && result.plantName) {
        // Short timeout to ensure the state updates before navigation
        setTimeout(() => {
          router.push({
            pathname: '/plant-detail',
            params: {
              imageUri: imageUri,
              plantName: result.plantName,
              scientificName: result.scientificName || '',
              genus: result.genus || '',
              family: result.family || '',
              diseaseName: result.diseaseName,
              description: result.description
            }
          });
        }, 500);
      }
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.error('Error analyzing image:', error);
    }
  };

  const handleScanAgain = () => {
    setCapturedImage(null);
    setDiagnosisResult(null);
    setIsError(false);
  };

  const handleViewDetails = () => {
    if (diagnosisResult && capturedImage) {
      router.push({
        pathname: '/plant-detail',
        params: {
          imageUri: capturedImage,
          plantName: diagnosisResult.plantName || 'Unknown Plant',
          scientificName: diagnosisResult.scientificName || '',
          genus: diagnosisResult.genus || '',
          family: diagnosisResult.family || '',
          diseaseName: diagnosisResult.diseaseName,
          description: diagnosisResult.description
        }
      });
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {!capturedImage ? (
        <CameraViewAlternative onCapture={handleCapture} />
      ) : (
        <ResultView
          imageUri={capturedImage}
          diseaseName={diagnosisResult?.diseaseName || 'Analyzing...'}
          description={diagnosisResult?.description || 'Please wait while we analyze your plant...'}
          treatments={diagnosisResult?.treatments || []}
          isLoading={isLoading}
          isError={isError}
          onScanAgain={handleScanAgain}
          plantName={diagnosisResult?.plantName}
          scientificName={diagnosisResult?.scientificName}
          careInstructions={diagnosisResult?.careInstructions}
          onViewDetails={handleViewDetails}
        />
      )}
    </View>
  );
} 