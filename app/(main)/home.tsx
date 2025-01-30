import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Alert } from 'react-native'
import { wp, hp } from '@/helpers/common'
import { theme } from '@/constants/theme'

const Home = () => {
    const authContext = useAuth();
    if (!authContext) {
        return null;
    }
    const { setAuth } = authContext;

    const onLogin = async () => {
        // setAuth(null);
        const { error } = await supabase.auth.signOut();
        if(error) {
            Alert.alert('Sign out', "Error signing out");
        }
        console.log("login");
    }
  return (
    <ScreenWrapper bg={''}>
      <Text>Home</Text>
      <Button title="login" onPress={onLogin}/>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginHorizontal: wp(4)
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(3.2),
        fontWeight: 'bold',
    },
    avatarImage: {
        height: hp(4.3),
        width: hp(4.3),
        borderRadius: theme.radius.sm,
        borderCurve: 'continuous',
        borderColor: theme.colors.gray,
        borderWidth: 3,
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    listStyle: {
        paddingTop: 20,
        paddingHorizontal: wp(4),
    },
    onPosts: {
        fontSize: hp(2),
        textAlign: 'center',
        color: theme.colors.text,
    },
    pill: {
        position: 'absolute',
        right: -10,
        top: -4,
        height: hp(2.2),
        width: hp(2.2),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: theme.colors.roseLight,
    },
    pillText: {
        color: 'white',
        fontSize: hp(1.2),
        fontWeight: 'bold',
    }
})