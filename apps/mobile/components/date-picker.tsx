import {FC, useCallback, useRef, useState} from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
  Easing,
  useColorScheme,
  ScrollView,
  Platform,
} from "react-native";
import {semanticColors} from "@/constants/theme";
import {CalendarIcon, ChevronLeft, ChevronRight} from "lucide-react-native";
import {Text} from "./text";
import {useAppTheme} from "@/providers/ThemeProvider";

interface BaseDatePickerProps {
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  style?: ViewStyle;
  minimumDate?: Date;
  maximumDate?: Date;
  variant?: "filled" | "outline" | "group";
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

interface Props extends BaseDatePickerProps {
  value?: Date;
  onChange?: (value: Date | undefined) => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({length: 101}, (_, i) => currentYear - 50 + i);

const {height: screenHeight} = Dimensions.get("window");

const DatePicker: FC<Props> = ({
  label,
  error,
  placeholder = "Select date",
  disabled = false,
  style,
  minimumDate,
  maximumDate,
  variant = "filled",
  labelStyle,
  errorStyle,
  value,
  onChange,
}) => {
  const getCurrentDate = useCallback(() => {
    return (value as Date) || new Date();
  }, [value]);

  const [currentDate, setCurrentDate] = useState(() => getCurrentDate());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | undefined>(
    value
  );
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const {colors} = useAppTheme();

  const openPicker = () => {
    const defaultDate = getCurrentDate();
    setCurrentDate(defaultDate);
    setTempSelectedDate(value);
    setShowMonthPicker(false);
    setShowYearPicker(false);
    setIsVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return placeholder;
    const month = MONTHS[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const closePicker = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start(() => {
      setIsVisible(false);
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(monthIndex);
      return newDate;
    });
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(year);
      return newDate;
    });
    setShowYearPicker(false);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDayInMonth(year, month);
    const firstDay = getFirstMonthOfMonth(year, month);

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View style={styles.dayCell} key={`empty-${i}`}>
          <View style={styles.dayButton} />
        </View>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day);
      const selected = isDateSelected(day);

      days.push(
        <View key={`day-${day}`} style={styles.dayCell}>
          <TouchableOpacity
            style={[
              styles.dayButton,
              selected && {backgroundColor: colors.primary},
              disabled && styles.disabledDay,
            ]}
            onPress={() => handleDateSelect(day)}
            disabled={disabled}
          >
            <Text
              style={[
                styles.dayText,
                {color: colors.text},
                selected && {color: colors.foregroundText},
                disabled && {color: colors.disabledText},
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return days;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    if (minimumDate && newDate < minimumDate) return;
    if (maximumDate && newDate > maximumDate) return;

    setTempSelectedDate(newDate);
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    if (minimumDate && date < minimumDate) return true;
    if (maximumDate && date > maximumDate) return true;

    return false;
  };

  const isDateSelected = (day: number) => {
    if (!tempSelectedDate) return false;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    return (
      date.getDate() === tempSelectedDate.getDate() &&
      date.getMonth() === tempSelectedDate.getMonth() &&
      date.getFullYear() === tempSelectedDate.getFullYear()
    );
  };

  const getDayInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const getFirstMonthOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleSelect = () => {
    onChange?.(tempSelectedDate);
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
        disabled={disabled}
        onPress={openPicker}
        style={[
          styles.pickerButton,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
          },
          disabled && {opacity: 0.5},
          style,
        ]}
      >
        <Text
          style={[
            styles.pickerButtonText,
            {color: value ? colors.text : colors.inputPlaceholder},
          ]}
        >
          {formatDate(value)}
        </Text>
        <CalendarIcon size={20} color={colors.textMuted} />
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
              {
                transform: [{translateY: slideAnim}],
                backgroundColor: colors.surface,
              },
            ]}
          >
            <View
              style={[
                styles.pickerHeader,
                {borderBottomColor: colors.borderLight},
              ]}
            >
              <Text
                style={[styles.pickerTitle, {color: colors.text}]}
                variant="heading"
              >
                Select Date
              </Text>
            </View>

            <View style={styles.calendarContainer}>
              <View style={styles.monthYearSelector}>
                <TouchableOpacity
                  onPress={handlePrevMonth}
                  style={styles.navButton}
                >
                  <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.monthYearButton}>
                  <TouchableOpacity
                    style={styles.monthYearButton}
                    onPress={() => setShowMonthPicker(!showMonthPicker)}
                  >
                    <Text style={[styles.monthYearText, {color: colors.text}]}>
                      {MONTHS[currentDate.getMonth()]}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.monthYearButton}
                    onPress={() => setShowYearPicker(!showYearPicker)}
                  >
                    <Text style={[styles.monthYearText, {color: colors.text}]}>
                      {currentDate.getFullYear()}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={handleNextMonth}
                  style={styles.navButton}
                >
                  <ChevronRight size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              {showMonthPicker && (
                <ScrollView style={styles.pickerScrollView}>
                  <View style={styles.monthGrid}>
                    {MONTHS.map((month, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.monthItem,
                          currentDate.getMonth() === index && {
                            backgroundColor: `${colors.primary}20`,
                          },
                        ]}
                        onPress={() => handleMonthSelect(index)}
                      >
                        <Text
                          style={[
                            styles.monthItemText,
                            {color: colors.text},
                            currentDate.getMonth() === index && {
                              fontWeight: "600",
                            },
                          ]}
                        >
                          {month}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}

              {showYearPicker && (
                <ScrollView style={styles.pickerScrollView}>
                  <View style={styles.yearGrid}>
                    {YEARS.map((year, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.yearItem,
                          currentDate.getFullYear() === year && {
                            backgroundColor: `${colors.primary}20`,
                          },
                        ]}
                        onPress={() => handleYearSelect(year)}
                      >
                        <Text
                          style={[
                            styles.yearItemText,
                            {color: colors.text},
                            currentDate.getFullYear() === year && {
                              fontWeight: "600",
                            },
                          ]}
                        >
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}

              {!showMonthPicker && !showYearPicker && (
                <>
                  <View style={styles.weekDaysContainer}>
                    {DAYS.map((day) => (
                      <View key={day} style={styles.weekDayCell}>
                        <Text
                          style={[
                            styles.weekDayText,
                            {color: colors.textMuted},
                          ]}
                        >
                          {day}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.daysContainer}>{renderCalendar()}</View>
                </>
              )}
            </View>

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
                  style={{fontSize: 16, color: colors.text, fontWeight: "500"}}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSelect}
                style={[styles.button, {backgroundColor: colors.primary}]}
              >
                <Text style={{color: colors.background}}>Select</Text>
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
    fontWeight: "600",
  },
  calendarContainer: {
    padding: 20,
  },
  monthYearSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  monthYearButton: {
    flexDirection: "row",
    gap: 12,
  },
  monthYearText: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pickerScrollView: {
    maxHeight: 300,
    marginBottom: 20,
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  monthItem: {
    width: "30%",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  monthItemText: {
    fontSize: 14,
  },
  yearGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  yearItem: {
    width: "30%",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  yearItemText: {
    fontSize: 14,
  },
  weekDaysContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  weekDayCell: {
    flex: 1,
    alignItems: "center",
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 4,
  },
  dayButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
  },
  disabledDay: {
    opacity: 0.3,
  },
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
  openPickerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
});

export default DatePicker;
