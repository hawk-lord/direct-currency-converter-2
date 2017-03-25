# Direct Currency Converter

Version: 2.5.0+0
Date: 2017-03-12

After installation, you'll have two new buttons in the browser toolbar.

Conversion is enabled or disabled by the "Toggle currency conversion" button.

The tools panel is opened with the "Open settings" button.
From there you can open the Settings tab. Changed settings are saved with the "Save" button in the settings tab. Reload pages to see the changes.
Settings can be reset to default with the "Reset" button.
You can also open a test page with various price examples for all currencies.

Currency quotes are taken from Yahoo Finance and updated when you start the browser or when you switch currency.

Your location is used to set your default region and currency (for example Finland - euro). It is guessed using the freegeoip.net or geoip.nekudo.com service.

If conversion does not work, it probably means that there was no reply from Yahoo. Try to reload the browser (F5 button) and check the internet connection. Also, force a reload by switching "to currency" from settings tab, save, and reload the web pages.

You can convert to and from any existing currency code as defined by ISO 4217, including precious metals, if Yahoo provides a conversion quote for the currency.
There are currently 16 codes with no conversion quotes: BOV, CHE, CHW, COU, CUC, SSP, USN, UYI, XBA, XBB, XBC, XBD, XSU, XTS, XUA, XXX.

A few currencies (CHF, DKK, EUR, GBP, ISK, JPY, NOK, RUB, SEK and USD) are pre-selected for conversion. You can select all currencies, but having too many currencies selected may clutter the pages and result in slow performance.

The conversion is made according to a best guess, checking for ISO currency codes (USD), the currency name in plain text (dollars) and popular abbreviations (US$).
Also, currency names in several languages are checked, for example Arabic, Thai and Mongol.
Ambiguous currencies are converted in the priority order you want. For instance, "kr" can mean SEK, DKK, NOK or ISK, and is converted to the first possible currency
in the currency list in the settings tab.
A tooltip containing original price, converted price and conversion quote is optionally shown in the upper left corner of the browser area.
The "from currency" code is optionally shown in brackets after the original value like this: 6,67 € (60 kr [SEK]).

Amounts without units are not converted.
Also, if amount and unit are in different HTML elements (for example when they have different colours or sizes) conversion cannot be done.

Currencies in PDF files shown in the browser (using pdf.js) are converted too, if possible. Converted elements are then shown with a light yellow background.

Optionally, if selected in the settings tab, some traditional units of measurement (such as miles and calories) are converted to SI units (such as kilometres and kilojoules).

DCC is forked from [https://addons.mozilla.org/addon/simple-currency-converter/] (Simple Currency Converter)

External libraries used:
jQuery 2.2.4
jQuery UI 1.12.0
jQuery UI Touch Punch 0.2.3

currencyData.json source, element <currencyData>:
http://unicode.org/repos/cldr/tags/release-27-0-1/common/supplemental/supplementalData.xml
Converted to JSON using http://www.freeformatter.com/xml-to-json-converter.html

Icons provided by Iconfinder.

Author: Per Johansson, Johanssons Informationsteknik JOINT, Åland Islands, Finland.

History

Version: 1.0.0
Date: 2014-06-14

Version: 1.0.1
Date: 2014-07-18
Fixed some security issues.

Version: 1.0.2
Date: 2014-08-10
Swedish and English localisation
Updated jQuery UI to 1.11.0
Some code review issues

Version: 1.0.3
Date: 2014-08-10
Reverted jQuery UI to 1.10.4 since it is the most recent one supported by AMO
Reverted SDK to 1.16

Version: 1.0.4
Date: 2014-08-10
Rebuild
jquery-ui-1.10.4.min.js replaced with another copy

Version: 1.1.0
Date: 2014-09-11
Conversion to and from all 179 currencies

Version: 1.1.1
Date: 2014-09-16
Improved support for conversion from AED, AFN, ALL, AMD, ANG, AOA currencies.

Version: 1.1.2
Date: 2014-09-21
Improved support for conversion from ARS, AUD, AWG, AZN, BAM, BBD, BDT, BGN, BHD, BIF, BMD, BND, BOB, BOV, BRL, BSD, BTN, BWP, BYR and BZD currencies.

Version: 1.1.3
Date: 2014-09-26
Fixed error with converted amounts close to 1,00, such as 0,999.
Uses case-sensitive price search to avoid false positives like "100 audible".
Improved support for conversion from CAD, CDF, CLF, CLP, CNY, COP, COU, CRC, CUC, CUP and CZK currencies.

Version: 1.1.4
Date: 2014-10-22
Improved support for finding of and conversion from all currencies from AED to ZWL.
Improved control to avoid false positives.

Version: 2.0.0
Date: 2014-11-06
Changed program ID.
Added test page with various price examples.
Added panel with links to settings and test pages.
Fixed an error with saving "Convert to" currency.
Improved support for finding prices.
Internal changes for compatibility with other web browsers.

Version: 2.0.1.1
Date: 2015-01-19
Improved support for USD and GHC.
Added fourth digit to version number, showing browser specific changes.

Version: 2.0.2.0
Date: 2015-01-21
Fixed error with decimal calculation.

Version: 2.0.2.1
Date: 2015-01-28
Internal changes.

Version: 2.0.2.2
Date: 2015-02-04
Fixed PDF conversion style because of changes in pdf.js.

Version: 2.0.3.0
Date: 2015-02-23
Added support for US cents (¢, ￠).
Improved support for non-English characters in price matches.
Internal change: rewrote price regexes.
Internal change: Updated jQuery and jQuery UI versions.

Version: 2.1.1.0
Date: 2015-05-23
Removed Lithuanian Litas (LTL).
Improved localisation, using default currency formats from Unicode Common Locale Data Repository (CLDR) Version 27.0.1.
Changed some settings to CLDR names.
Internal change: general code rewrite in order to ease maintenance and porting between web browsers.

Version: 2.1.2.0
Date: 2015-06-06
Fix: upgrade settings from older versions.
Fix: reset settings
Fix: aWorker.tab is not defined
Internal change: included code changes from the Google Chrome version.

Version: 2.1.2+1
Date: 2015-07-12
Fix: save selected currencies.
Internal change: built with JPM, not with CFX.

Version: 2.1.2+2
Date: 2015-07-12
Internal change: new build.

Version: 2.2.0+0
Date: 2015-08-11
Improved the settings window.
Internal change: merged code with the SeaMonkey version.

Version: 2.3.0+0
Date: 2015-10-08
Fix: the priority order of currencies to convert from. Users will have to save the currency list again. Sorry for that.
Fix: write "-" instead of "NaN" if there is no conversion quote available.
Better support for euro currency recognition in various languages.

Version: 2.4.0+0
Date: 2015-11-06
Added an improved tooltip in the upper left corner that shows the conversion used for each element. It won't hide the original tooltip any more.
 It can be turned off and on in the settings.
Original price and original currency in brackets can now be hidden and shown separately in the settings.
Fix: some settings had been disabled.

Version: 2.4.1+0
Date: 2015-11-13
Fix: do not replace the original titles (tooltips) for HTML elements.
Fix: CHF and SEK conversion.

Version: 2.4.2+0
Date: 2015-11-26
Improved support for subunits (cents etc.).
Fix: works with dynamically changed data (again).

Version: 2.4.3+0
Date: 2016-03-06
Updated to ISO 4217 Amendment Number 162.

Version: 2.4.4+1
Date: 2016-05-05
Added geoip.nekudo.com to find user's location an default currency.
Internal change: Using HTML 5 data instead of hidden input nodes to store original and converted data.

Version: 2.4.4+3
Date: 2016-05-07
Bugfix: original value was not removed correctly when disabling conversion.

Version: 2.4.4+4
Date: 2016-05-12
Bugfix: repeated values were shown.

Version: 2.4.5+0
Date: 2016-05-29
Workaround: added icon.png so the icon will be shown in the add-ons list, pending a
[https://bugzilla.mozilla.org/show_bug.cgi?id=1141839](Firefox fix).
Fix: dynamically changed values were sometimes not shown as converted.
Internal change: some Chrome specific changes in common code.

Version: 2.4.6+0
Date: 2016-06-06
Improved title of conversion so all conversions in an element are shown.
Fix: some text was disappearing in converted elements.
Fix: reset settings did not load the location.
Internal change: refactored and cleaned the main content script.

Version: 2.4.7+0
Date: 2016-07-09
Replaced old Belarusian ruble BYR with BYN (ISO 4217 amendment number 160).
Fix: some converted text was written to the wrong element.
Fix: conversion of amount with an immediately preceding parenthesis, such as "(500 USD)"

Version: 2.4.8+0
Date: 2016-07-10
Fix: some text was disappearing in converted elements.

Version: 2.4.9+0
Date: 2016-08-10
Selection of all currencies or no currencies.
Upgraded versions of jQuery to 2.2.4 and jQuery UI to 1.12.0

Version: 2.4.9+1
Date: 2016-08-13
Internal change: enabled multiprocess

Version: 2.4.11+0
Date: 2016-10-11
Internal change: does not use Yahoo YQL any more, because of reliability issues.

Version: 2.4.12+0
Date: 2016-10-30
Added a button to update currency quotes in the settings form.

Version: 2.5.0+0
Date: 2017-03-12
Improved handling of unit multiples ($ million, etc.). More will be found.
Improved handling of minor units (cents, etc.). Most existing minor units should be found.
Added a quotes page, sortable on currency names and values.
Internal change: improved regular expressions.
