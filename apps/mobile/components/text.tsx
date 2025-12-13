import {Text as RNText, TextProps, StyleSheet} from "react-native";
import {FC} from "react";

interface CustomTextProps extends TextProps {
  variant?: "default" | "title" | "heading" | "body" | "caption";
}


export const Text: FC<CustomTextProps> = ({
  style,
  variant = "default",
  ...props
}) => {
  const variantStyle = variant !== "default" ? styles[variant] : undefined;
  return (
    <RNText style={[styles.defaultText, variantStyle, style]} {...props} />
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: "delius",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
  },
});
