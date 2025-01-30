import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useRouter } from 'expo-router'
import { getUserData } from '../services/userService'

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth() as { setAuth: (user: any) => void; setUserData: (data: any) => void };
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("session user: ", session?.user?.id);

      if(session){
        setAuth(session?.user);
        updateUserData(session?.user);
        router.push('/home');
      }else{
        setAuth(null);
        router.push('/welcome');
      }
    })
  }, [])
  const updateUserData = async (user: any) => {
    let res = await getUserData(user?.id);
    if(res.success) setUserData(res.data);
  }
  return (

    <Stack screenOptions={{
        headerShown: false
    }} />
  )
}

export default _layout