import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useAuth } from '@/contexts/AuthContext'
import { router, useRouter } from 'expo-router'
import Header from '@/components/Header'
import { wp } from '@/helpers/common'

const Profile= () => {
    const authContext = useAuth();
    if (!authContext) {
        return null; // or handle the null case appropriately
    }
    const { user, setAuth } = authContext;
    const router = useRouter();
  return (
    <ScreenWrapper bg='white'>
      <UserHeader user={user} router={router}/>
    </ScreenWrapper>
  )
}

interface UserHeaderProps {
  user: any; // Replace 'any' with the appropriate type if available
  router: ReturnType<typeof useRouter>;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user, router }) => {
    return (
        <View style={{flex:1, backgroundColor:'white', paddingHorizontal: wp(4)}}>
            <View>
                <Header title='Profile' showBackButton={true}/>
            </View>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({})