import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";

import { TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  containerStyle?: object;
  inputRef?: React.RefObject<TextInput>;
  icon?: React.ReactNode;
}

const Input = (props: InputProps) => {
  // const { icon, containerStyle, inputRef, ...rest } = props;
  return (
    <View
      style={[styles.container, props.containerStyle && props.containerStyle]}
    >
      {props.icon && props.icon}
      <TextInput
        style={{ flex: 1 }}
        placeholderTextColor={theme.colors.textLight}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: hp(7.2),
    alignItems: "center",
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    paddingHorizontal: 18,
    gap: 12,
  },
  iconContainer: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
  },
});
