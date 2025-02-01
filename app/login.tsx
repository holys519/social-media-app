import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons";
import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import BackButton from "@/components/BackButton";
import { useRouter } from "expo-router";
import { hp, wp } from "../helpers/common";
import Input from "../components/Input";
import Button from "../components/Button";
import { supabase } from "../lib/supabase";

const login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }
    // good to go
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    // console.log("error: ", error);
    if (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <ScreenWrapper bg={""}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />

        {/* welcome */}
        <View>
          <Text style={styles.welcomeText}>Hey,</Text>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Plese login to continue
          </Text>
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email"
            onChangeText={(value: string) => (emailRef.current = value)}
          />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(value: string) => (passwordRef.current = value)}
          />
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
          {/* Button */}
          <Button title={"Login"} loading={loading} onPress={onSubmit} />
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Pressable onPress={() => router.push("./signUp")}>
            <Text
              style={[
                styles.footerText,
                { color: theme.colors.primaryDark, fontWeight: "600" },
              ]}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: "600", // or another valid value from the accepted set
    color: theme.colors.text,
  },
  form: {
    gap: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
  forgotPassword: {
    textAlign: "right",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
