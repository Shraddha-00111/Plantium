import React, { useCallback, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppBar from '../components/molecules/AppBar';
import { Body, H1, H2, H3 } from '../components/atoms/Typography';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

// Local plant images mapping - only include images that actually exist
const LOCAL_PLANT_IMAGES: Record<string, any> = {
  // This will be populated with available images from assets/plants folder
  potato: require('../assets/plants/potato.jpg'),
  // Add more as needed when you have the actual image files
};

// Use a simple default image that we know exists in the React Native framework
const DEFAULT_IMAGE = { uri: 'https://reactnative.dev/img/tiny_logo.png' };

// Get the matching local image for a plant, or use the captured image
const getPlantImage = (plantName: string, capturedImageUri?: string) => {
  try {
    // Always prioritize the captured image when available
    if (capturedImageUri) {
      return { uri: capturedImageUri };
    }
    
    // Try to find a matching local image based on plant name
    if (plantName) {
      const normalizedName = plantName.toLowerCase().trim();
      
      // Check for common plant names that we have images for
      for (const [key, image] of Object.entries(LOCAL_PLANT_IMAGES)) {
        if (normalizedName.includes(key)) {
          return image;
        }
      }
    }
    
    // If no matching image is found, use the default React Native logo
    return DEFAULT_IMAGE;
  } catch (error) {
    console.error('Error loading plant image:', error);
    // In case of any errors, return a guaranteed working image
    return DEFAULT_IMAGE;
  }
};

// Mock trait items data
const traitItems = [
  { 
    id: 'lighting', 
    icon: 'sunny-outline', 
    title: 'Lighting', 
    subtitle: 'Bright indirect light',
    description: 'This plant thrives in bright, indirect light. It can tolerate some direct morning sun, but should be protected from harsh afternoon sun which can scorch its leaves. If the leaves start to yellow, it may be getting too much light. If growth slows and stems become leggy, it needs more light.'
  },
  { 
    id: 'temperature', 
    icon: 'thermometer-outline', 
    title: 'Temperature', 
    subtitle: '65-75°F (18-24°C)',
    description: 'Maintain temperatures between 65-75°F (18-24°C) for optimal growth. This plant can tolerate brief periods of cooler temperatures but should be protected from drafts and sudden temperature changes. Keep away from heating vents and air conditioners.'
  },
  { 
    id: 'humidity', 
    icon: 'water-outline', 
    title: 'Humidity', 
    subtitle: 'Medium to high',
    description: 'This plant prefers medium to high humidity levels. In dry environments, consider using a humidifier or pebble tray with water to increase local humidity. Regular misting can help but is not as effective as consistent ambient humidity.'
  },
  { 
    id: 'hardiness', 
    icon: 'leaf-outline', 
    title: 'Hardiness Zone', 
    subtitle: 'USDA Zones 9-11',
    description: 'This plant is hardy in USDA Zones 9-11. In colder climates, it should be grown as a houseplant or brought indoors when temperatures drop below 50°F (10°C). If growing outdoors in suitable climates, plant in a location that provides some protection from extreme weather.'
  },
];

// Mock care items data
const careItems = [
  { 
    id: 'watering', 
    icon: 'water', 
    title: 'Watering', 
    subtitle: 'Keep soil moist',
    description: 'Water when the top inch of soil feels dry to the touch. Ensure thorough watering until water drains from the bottom of the pot, then allow excess water to drain completely. Reduce watering in winter months when growth slows. Avoid letting the plant sit in standing water as this can lead to root rot.'
  },
  { 
    id: 'soil', 
    icon: 'leaf', 
    title: 'Soil', 
    subtitle: 'Well-draining mix',
    description: 'Use a well-draining potting mix that retains some moisture but doesn\'t stay soggy. A mix of peat, perlite, and pine bark works well. The soil pH should be slightly acidic to neutral (6.0-7.0). Repot every 1-2 years or when the plant becomes root-bound.'
  },
  { 
    id: 'fertilizing', 
    icon: 'flask', 
    title: 'Fertilizing', 
    subtitle: 'Monthly during growing season',
    description: 'Fertilize monthly during the growing season (spring and summer) with a balanced, water-soluble fertilizer diluted to half strength. Reduce or eliminate fertilization during fall and winter when growth naturally slows. Over-fertilization can cause salt buildup and damage roots.'
  },
  { 
    id: 'pruning', 
    icon: 'cut', 
    title: 'Pruning', 
    subtitle: 'As needed',
    description: 'Prune dead or yellowing leaves at the base of the stem using clean, sharp scissors. Pinch back growing tips to encourage bushier growth. After flowering, remove spent blooms to encourage new flower production and prevent the plant from using energy on seed development.'
  },
];

// Mock info items data
const infoItems = [
  { 
    id: 'origin', 
    icon: 'globe-outline', 
    title: 'Origin', 
    subtitle: 'Tropical regions',
    description: 'This plant is native to tropical rainforests of Central and South America. It evolved in the understory of these forests, adapting to filtered light conditions and high humidity. First discovered by botanists in the early 19th century, it has since become a popular houseplant worldwide due to its attractive foliage and relatively easy care.'
  },
  { 
    id: 'growth', 
    icon: 'trending-up-outline', 
    title: 'Growth Habit', 
    subtitle: 'Moderate, upright',
    description: 'This plant displays a moderate growth rate with an upright, somewhat spreading habit. New growth emerges from the center of the plant, creating a symmetrical, rosette-like form. Under optimal conditions, it can reach maturity in 2-3 years, with a maximum height of 2-3 feet and spread of 1-2 feet indoors.'
  },
  { 
    id: 'flowering', 
    icon: 'flower-outline', 
    title: 'Flowering', 
    subtitle: 'Seasonal blooms',
    description: 'Under proper conditions, this plant produces small, delicate flowers typically in spring or early summer. The flowers are not particularly showy but add a nice touch to the overall appearance. Not all plants will flower when kept indoors, as they often need specific light cycles and maturity to trigger blooming.'
  },
];

// Mock risk items data
const riskItems = [
  { 
    id: 'toxicity', 
    icon: 'warning-outline', 
    title: 'Toxicity', 
    subtitle: 'Mildly toxic if ingested',
    description: 'This plant is mildly toxic if ingested and may cause stomach upset, vomiting, or diarrhea in humans and animals. The sap may also cause skin irritation in sensitive individuals. Keep away from children and pets. If ingestion occurs, contact a poison control center or seek medical advice immediately.'
  },
  { 
    id: 'pests', 
    icon: 'bug-outline', 
    title: 'Common Pests', 
    subtitle: 'Spider mites, mealybugs',
    description: 'This plant is susceptible to common houseplant pests including spider mites, mealybugs, and scale insects. Regular inspection of leaves (especially the undersides) can help catch infestations early. Treat with insecticidal soap or neem oil at the first sign of pests. Maintaining proper humidity can help prevent spider mite problems.'
  },
  { 
    id: 'diseases', 
    icon: 'medical-outline', 
    title: 'Diseases', 
    subtitle: 'Root rot, leaf spot',
    description: 'The most common diseases affecting this plant are root rot (from overwatering) and various leaf spot diseases. To prevent these issues, avoid overwatering, ensure good air circulation, and don\'t get water on the leaves when watering. If disease symptoms appear, remove affected parts and adjust care practices accordingly.'
  },
];

const screenWidth = Dimensions.get('window').width;

export default function PlantDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<any>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // The plant data would normally come from params or fetch from an API
  const plantData = {
    name: params.plantName as string || 'Monstera Deliciosa',
    scientificName: params.scientificName as string || 'Monstera deliciosa',
    genus: params.genus as string || 'Monstera',
    family: params.family as string || 'Araceae',
    diseaseName: params.diseaseName as string || '',
    diseaseDescription: params.description as string || '',
    // Get the appropriate image source with fallbacks
    coverImage: getPlantImage(params.plantName as string, params.imageUri as string),
  };

  // Handle image load completion
  const handleImageLoad = () => {
    setImageLoading(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Handle image loading error
  const handleImageError = () => {
    console.log('Image failed to load, using fallback');
    setImageLoading(false);
    // Still fade in even if there was an error (will show placeholder/background)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleOpenModal = useCallback((type: string, item: any) => {
    setActiveModal(type);
    setModalContent({
      ...item,
      fullDescription: item.description // Store full description
    });
    // Reset expanded state for modal content
    setExpandedSections([]);
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseModal = useCallback(() => {
    bottomSheetRef.current?.close();
    setTimeout(() => {
      setActiveModal(null);
      setModalContent(null);
    }, 300);
  }, []);

  const toggleExpand = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  // Truncate text function
  const truncateText = (text: string, maxLength: number) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const renderSection = (
    title: string, 
    items: any[], 
    type: string,
    iconColor: string = '#3A7D44'
  ) => {
    return (
      <View className="mb-6">
        <H2 className="mb-2 px-4">{title}</H2>
        <View>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-white rounded-xl shadow-sm flex-row items-center px-4 py-3 mb-2 mx-4"
              onPress={() => handleOpenModal(type, item)}
            >
              <View className="bg-primary/10 p-2 rounded-full mr-3">
                <Ionicons name={item.icon} size={20} color={iconColor} />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-base">{item.title}</Text>
                {item.subtitle && (
                  <Text className="text-gray-600 text-sm">{truncateText(item.subtitle, 30)}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderDiseaseSection = () => {
    if (!plantData.diseaseName || plantData.diseaseName === 'Healthy Plant') return null;
    
    const sectionId = 'disease-description';
    const isExpanded = expandedSections.includes(sectionId);
    
    return (
      <View className="mb-6">
        <H2 className="mb-2 px-4">Health Condition</H2>
        <View className="bg-white rounded-xl shadow-sm mx-4 p-4">
          <H3 className="text-red-500 mb-1">{plantData.diseaseName}</H3>
          <Body>
            {isExpanded ? plantData.diseaseDescription : truncateText(plantData.diseaseDescription, 100)}
          </Body>
          {plantData.diseaseDescription.length > 100 && (
            <TouchableOpacity 
              onPress={() => toggleExpand(sectionId)}
              className="mt-1"
            >
              <Text className="text-primary font-medium">
                {isExpanded ? 'Read less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <AppBar title="Plant Details" showBackButton />
      
      <ScrollView className="flex-1">
        {/* Plant header image with gradient overlay */}
        <View className="w-full h-56 bg-gray-200">
          <Animated.View style={{ opacity: fadeAnim, height: '100%', width: '100%' }}>
            <Image
              source={plantData.coverImage}
              className="w-full h-full"
              resizeMode="cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
              defaultSource={require('../assets/plants/potato.jpg')} // Fallback that we know exists
            />
            <View className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
          </Animated.View>

          {imageLoading && (
            <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
              <ActivityIndicator size="large" color="#4CAF50" />
            </View>
          )}
        </View>
        
        {/* Plant information */}
        <View className="bg-white p-5 -mt-4 rounded-t-3xl shadow-sm">
          <H1 className="text-primary">{plantData.name}</H1>
          <View className="flex-row flex-wrap items-baseline mt-1">
            <Text className="text-gray-600 mr-1">Genus:</Text>
            <Text className="font-medium mr-3">{plantData.genus}</Text>
            <Text className="text-gray-600 mr-1">Family:</Text>
            <Text className="font-medium">{plantData.family}</Text>
          </View>
          <Text className="text-gray-600 italic mt-1">{plantData.scientificName}</Text>
        </View>
        
        {/* Disease section if present */}
        {renderDiseaseSection()}
        
        {/* Main sections */}
        {renderSection('Info', infoItems, 'info', '#3A7D44')}
        {renderSection('Care', careItems, 'care', '#3A7D44')}
        {renderSection('Traits', traitItems, 'traits', '#3A7D44')}
        {renderSection('Risks', riskItems, 'risks', '#D14343')}
      </ScrollView>
      
      {/* Bottom Sheet Modal */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['70%']}
        enablePanDownToClose
        handleIndicatorStyle={{ backgroundColor: '#999' }}
        backgroundStyle={{ backgroundColor: 'white' }}
      >
        {modalContent && (
          <View className="flex-1 p-5">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="bg-primary/10 p-2 rounded-full mr-3">
                  <Ionicons
                    name={modalContent.icon}
                    size={24}
                    color={activeModal === 'risks' ? '#D14343' : '#3A7D44'}
                  />
                </View>
                <View>
                  <H2>{modalContent.title}</H2>
                  <Text className="text-gray-600">{modalContent.subtitle}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            
            <ScrollView className="flex-1">
              {/* For modal content, we use a separate expansion state */}
              {(() => {
                const modalExpId = 'modal-description';
                const isExpanded = expandedSections.includes(modalExpId);
                const description = modalContent.fullDescription || modalContent.description;
                
                return (
                  <View>
                    <Body className="text-base leading-6">
                      {isExpanded ? description : truncateText(description, 150)}
                    </Body>
                    {description && description.length > 150 && (
                      <TouchableOpacity 
                        onPress={() => toggleExpand(modalExpId)}
                        className="mt-2 mb-4"
                      >
                        <Text className="text-primary font-medium">
                          {isExpanded ? 'Read less' : 'Read more'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })()}
            </ScrollView>
          </View>
        )}
      </BottomSheet>
    </View>
  );
} 