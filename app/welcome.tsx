import { Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { hp, wp } from '@/helpers/common'
import { theme } from '../constants/theme'
import Button from '../components/Button'

const Welcome = () => {
  return (
    <ScreenWrapper bg='white'>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
            {/* welcome Image */}
            <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/images/welcome.png')}/>

            {/* title */}
            <Text style={{gap: 20}}>
                <Text style={styles.title}>LinkUp!</Text>
                {"\n"}
                <Text style={styles.punchine}>
                    Where every thought finds a home and every image tells a story
                </Text>
            </Text>

            {/* footer */}
            <View style={styles.footer}>
                <Button
                    title="Getting Started"
                    buttonStyle={{marginHorizontal: wp(3)}}
                    onPress={() => {}}
                />
                <View style={styles.bottomTextContainer}>
                    <Text style={styles.loginText}>
                        Already have an account!
                    </Text>
                    <Pressable>
                        <Text style={[styles.loginText, {color: theme.colors.primaryDark, fontWeight: '600'}]}>
                            Login
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingHorizontal: wp(4)
    },
    welcomeImage: {
        width: wp(300),
        height: wp(100),
        alignSelf: 'center',
    },
    title: {
        color: theme.colors.text,
        height: hp(300),
        width: wp(100),
        fontWeight: 'bold',
    },
    punchine: {
        textAlign: 'center',
        paddingHorizontal: wp(10),
        fontSize: hp(1.7),
        color: theme.colors.text
    },
    footer: {
        gap: 30,
        width: '100%'
    },
    bottomTextContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    loginText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6)
    }
})