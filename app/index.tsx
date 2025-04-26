import React, { useState } from 'react'
import {
  View,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  StyleSheet,
  Animated,
} from 'react-native'
import { router, Href } from 'expo-router'
import HomeHero from '../components/organisms/HomeHero'
import WeatherCard from '../components/organisms/WeatherCard'
import { MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons'

// Colors
type Tab = 'home' | 'search' | 'notifications' | 'profile'
const primaryColor = '#3b8d75'
const inactiveColor = '#888'
const lightTint = 'rgba(59,141,117,0.1)'

// Category Data
const categories = [
  { key: 'leaf', image: require('../assets/images/leaf.jpg'), label: 'Leaf Plants' },
  { key: 'flower', image: require('../assets/images/flower.jpg'), label: 'Flower' },
  { key: 'trees', image: require('../assets/images/trees.png'), label: 'Trees' },
  { key: 'succulents', image: require('../assets/images/succulents.jpg'), label: 'Succulents' },
]

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const handleScanPress = () => router.push('scan' as Href)
  const { width } = Dimensions.get('window')
  const cardSize = (width - 48) / 2
  const bannerHeight = Math.round(width * 0.35)

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Weather with smaller vertical inset */}
        <View style={[styles.section, styles.weatherInset]}>
          <WeatherCard />
        </View>

        {/* Hero with light tinted background */}
        <View style={[styles.section, styles.heroWrapper]}>
          <HomeHero
            title="Plant Disease Detection"
            tagline="Keep Your Plants Healthy!"
            buttonText="Scan Plant"
            onPress={handleScanPress}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.gridContainer}>
            {categories.map((cat) => (
              <AnimatedTouchable
                key={cat.key}
                style={[styles.card, { width: cardSize, height: 120 }]}
                activeOpacity={0.9}
                onPress={() => console.log(`Tapped ${cat.label}`)}
              >
                <Image
                  source={cat.image}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.gradientOverlay} />
                <Text style={styles.cardLabel}>{cat.label}</Text>
              </AnimatedTouchable>
            ))}
          </View>
        </View>

        {/* Vegetable banner with proportional height */}
        <View style={[styles.section, styles.sectionPadding]}>  
          <AnimatedTouchable
            style={[styles.bannerContainer, { height: bannerHeight }]}
            activeOpacity={0.9}
            onPress={() => console.log('Tapped Vegetables')}
          >
            <Image
              source={require('../assets/images/vegetables.jpg')}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </AnimatedTouchable>
        </View>
      </ScrollView>

      {/* Bottom Navigation with active indicator */}
      <View style={styles.navbar}>
        {['home','search','notifications','profile'].map((tab, idx) => {
          const Icon = {
            home: () => <MaterialIcons name="home" size={28} color={activeTab==='home'?primaryColor:inactiveColor}/>,
            search: () => <Entypo name="magnifying-glass" size={28} color={activeTab==='search'?primaryColor:inactiveColor}/>,
            notifications: () => <MaterialIcons name="notifications" size={28} color={activeTab==='notifications'?primaryColor:inactiveColor}/>,
            profile: () => <MaterialCommunityIcons name="leaf" size={28} color={activeTab==='profile'?primaryColor:inactiveColor}/>  
          }[tab as Tab]
          return (
            <TouchableOpacity
              key={tab}
              style={styles.navItem}
              onPress={() => setActiveTab(tab as Tab)}
            >
              <Icon />
              {activeTab === tab && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

// Wrap TouchableOpacity in Animated for press scaling
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8fa' },
  scrollContent: { paddingBottom: 100 },
  section: { marginVertical: 24 },
  sectionPadding: { paddingHorizontal: 16 },
  weatherInset: { paddingHorizontal: 16, paddingVertical: 8 },
  heroWrapper: { backgroundColor: lightTint, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 12 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16 },
  card: { borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 1 }, shadowRadius: 3, marginBottom: 16 },
  cardImage: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  gradientOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  cardLabel: { position: 'absolute', bottom: 8, left: 12, color: '#fff', fontSize: 14, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  bannerContainer: { borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 1 }, shadowRadius: 3 },
  bannerImage: { width: '100%', height: '100%' },
  navbar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: -2 }, shadowRadius: 8 },
  navItem: { alignItems: 'center', justifyContent: 'center', width: 64 },
  activeIndicator: { position: 'absolute', top: 4, width: 32, height: 3, backgroundColor: primaryColor, borderRadius: 2 },
})
