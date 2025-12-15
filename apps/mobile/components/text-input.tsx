import {
  TextInput as RNTextInput,
  TextInputProps,
  StyleSheet,
} from "react-native";
import {forwardRef} from "react";
import {useAppTheme} from "@/providers/ThemeProvider";

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({style, ...props}, ref) => {
    const {colors} = useAppTheme();
    return (
      <RNTextInput
        ref={ref}
        style={[styles.defaultInput, {color: colors.text}, style]}
        {...props}
      />
    );
  }
);

TextInput.displayName = "TextInput";

const styles = StyleSheet.create({
  defaultInput: {
    fontFamily: "delius",
  },
});
