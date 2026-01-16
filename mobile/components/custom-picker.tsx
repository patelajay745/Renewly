import {semanticColors} from "@/constants/theme";
import {CheckIcon, ChevronDown} from "lucide-react-native";
import React, {FC, useRef, useState} from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  Modal,
  useColorScheme,
  ScrollView,
  Platform,
} from "react-native";
import {Text} from "./text";
import {useAppTheme} from "@/providers/ThemeProvider";

export interface PickerOption {
  label: string;
  value: string;
}

interface Props {
  options: PickerOption[];
  selectedValue: string;
  onValueChange: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
}

const {height: screenHeight} = Dimensions.get("window");

const CustomPicker: FC<Props> = ({
  options,
  selectedValue,
  onValueChange,
  placeholder,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [tempSelectedValue, setTempSelectedValue] = useState(selectedValue);
  const {colors} = useAppTheme();

  const openPicker = () => {
    setIsVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  

  const closePicker = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start(() => {
      setIsVisible(false);
      setTempSelectedValue(selectedValue);
    });
  };

  const handleSelect = () => {
    onValueChange(tempSelectedValue);
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start(() => setIsVisible(false));
  };
  return (
    <>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
          },
        ]}
        onPress={openPicker}
      >
        <Text style={[styles.pickerButtonText, {color: colors.text}]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={20} color={colors.text} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={closePicker}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackDrop}
            onPress={closePicker}
            activeOpacity={1}
          />
          <Animated.View
            style={[
              styles.pickerContainer,
              {transform: [{translateY: slideAnim}]},
              {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: `${colors.foreground}40`,
              },
            ]}
          >
            <View
              style={[
                styles.pickerHeader,
                {borderBottomColor: colors.background},
              ]}
            >
              <Text
                style={[styles.pickerTitle, {color: colors.text}]}
                variant="heading"
              >
                Select Option
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.optionContainer}
            >
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    {borderBottomColor: colors.borderLight},
                    index === options.length - 1 && styles.lastOption,
                    tempSelectedValue === option.value && {
                      backgroundColor: `${colors.primary}15`,
                    },
                  ]}
                  onPress={() => setTempSelectedValue(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {color: colors.text},
                      tempSelectedValue === option.value &&
                        styles.selectedOptionText,
                      ,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {tempSelectedValue === option.value && (
                    <CheckIcon size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.borderMuted,
                  },
                ]}
                onPress={closePicker}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.foreground,
                    fontWeight: 500,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSelect}
                style={[styles.button, {backgroundColor: colors.foreground}]}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.background,
                    fontWeight: 500,
                  }}
                >
                  Select
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    fontSize: 18,
    borderRadius: 12,
    borderWidth: 1,
  },
  pickerButtonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalBackDrop: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.8,
  },
  pickerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 600,
  },
  optionContainer: {
    maxHeight: screenHeight * 0.7,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  lastOption: {borderBottomWidth: 0},
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  selectedOptionText: {fontWeight: "500"},

  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomPicker;
