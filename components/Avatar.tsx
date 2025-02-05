import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { hp } from "../helpers/common";
import { theme } from "@/constants/theme";
import { Image } from "expo-image";
import { getUserImageSrc } from "@/services/imageService";

interface AvatarProps {
  uri: string | { uri: string } | null;
  size?: number;
  rounded?: number;
  style?: object;
}

const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = hp(4.5),
  rounded = Number(theme.radius.md),
  style = {},
}) => {
  let imagePath = "";
  if (typeof uri === "string") {
    try {
      // JSON文字列としてパースを試みる
      const parsed = JSON.parse(uri);
      imagePath = parsed.uri || "";
    } catch (error) {
      // パースできなければそのまま利用
      imagePath = uri;
    }
  } else if (typeof uri === "object" && uri !== null) {
    imagePath = uri.uri;
  }
  return (
    <Image
      source={getUserImageSrc(imagePath)}
      transition={100}
      style={[
        styles.avatar,
        { height: size, width: size, borderRadius: rounded },
        style,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: "continuous",
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
  },
});
