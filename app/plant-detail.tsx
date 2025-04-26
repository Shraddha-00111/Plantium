import React, { useCallback, useRef, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppBar from '../components/molecules/AppBar';
import { Body, H1, H2, H3 } from '../components/atoms/Typography';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

// Pre-loaded plant images by category
const plantImagesByCategory = {
  // Common houseplants
  default: [
    'https://images.unsplash.com/photo-1620127682229-33388276e540?q=80&w=1000',
    'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=1000',
    'https://images.unsplash.com/photo-1685351819487-36c37af64d37?q=80&w=1000',
  ],
  // Leafy tropical plants
  monstera: [
    'https://images.unsplash.com/photo-1614594895304-fe7116ac3b9e?q=80&w=1000',
    'https://images.unsplash.com/photo-1682078994167-894c82c9bca5?q=80&w=1000',
  ],
  pothos: [
    'https://images.unsplash.com/photo-1655113411933-a2ed9ee40e76?q=80&w=1000',
    'https://images.unsplash.com/photo-1632207801314-d50961451ddb?q=80&w=1000',
  ],
  fern: [
    'https://images.unsplash.com/photo-1658900197614-6b7e79bee658?q=80&w=1000',
    'https://images.unsplash.com/photo-1689165021394-27172636b2a4?q=80&w=1000',
  ],
  // Succulents and cacti
  succulent: [
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1000',
    'https://images.unsplash.com/photo-1632209579377-9f10a1fb636f?q=80&w=1000',
  ],
  cactus: [
    'https://images.unsplash.com/photo-1475590655394-1cc53e8e56bd?q=80&w=1000',
    'https://images.unsplash.com/photo-1558693168-c370615b54e0?q=80&w=1000',
  ],
  // Flowering plants
  rose: [
    'https://images.unsplash.com/photo-1589848563537-70d142e62724?q=80&w=1000',
    'https://images.unsplash.com/photo-1583634852966-dbbef0a53a56?q=80&w=1000',
  ],
  orchid: [
    'https://images.unsplash.com/photo-1621592484082-2d05b1290d7a?q=80&w=1000',
    'https://images.unsplash.com/photo-1610798957892-f686d0d605c3?q=80&w=1000',
  ],
  // Vegetable plants
  tomato: [
    'https://images.unsplash.com/photo-1592818868295-f7c7bfdee18d?q=80&w=1000',
    'https://images.unsplash.com/photo-1599144259294-d1ae7fddecfa?q=80&w=1000',
  ],
  potato: [
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000',
    'https://images.unsplash.com/photo-1635774855317-edf3ee4463db?q=80&w=1000',
  ],
};

// Helper to find the best matching image for a plant
const findPlantImage = (plantName: string) => {
  if (!plantName) return plantImagesByCategory.default[0];
  
  const nameLower = plantName.toLowerCase();
  
  // Check for direct matches first
  for (const [category, images] of Object.entries(plantImagesByCategory)) {
    if (nameLower.includes(category)) {
      return images[Math.floor(Math.random() * images.length)];
    }
  }
  
  // Use default images if no match
  return plantImagesByCategory.default[Math.floor(Math.random() * plantImagesByCategory.default.length)];
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
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // The plant data would normally come from params or fetch from an API
  // This is mockup data for demonstration
  const plantData = {
    name: params.plantName as string || 'Monstera Deliciosa',
    scientificName: params.scientificName as string || 'Monstera deliciosa',
    genus: params.genus as string || 'Monstera',
    family: params.family as string || 'Araceae',
    diseaseName: params.diseaseName as string || '',
    diseaseDescription: params.description as string || '',
  };

  // Set up cover image when component mounts
  useEffect(() => {
    // Priority: 1. Captured image, 2. Matching stock photo
    if (params.imageUri) {
      setCoverImage(params.imageUri as string);
    } else {
      setCoverImage(findPlantImage(plantData.name));
    }
  }, [plantData.name, params.imageUri]);

  const onImageLoad = () => {
    setImageLoading(false);
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
              source={{ uri: coverImage || findPlantImage(plantData.name) }}
              className="w-full h-full"
              resizeMode="cover"
              onLoad={onImageLoad}
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