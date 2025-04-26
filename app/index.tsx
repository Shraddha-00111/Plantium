import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  StatusBar,
} from 'react-native'
import { router, Href } from 'expo-router'
import { MaterialIcons, Entypo, MaterialCommunityIcons, Feather } from '@expo/vector-icons'

// Color Palette
const primaryColor = '#3b8d75'
const inactiveColor = '#888'
const lightTint = 'rgba(59,141,117,0.1)'

// Screen calculations
const screenWidth = Dimensions.get('window').width
const cardWidth = (screenWidth - 48) / 2

// Popular articles matching the inspiration UI
const popularArticles = [
  {
    id: '1',
    title: 'Unlock the Secrets of Succulents: Care Tips for Your Collection',
    image: require('../assets/images/succulents.jpg'),
  },
  {
    id: '2',
    title: 'The Ultimate Guide to Indoor Plants: From Foliage to Flowers',
    image: require('../assets/images/leaf.jpg'),
  },
]

// Explore categories with vector icons
const exploreCategories = [
  { key: 'succulents', label: 'Succulents & Cacti', iconName: 'cactus' },
  { key: 'flowering', label: 'Flowering Plants', iconName: 'flower' },
  { key: 'foliage', label: 'Foliage Plants', iconName: 'leaf' },
  { key: 'trees', label: 'Trees', iconName: 'tree' },
  { key: 'weeds', label: 'Weeds & Shrubs', iconName: 'shrub' },
  { key: 'fruits', label: 'Fruits', iconName: 'food-apple' },
  { key: 'vegetables', label: 'Vegetables', iconName: 'food-variant' },
  { key: 'herbs', label: 'Herbs', iconName: 'sprout' },
  { key: 'mushrooms', label: 'Mushrooms', iconName: 'mushroom' },
  { key: 'toxic', label: 'Toxic Plants', iconName: 'skull' },
]

type Tab = 'home' | 'diagnose' | 'camera' | 'myplants' | 'account'
export default function HomeScreen() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('home')

  const renderArticle = ({ item }: any) => (
    <TouchableOpacity style={styles.articleCard} activeOpacity={0.8}>
      <Image source={item.image} style={styles.articleImage} />
      <Text style={styles.articleTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  )

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity style={styles.categoryCard} activeOpacity={0.8}>
      <MaterialCommunityIcons name={item.iconName} size={48} color={primaryColor} />
      <Text style={styles.categoryLabel}>{item.label}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="leaf" size={28} color={primaryColor} />
        <Text style={styles.title}>Plantify</Text>
        <View style={styles.headerIcons}>
          <View style={styles.iconDotWrapper}>
            <MaterialIcons name="notifications-none" size={24} color={inactiveColor} />
            <View style={styles.redDot} />
          </View>
          <Feather name="bookmark" size={24} color={inactiveColor} />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={inactiveColor} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search plants..."
          style={styles.searchInput}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Popular Articles */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Articles</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
            <Entypo name="chevron-right" size={16} color={primaryColor} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={popularArticles}
          renderItem={renderArticle}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />

        {/* Ask Plant Expert */}
        <View style={styles.expertCard}>
          <View style={styles.expertText}>
            <Text style={styles.expertTitle}>Ask Plant Expert</Text>
            <Text style={styles.expertSubtitle}>
              Our botanists are ready to help with your problems.
            </Text>
          </View>
          <TouchableOpacity style={styles.expertButton}>
            <Text style={styles.expertButtonText}>Ask the Experts</Text>
          </TouchableOpacity>
        </View>

        {/* Explore Plants Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Plants</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
            <Entypo name="chevron-right" size={16} color={primaryColor} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={exploreCategories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.key}
          numColumns={2}
          columnWrapperStyle={styles.categoryRow}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('home')}
        >
          <MaterialIcons
            name="home"
            size={28}
            color={activeTab === 'home' ? primaryColor : inactiveColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('diagnose')}
        >
          <MaterialCommunityIcons
            name="stethoscope"
            size={28}
            color={activeTab === 'diagnose' ? primaryColor : inactiveColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, styles.cameraTab]}
          onPress={() => router.push('scan' as Href)}
        >
          <MaterialIcons name="camera-alt" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('myplants')}
        >
          <MaterialCommunityIcons
            name="flower"
            size={28}
            color={activeTab === 'myplants' ? primaryColor : inactiveColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('account')}
        >
          <MaterialCommunityIcons
            name="account"
            size={28}
            color={activeTab === 'account' ? primaryColor : inactiveColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: { fontSize: 18, fontWeight: '700' },
  headerIcons: {
    flexDirection: 'row',
    width: 60,
    justifyContent: 'space-between',
  },
  iconDotWrapper: { position: 'relative' },
  redDot: {
    position: 'absolute',
    top: 0,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f00',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: { marginLeft: 8, flex: 1, fontSize: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  viewAll: { color: primaryColor, fontSize: 14, marginRight: 4 },
  articleCard: { width: 200, marginRight: 16, borderRadius: 12, overflow: 'hidden' },
  articleImage: { width: '100%', height: 120 },
  articleTitle: { padding: 8, fontSize: 14, fontWeight: '600' },
  expertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightTint,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  expertText: { flex: 1 },
  expertTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  expertSubtitle: { fontSize: 14, color: '#555' },
  expertButton: { backgroundColor: primaryColor, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  expertButtonText: { color: '#fff', fontWeight: '600' },
  categoryRow: { justifyContent: 'space-between', marginBottom: 16 },
  categoryCard: { width: cardWidth, alignItems: 'center' },
  categoryLabel: { marginTop: 8, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  tabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cameraTab: {
    backgroundColor: primaryColor,
    marginBottom: 16,
    borderRadius: 32,
    width: 64,
    height: 64,
    alignSelf: 'center',
    justifyContent: 'center',
  },
})
