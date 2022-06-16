import React from 'react'
import AppLoading from 'expo-app-loading'
import { Image, Text } from 'react-native'
import { useState } from 'react'
import * as Font from 'expo-font'
import { Ionicons } from '@expo/vector-icons'
import { Asset, useAssets } from 'expo-asset'
import { NavigationContainer } from '@react-navigation/native'
import Tabs from './navigation/Tabs'
import Stack from './navigation/Stack'
import Root from './navigation/Root'

export default function App() {
  const [assets] = useAssets([require('./assets/1.png')])
  const [loaded] = Font.useFonts(Ionicons.font)
  return !assets || !loaded ? (
    <AppLoading />
  ) : (
    <NavigationContainer>
      <Root />
    </NavigationContainer>
  )
}
