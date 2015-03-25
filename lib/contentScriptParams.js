/**
 * Created by per on 15-03-25.
 */
const ContentScriptParams = function(aTab, anInformationHolder) {
    const contentScriptParams = {};
    contentScriptParams.conversionQuotes = anInformationHolder.getConversionQuotes();
    contentScriptParams.convertToCurrency = anInformationHolder.convertToCurrency;
    contentScriptParams.convertToCountry = anInformationHolder.convertToCountry;
    contentScriptParams.currencySymbols = anInformationHolder.getCurrencySymbols();
    contentScriptParams.customSymbols = anInformationHolder.customSymbols;
    contentScriptParams.subUnitSeparator = anInformationHolder.decimalSep;
    contentScriptParams.enableOnStart = anInformationHolder.enableOnStart;
    contentScriptParams.excludedDomains = anInformationHolder.excludedDomains;
    contentScriptParams.enabledCurrencies = anInformationHolder.enabledCurrencies;
    contentScriptParams.quoteAdjustmentPercent = anInformationHolder.quoteAdjustmentPercent;
    contentScriptParams.roundAmounts = anInformationHolder.roundPrices;
    contentScriptParams.separatePrice = anInformationHolder.separatePrice;
    contentScriptParams.showOriginalPrices = anInformationHolder.showOriginalPrices;
    contentScriptParams.unitAfter = anInformationHolder.unitAfter;
    contentScriptParams.tempConvertUnits = anInformationHolder.tempConvertUnits;
    contentScriptParams.thousandSep = anInformationHolder.thousandSep;
    if (aTab != null && typeof aTab.isEnabled != "undefined")  {
        contentScriptParams.isEnabled = aTab.isEnabled;
    }
    else {
        contentScriptParams.isEnabled = anInformationHolder.conversionEnabled;
    }
    contentScriptParams.currencyNames = anInformationHolder.getCurrencyNames();
    return contentScriptParams;
};

if (typeof exports === "object") {
    exports.ContentScriptParams = ContentScriptParams;
}
