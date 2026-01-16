import { Currency } from "@/providers/CurrencyProvider";


export const formatPrice = (amount: number, currency: Currency): string => {
  
    const symbolBeforeCurrencies = ["USD", "GBP", "EUR", "AUD", "CAD", "NZD", "SGD", "HKD"];

    const formattedAmount = amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    if (symbolBeforeCurrencies.includes(currency.code)) {
        return `${currency.symbol}${formattedAmount}`;
    }

   
    return `${formattedAmount} ${currency.symbol}`;
};

