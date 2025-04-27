import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { router, Href } from 'expo-router'
import BottomBar from '../BottomBar'

const primaryColor = '#3b8d75'
const inactiveColor = '#888'

type Tab = 'home' | 'diagnose' | 'capture' | 'myplants' | 'account'

interface CameraViewAlternativeProps {
  onCapture: (uri: string) => void
}

export default function CameraViewAlternative({ onCapture }: CameraViewAlternativeProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('capture')

  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 1 })
    if (!result.canceled && result.assets.length) {
      const uri = result.assets[0].uri
      setPreviewImage(uri)
      onCapture(uri)
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 })
    if (!result.canceled && result.assets.length) {
      const uri = result.assets[0].uri
      setPreviewImage(uri)
      onCapture(uri)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Top Bar */}
      <View style={styles.appBar}>
        <MaterialCommunityIcons name="leaf" size={28} color={primaryColor} />
        <Text style={styles.appTitle}></Text>
        {/* <MaterialIcons name="notifications-none" size={24} color={inactiveColor} /> */}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/illustration.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
        <Text style={styles.heading}>Let’s get started</Text>
        <Text style={styles.subheading}>
          Get professional plant care guidance to keep your plant alive!
        </Text>

        {previewImage && (
          <Image source={{ uri: previewImage }} style={styles.preview} resizeMode="cover" />
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={takePicture}>
          <Ionicons name="camera-outline" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={20} color={primaryColor} />
          <Text style={styles.secondaryButtonText}>Select from Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Bar */}
      <BottomBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  appBar: { height: 56, backgroundColor: primaryColor, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  appTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  content: { flex: 1, alignItems: 'center', padding: 16 },
  illustration: { width: 180, height: 180, marginBottom: 16 },
  heading: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 8 },
  subheading: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 24 },
  preview: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: primaryColor, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24, width: '100%', marginBottom: 12 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderColor: primaryColor, borderWidth: 1, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24, width: '100%' },
  secondaryButtonText: { color: primaryColor, fontSize: 16, fontWeight: '600', marginLeft: 8 },
})
