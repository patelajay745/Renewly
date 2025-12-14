import {Text as RNText, TextProps, StyleSheet} from "react-native";
import {FC} from "react";
import {useAppTheme} from "@/providers/ThemeProvider";

interface CustomTextProps extends TextProps {
  variant?: "default" | "title" | "heading" | "body" | "caption";
  muted?: boolean;
}

export const Text: FC<CustomTextProps> = ({
  style,
  variant = "default",
  muted = false,
  ...props
}) => {
  const variantStyle = variant !== "default" ? styles[variant] : undefined;
  const {colors} = useAppTheme();
  return (
    <RNText
      style={[
        styles.defaultText,
        variantStyle,
        {color: colors.text},
        muted && {color: colors.textMuted},
        style,
      ]}
      {...props}
    />
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
