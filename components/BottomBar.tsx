import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const primaryColor = '#3b8d75'
const inactiveColor = '#888'

type Tab = 'home' | 'diagnose' | 'capture' | 'myplants' | 'account'

interface BottomBarProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

export default function BottomBar({ activeTab, setActiveTab }: BottomBarProps) {
  const router = useRouter()
  const handlePress = (tab: Tab, route: string) => {
    setActiveTab(tab)
    router.push(route)
  }

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handlePress('home', '/home')}
      >
        <MaterialIcons
          name="home"
          size={28}
          color={activeTab === 'home' ? primaryColor : inactiveColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handlePress('diagnose', '/diagnose')}
      >
        <MaterialCommunityIcons
          name="stethoscope"
          size={28}
          color={activeTab === 'diagnose' ? primaryColor : inactiveColor}
        />
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={[styles.navItem, styles.captureTab]}
        onPress={() => handlePress('capture', '/scan')}
      >
        <MaterialIcons name="camera-alt" size={28} color="#fff" />
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handlePress('myplants', '/myplant')}
      >
        <MaterialCommunityIcons
          name="flower"
          size={28}
          color={activeTab === 'myplants' ? primaryColor : inactiveColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handlePress('account', '/account')}
      >
        <MaterialCommunityIcons
          name="account"
          size={28}
          color={activeTab === 'account' ? primaryColor : inactiveColor}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',  // evenly space the four tabs
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureTab: {
    position: 'absolute',
    top: -28,
    alignSelf: 'center',
    backgroundColor: primaryColor,
    padding: 12,
    borderRadius: 28,
  },
})
