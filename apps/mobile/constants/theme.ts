// theme.ts
import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';

export const lightColors = {
    primary: '#000000',
    background: '#FFFFFF',
    card: '#F7F7F7',
    text: '#000000',
    textMuted: '#6B6B6B',
    textSecondary: '#8E8E93',
    border: '#000000ff',
    borderLight: '#E5E5EA',
    borderMuted: '#AEAEB2',
    notification: '#FF3B30',
    accent: '#000000',

    // Input colors
    inputBackground: '#F7F7F7',
    inputBorder: '#C7C7CC',
    inputBorderFocused: '#000000',
    inputText: '#000000',
    inputPlaceholder: '#8E8E93',

    // Semantic colors
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#007AFF',

    // Surface colors
    surface: '#FFFFFF',
    surfaceVariant: '#F2F2F7',
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Divider
    divider: '#E5E5EA',

    // Shadow
    shadow: 'rgba(0, 0, 0, 0.1)',

    // Disabled state
    disabled: '#C7C7CC',
    disabledText: '#8E8E93',
};

export const darkColors = {
    primary: '#FFFFFF',
    background: '#000000',
    card: '#1C1C1C',
    text: '#FFFFFF',
    textMuted: '#B3B3B3',
    textSecondary: '#8E8E93',
    border: '#333333',
    borderLight: '#2C2C2E',
    borderMuted: '#48484A',
    notification: '#FF453A',
    accent: '#FFFFFF',

    // Input colors
    inputBackground: '#1C1C1E',
    inputBorder: '#333333',
    inputBorderFocused: '#FFFFFF',
    inputText: '#FFFFFF',
    inputPlaceholder: '#8E8E93',

    // Semantic colors
    success: '#30D158',
    error: '#FF453A',
    warning: '#FF9F0A',
    info: '#0A84FF',

    // Surface colors
    surface: '#1C1C1E',
    surfaceVariant: '#2C2C2E',
    overlay: 'rgba(0, 0, 0, 0.7)',

    // Divider
    divider: '#38383A',

    // Shadow
    shadow: 'rgba(0, 0, 0, 0.3)',

    // Disabled state
    disabled: '#48484A',
    disabledText: '#636366',
};

export const lightTheme: Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        ...lightColors,
    },
};

export const darkTheme: Theme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        ...darkColors,
    },
};

export const semanticColors = {
    light: {
        background: lightColors.background,
        card: lightColors.card,
        text: lightColors.text,
        textMuted: lightColors.textMuted,
        textSecondary: lightColors.textSecondary,
        primary: lightColors.primary,
        accent: lightColors.accent,
        border: lightColors.border,
        borderLight: lightColors.borderLight,
        borderMuted: lightColors.borderMuted,
        inputBackground: lightColors.inputBackground,
        inputBorder: lightColors.inputBorder,
        inputBorderFocused: lightColors.inputBorderFocused,
        inputText: lightColors.inputText,
        inputPlaceholder: lightColors.inputPlaceholder,
        success: lightColors.success,
        error: lightColors.error,
        warning: lightColors.warning,
        info: lightColors.info,
        surface: lightColors.surface,
        surfaceVariant: lightColors.surfaceVariant,
        overlay: lightColors.overlay,
        divider: lightColors.divider,
        shadow: lightColors.shadow,
        disabled: lightColors.disabled,
        disabledText: lightColors.disabledText,
    },
    dark: {
        background: darkColors.background,
        card: darkColors.card,
        text: darkColors.text,
        textMuted: darkColors.textMuted,
        textSecondary: darkColors.textSecondary,
        primary: darkColors.primary,
        accent: darkColors.accent,
        border: darkColors.border,
        borderLight: darkColors.borderLight,
        borderMuted: darkColors.borderMuted,
        inputBackground: darkColors.inputBackground,
        inputBorder: darkColors.inputBorder,
        inputBorderFocused: darkColors.inputBorderFocused,
        inputText: darkColors.inputText,
        inputPlaceholder: darkColors.inputPlaceholder,
        success: darkColors.success,
        error: darkColors.error,
        warning: darkColors.warning,
        info: darkColors.info,
        surface: darkColors.surface,
        surfaceVariant: darkColors.surfaceVariant,
        overlay: darkColors.overlay,
        divider: darkColors.divider,
        shadow: darkColors.shadow,
        disabled: darkColors.disabled,
        disabledText: darkColors.disabledText,
    },
};
