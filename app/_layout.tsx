import { Stack } from "expo-router";
import './globals.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      />
    </GestureHandlerRootView>
  );
}
