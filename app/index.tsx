import React, { useState } from 'react'
import {
  View,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
} from 'react-native'
import { router, Href } from 'expo-router'
import HomeHero from '../components/organisms/HomeHero'
import WeatherCard from '../components/organisms/WeatherCard'
import { MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons'

// Primary and inactive colors
type Tab = 'home' | 'search' | 'notifications' | 'profile'
const primaryColor = '#3b8d75'
const inactiveColor = '#888'

// Category Data
const categories = [
  { name: 'Leaf Plants', image: require('../assets/images/leaf.jpg') },
  { name: 'Flower',      image: require('../assets/images/flower.jpg') },
  { name: 'Trees',       image: require('../assets/images/trees.png') },
  { name: 'Vegetables',  image: require('../assets/images/vegetables.jpg') },
  { name: 'Succulents',  image: require('../assets/images/succulents.jpg') },
]

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const handleScanPress = () => router.push('scan' as Href)

  const screenWidth = Dimensions.get('window').width
  const gap = 16
  const cellWidth = (screenWidth - gap * 3) / 2 // two columns spacing
  const vegHeight = 120

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Weather */}
        <View className="px-4 pt-4">
          <WeatherCard />
        </View>

        {/* Hero */}
        <HomeHero
          title="Plant Disease Detection"
          tagline="Keep Your Plants Healthy!"
          buttonText="Scan Plant"
          onPress={handleScanPress}
        />

        {/* Grid Layout */}
        <Text className="text-lg font-bold text-gray-800 px-4 mt-6 mb-2">
          Categories
        </Text>
        <View style={{ paddingHorizontal: gap }}>
          {/* Row 1: Leaf & Flower */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: gap }}>
            {[categories[0], categories[1]].map((cat) => (
              <TouchableOpacity
                key={cat.name}
                activeOpacity={0.8}
                style={{
                  width: cellWidth,
                  height: 120,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: '#ccc',
                  overflow: 'hidden',
                }}
                onPress={() => console.log(`Tapped ${cat.name}`)}
              >
                <Image source={cat.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Row 2: Trees & Succulents */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: gap }}>
            {[categories[2], categories[4]].map((cat) => (
              <TouchableOpacity
                key={cat.name}
                activeOpacity={0.8}
                style={{
                  width: cellWidth,
                  height: 120,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: '#ccc',
                  overflow: 'hidden',
                }}
                onPress={() => console.log(`Tapped ${cat.name}`)}
              >
                <Image source={cat.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Row 3: Vegetable Full-width Rectangle */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: '100%',
              height: vegHeight,
              borderRadius: 12,
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: '#ccc',
              overflow: 'hidden',
            }}
            onPress={() => console.log('Tapped Vegetables')}
          >
            <Image source={categories[3].image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 h-16 bg-white flex-row justify-around items-center rounded-t-xl shadow-lg">
        <TouchableOpacity onPress={() => setActiveTab('home')}>
          <MaterialIcons name="home" size={24} color={activeTab === 'home' ? primaryColor : inactiveColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('search')}>
          <Entypo name="magnifying-glass" size={24} color={activeTab === 'search' ? primaryColor : inactiveColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('notifications')}>
          <MaterialIcons name="notifications" size={24} color={activeTab === 'notifications' ? primaryColor : inactiveColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('profile')}>
          <MaterialCommunityIcons name="leaf" size={24} color={activeTab === 'profile' ? primaryColor : inactiveColor} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
