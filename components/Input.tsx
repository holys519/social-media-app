import { StyleSheet, TextInput, View, TextInputProps } from "react-native";
import React, { useImperativeHandle, useRef } from "react"; // Import useImperativeHandle and useRef
import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";

interface InputRef {
  clear: () => void;
  focus: () => void; // Add focus if needed
}

interface InputProps extends TextInputProps {
  containerStyle?: object;
  inputRef?: React.RefObject<InputRef>;
  icon?: React.ReactNode;
}

const Input = ({ inputRef, icon, containerStyle, ...props }: InputProps) => {
  const textInputRef = useRef<TextInput>(null); // Ref to the actual TextInput

  useImperativeHandle(inputRef, () => ({
    clear: () => {
      textInputRef.current?.clear();
    },
    focus: () => {
      // Expose focus if needed
      textInputRef.current?.focus();
    },
  }));

  return (
    <View style={[styles.container, containerStyle]}>
      {icon && icon}
      <TextInput
        style={{ flex: 1 }}
        placeholderTextColor={theme.colors.textLight}
        ref={textInputRef} // Assign the internal ref here
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
