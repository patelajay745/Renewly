import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";

export const BANNER_AD_UNIT_ID = __DEV__
    ? TestIds.BANNER
    : Platform.OS === "android" ? "ca-app-pub-6236869979264488/2398737435" : "ca-app-pub-6236869979264488/1841184296";