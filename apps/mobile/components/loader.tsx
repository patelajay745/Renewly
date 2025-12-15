import {useAppTheme} from "@/providers/ThemeProvider";
import {Loader2} from "lucide-react-native";
import {FC, useRef, useEffect} from "react";
import {View, StyleSheet, Animated, Easing} from "react-native";

interface Props {
 
}

const Loader: FC<Props> = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const spinAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const {colors} = useAppTheme();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    spinValue.setValue(0);
    spinAnimation.current = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    spinAnimation.current?.start();
  }, []);
  return (
    <Animated.View style={{transform: [{rotate: spin}]}}>
      <Loader2 color={colors.foregroundText} size={24} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Loader;
