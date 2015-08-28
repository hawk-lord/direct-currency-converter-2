

PriceRegexesTest = TestCase("PriceRegexesTest");

PriceRegexesTest.prototype.testALL = () => {
    "use strict";
    const regex1 = {};
    const regex2 = {};
    PriceRegexes.makePriceRegexes(regex1, regex2);

    console.log(regex1.ALL);
    const match1 = regex1.ALL.exec("ALL 100 000.00");
    console.log(match1);
    console.log(match1.length);
    console.log(regex2.ALL);
    const match2 = regex2.ALL.exec("100 000.00 ALL");
    console.log(match2);
    console.log(match2.length);
    assertEquals("Test equals ", "ALL", match2[8]);
    
    // RD$0 - RD$150,000 DOP 
};

PriceRegexesTest.prototype.testDOP = () => {
    "use strict";
    const regex1 = {};
    const regex2 = {};
    PriceRegexes.makePriceRegexes(regex1, regex2);

    console.log(regex1.DOP);
    const match1 = regex1.DOP.exec("RD$0 - RD$150,000 DOP");
    console.log(match1);
    console.log(match1.length);
    console.log(regex2.DOP);
    const match2 = regex2.DOP.exec("RD$0 - RD$150,000 DOP");
    console.log(match2);
    console.log(match2.length);
    assertEquals("Test equals ", "DOP", match2[8]);

    // RD$0 - RD$150,000 DOP 
};

