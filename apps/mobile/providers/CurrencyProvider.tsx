import React, {createContext, useContext, useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  {code: "USD", symbol: "$", name: "US Dollar"},
  {code: "EUR", symbol: "€", name: "Euro"},
  {code: "GBP", symbol: "£", name: "British Pound"},
  {code: "JPY", symbol: "¥", name: "Japanese Yen"},
  {code: "AUD", symbol: "A$", name: "Australian Dollar"},
  {code: "CAD", symbol: "C$", name: "Canadian Dollar"},
  {code: "CHF", symbol: "CHF", name: "Swiss Franc"},
  {code: "CNY", symbol: "¥", name: "Chinese Yuan"},
  {code: "INR", symbol: "₹", name: "Indian Rupee"},
  {code: "MXN", symbol: "MX$", name: "Mexican Peso"},
  {code: "BRL", symbol: "R$", name: "Brazilian Real"},
  {code: "ZAR", symbol: "R", name: "South African Rand"},
  {code: "SGD", symbol: "S$", name: "Singapore Dollar"},
  {code: "HKD", symbol: "HK$", name: "Hong Kong Dollar"},
  {code: "NZD", symbol: "NZ$", name: "New Zealand Dollar"},
  {code: "SEK", symbol: "kr", name: "Swedish Krona"},
  {code: "NOK", symbol: "kr", name: "Norwegian Krone"},
  {code: "DKK", symbol: "kr", name: "Danish Krone"},
  {code: "PLN", symbol: "zł", name: "Polish Zloty"},
  {code: "THB", symbol: "฿", name: "Thai Baht"},
  {code: "AED", symbol: "د.إ", name: "UAE Dirham"},
  {code: "SAR", symbol: "﷼", name: "Saudi Riyal"},
];

interface CurrencyContextProps {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => Promise<void>;
  currencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextProps | null>(null);

const CURRENCY_STORAGE_KEY = "@renewly_selected_currency";

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
};

export const CurrencyProvider = ({children}: {children: React.ReactNode}) => {
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(
    CURRENCIES[0] 
  );

 
  useEffect(() => {
    loadCurrency();
  }, []);

  const loadCurrency = async () => {
    try {
      const saved = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved) {
        const currencyCode = JSON.parse(saved);
        const currency = CURRENCIES.find((c) => c.code === currencyCode);
        if (currency) {
          setSelectedCurrencyState(currency);
        }
      }
    } catch (error) {
      console.error("Failed to load currency:", error);
    }
  };

  const setSelectedCurrency = async (currency: Currency) => {
    try {
      await AsyncStorage.setItem(
        CURRENCY_STORAGE_KEY,
        JSON.stringify(currency.code)
      );
      setSelectedCurrencyState(currency);
    } catch (error) {
      console.error("Failed to save currency:", error);
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        currencies: CURRENCIES,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
