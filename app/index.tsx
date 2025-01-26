import { View, Text, Button } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'

const index = () => {
  return (
    <ScreenWrapper bg='white'>
      <Text>index</Text>
      <Button title='welcome' onPress={() => router.push('/welcome')} />
    </ScreenWrapper>
  )
}

export default index