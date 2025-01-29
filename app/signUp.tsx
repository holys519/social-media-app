import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '@/constants/theme'
import Icon from '@/assets/icons'
import React, { useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import BackButton from '@/components/BackButton'
import { useRouter } from 'expo-router'
import { hp, wp } from '../helpers/common'
import Input from '../components/Input'
import Button from '../components/Button'
import { supabase } from '../lib/supabase'

const SignUp = () => {
    const router = useRouter();
    const emailRef = useRef("");
    const nameRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if(!emailRef.current || !passwordRef.current) {
            Alert.alert("Sign Up", "Please fill all fields");
            return;
        }
        // good to go
        let name = nameRef.current.trim();
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();

        setLoading(true);

        const { data: {session}, error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                }
            }
        });

        setLoading(false);

        console.log("session: ", session);
        console.log("error: ", error);
        if(error){
            Alert.alert("Sign Up", error.message);
        }
    }
  return (
    <ScreenWrapper bg={''}>
        <StatusBar style='dark'/>
        <View style={styles.container}>
            <BackButton router={router}/>

            {/* welcome */}
            <View>
                <Text style={styles.welcomeText}>Let's</Text>
                <Text style={styles.welcomeText}>Get Started</Text>
            </View>

            {/* form */}
            <View style={styles.form}>
                <Text style={{fontSize: hp(1.5), color:theme.colors.text}}>
                    Plese fill the datails to create an account
                </Text>
                <Input
                    icon={<Icon name='user' size={26} strokeWidth={1.6}/>}
                    placeholder="Enter your name"
                    onChangeText={(value: string) => nameRef.current = value}
                />
                <Input
                    icon={<Icon name='mail' size={26} strokeWidth={1.6}/>}
                    placeholder="Enter your email"
                    onChangeText={(value: string) => emailRef.current = value}
                />
                <Input
                    icon={<Icon name='lock' size={26} strokeWidth={1.6}/>}
                    placeholder="Enter your password"
                    secureTextEntry
                    onChangeText={(value: string) => passwordRef.current = value}
                />
                {/* Button */}
                <Button title={"Sign up"} loading={loading} onPress={onSubmit}/>
            </View>
            {/* footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Already have an account!
                </Text>
                <Pressable onPress={() => router.push('./login')}>
                    <Text style={[styles.footerText, {color: theme.colors.primaryDark, fontWeight: '600'}]}>Login</Text>
                </Pressable>
            </View>
        </View>
    </ScreenWrapper>
  )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5),
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: '600', // or another valid value from the accepted set
        color: theme.colors.text,
    },
    form: {
        gap: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6),
    },
    forgotPassword: {
        textAlign: 'right',
        color: theme.colors.text,
        fontSize: hp(1.6),
    },
})
