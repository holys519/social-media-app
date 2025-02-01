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
  console.log("uri log: ", uri);
  const imagePath =
    typeof uri === "object" && uri !== null ? uri.uri : uri || "";
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
