import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppBar from '../components/molecules/AppBar';
import { Body, Caption, H1, H2, H3 } from '../components/atoms/Typography';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { generatePlantImageUrls } from '../components/services/GeminiService';

// Default fallback carousel images for demo purposes
const defaultCarouselImages = [
  'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGxhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1446071103084-c257b5f70672?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGxhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBsYW50fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
];

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
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselImages, setCarouselImages] = useState<string[]>(defaultCarouselImages);
  const [loadingImages, setLoadingImages] = useState(true);

  // The plant data would normally come from params or fetch from an API
  // This is mockup data for demonstration
  const plantData = {
    name: params.plantName as string || 'Monstera Deliciosa',
    scientificName: params.scientificName as string || 'Monstera deliciosa',
    genus: params.genus as string || 'Monstera',
    family: params.family as string || 'Araceae',
    mainImage: params.imageUri as string || carouselImages[0],
    diseaseName: params.diseaseName as string || '',
    diseaseDescription: params.description as string || '',
  };

  // Fetch carousel images when the component mounts
  useEffect(() => {
    const fetchCarouselImages = async () => {
      if (plantData.name) {
        setLoadingImages(true);
        try {
          const images = await generatePlantImageUrls(plantData.name, 5);
          setCarouselImages([plantData.mainImage, ...images]);
        } catch (error) {
          console.error('Error fetching carousel images:', error);
          // Use the main image and default carousel images as fallback
          setCarouselImages([plantData.mainImage, ...defaultCarouselImages]);
        } finally {
          setLoadingImages(false);
        }
      }
    };

    fetchCarouselImages();
  }, [plantData.name, plantData.mainImage]);

  const handleOpenModal = useCallback((type: string, item: any) => {
    setActiveModal(type);
    setModalContent(item);
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseModal = useCallback(() => {
    bottomSheetRef.current?.close();
    setTimeout(() => {
      setActiveModal(null);
      setModalContent(null);
    }, 300);
  }, []);

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
                  <Text className="text-gray-600 text-sm">{item.subtitle}</Text>
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
    
    return (
      <View className="mb-6">
        <H2 className="mb-2 px-4">Health Condition</H2>
        <View className="bg-white rounded-xl shadow-sm mx-4 p-4">
          <H3 className="text-red-500 mb-1">{plantData.diseaseName}</H3>
          <Body>{plantData.diseaseDescription}</Body>
        </View>
      </View>
    );
  };

  const renderCarouselItem = ({ item }: { item: string }) => {
    return (
      <Image
        source={{ uri: item }}
        className="h-28 rounded-lg"
        style={{ width: screenWidth * 0.35 }}
        resizeMode="cover"
      />
    );
  };

  return (
    <View className="flex-1 bg-background">
      <AppBar title="Plant Details" showBackButton />
      
      <ScrollView className="flex-1">
        {/* Plant header image */}
        <Image
          source={{ uri: plantData.mainImage }}
          className="w-full h-56"
          resizeMode="cover"
        />
        
        {/* Plant information */}
        <View className="bg-white p-4 -mt-4 rounded-t-3xl shadow-sm">
          <H1 className="text-primary">{plantData.name}</H1>
          <View className="flex-row flex-wrap items-baseline mt-1">
            <Text className="text-gray-600 mr-1">Genus:</Text>
            <Text className="font-medium mr-3">{plantData.genus}</Text>
            <Text className="text-gray-600 mr-1">Family:</Text>
            <Text className="font-medium">{plantData.family}</Text>
          </View>
          <Text className="text-gray-600 italic mt-1">{plantData.scientificName}</Text>
        </View>
        
        {/* Image carousel */}
        <View className="mt-3 mb-5">
          <H2 className="mb-2 px-4">Gallery</H2>
          
          {loadingImages ? (
            <View className="h-28 justify-center items-center">
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text className="text-gray-600 mt-2">Loading plant images...</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={carouselImages}
                renderItem={renderCarouselItem}
                keyExtractor={(item, index) => `image-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
                onMomentumScrollEnd={(event) => {
                  const contentOffset = event.nativeEvent.contentOffset.x;
                  const index = Math.round(contentOffset / (screenWidth * 0.35 + 10));
                  setCarouselIndex(index);
                }}
              />
              
              {/* Pagination dots */}
              <View className="flex-row justify-center mt-2">
                {carouselImages.map((_, index) => (
                  <View
                    key={`dot-${index}`}
                    className={`h-2 w-2 rounded-full mx-1 ${
                      carouselIndex === index ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </View>
            </>
          )}
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
              <Body className="text-base leading-6">{modalContent.description}</Body>
            </ScrollView>
          </View>
        )}
      </BottomSheet>
    </View>
  );
} 