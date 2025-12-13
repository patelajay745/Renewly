import {
  TextInput as RNTextInput,
  TextInputProps,
  StyleSheet,
} from "react-native";
import {forwardRef} from "react";

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({style, ...props}, ref) => {
    return (
      <RNTextInput ref={ref} style={[styles.defaultInput, style]} {...props} />
    );
  }
);

TextInput.displayName = "TextInput";

const styles = StyleSheet.create({
  defaultInput: {
    fontFamily: "delius",
  },
});
