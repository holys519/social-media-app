import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router, useRouter } from 'expo-router'
import BackButton from './BackButton';
import { hp } from '@/helpers/common';
import { theme } from '@/constants/theme';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  mb?: number;
}

const Header: React.FC<HeaderProps> = ({title, showBackButton=false, mb=10}) => {
    const router = useRouter();
  return (
    <View style={[styles.container, {marginBottom: mb}]}>
        {
            showBackButton && (
                <View style={styles.backButton}>
                    <BackButton router={router} />
                </View>
            )
        }
      <Text style={styles.title}>{title || ""}</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        gap: 10
    },
    title: {
        fontSize: hp(2.7),
        fontWeight: '600',
        color: theme.colors.textDark
    },
    backButton: {
        position: 'absolute',
        left: 0
    }
})