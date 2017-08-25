import "source-map-support/register";

import "mocha";
import { assert } from "chai";

import parse from "../";

import { Month } from "../enums";

import moment = require("moment");

describe("index.ts", function() {
  function test(input: string, expectedDecade: number, expectedYear: number, expectMonth: Month, expectedQuarter: number, expectedDate: number, expectedInvalid: boolean) {
    const exp = [
      expectedYear != null ? `year ${expectedYear}` : null,
      expectMonth != null ? `month ${expectMonth}` : null,
      expectedQuarter != null ? `quarter ${expectedQuarter}` : null,
      expectedDate != null ? `date ${expectedDate}` : null,
      expectedInvalid === true ? "invalid" : "valid"
    ].filter(el => el != null);
    it(`${input} = (${exp.join(", ")})`, function() {
      const date = parse(input);
      if(expectedInvalid) {
        assert.isTrue(date.invalid, "Expected invalid")
      } else {
        assert.isFalse(date.invalid, "Expected valid")
      }
      if(expectedDecade !== null) assert.equal(date.decade, expectedDecade, "Expected decade to be " + expectedDecade + ": " + date.humanized());
      if(expectedYear !== null) assert.equal(date.year, expectedYear, "Expected year to be " + expectedYear + ": " + date.humanized());
      if(expectMonth !== null) assert.equal(date.month, expectMonth, "Expected month to be " + expectMonth + ": " + date.humanized());
      if(expectedQuarter !== null) assert.equal(date.quarter, expectedQuarter, "Expected quarter to be " + expectedQuarter + ": " + date.humanized());
      if(expectedDate !== null) assert.equal(date.date, expectedDate, "Expected date to be " + expectedDate + ": " + date.humanized());
    });
  }

  describe("valid parsing", function() {
    test("January 1 2017", null, 2017, Month.January, null, 1, false);
    test("February 2 2017", null, 2017, Month.February, null, 2, false);
    test("February 28 2017", null, 2017, Month.February, null, 28, false);
    test("February 29 2016", null, 2016, Month.February, null, 29, false);
    test("Jan 29 2016", null, 2016, Month.January, null, 29, false);

    test("February 2016", null, 2016, Month.February, null, null, false);

    test("Q1 2013", null, 2013, null, 1, null, false);
    
    test("2020s", 2020, null, null, null, null, false);
  });

  describe("should parse overflow", function() {
    test("February 29 2017", null, 2017, Month.February, null, 28, false);
    test("February 1 2017", null, 2017, Month.February, null, 1, false);
    test("February 30 2016", null, 2016, Month.February, null, 29, false);
  });

  describe("humanized", function() {
    const inOut = [
      [ "NET January 1 2017", "NET January 1st, 2017" ],
      [ "NLT January 3 2017", "NLT January 3rd, 2017" ],
      [ "January 7 2017", "January 7th, 2017" ],

      [ "Early January 2018", "January 2018" ],
      [ "NET January 2018", "NET January 2018" ],
      [ "Apr 2019", "April 2019" ],

      [ "NET Q1", "NET Q1 " + new Date().getUTCFullYear()],
      [ "NLT Q4 2019", "NLT Q4 2019"],
      [ "Q3 2012", "Q3 2012" ],

      [ "2012", "2012" ],
      [ "NET 2047", "NET 2047" ],
      [ "NLT 2123", "NLT 2123" ],

      [ "2020s-2030s", "2020s" ],
      [ "2020s", "2020s" ],
      [ "2010s-2060s", "2010s" ],
      [ "2013s-2015s", "2010s" ]
    ];

    describe("should return correctly", function() {
      for(let [ inStr, outStr ] of inOut) {
        it(`'${inStr}' = '${outStr}'`, function() {
          assert.equal(parse(inStr).humanized(), outStr, "strings should match");
        });
      }
    });
  });

  describe("format", function() {
    const inOut = [
      [ "NET January 1 2017", "NET 2017-01-01" ],
      [ "NLT January 3 2017", "NLT 2017-01-03" ],
      [ "January 7 2017", "2017-01-07" ],

      [ "Early January 2018", "2018-01" ],
      [ "NET January 2018", "NET 2018-01" ],
      [ "Apr 2019", "2019-04" ],

      [ "NET Q1", "NET Q1 " + new Date().getUTCFullYear()],
      [ "NLT Q4 2019", "NLT Q4 2019"],
      [ "Q3 2012", "Q3 2012" ],

      [ "2012", "2012" ],
      [ "NET 2047", "NET 2047" ],
      [ "NLT 2123", "NLT 2123" ],

      [ "2020s-2030s", "2020-2030" ],
      [ "2020s", "2020-2030" ],
      [ "2010s-2060s", "2010-2020" ],
      [ "2013s-2015s", "2010-2020" ]
    ];

    describe("should return correctly", function() {
      for(let [ inStr, outStr ] of inOut) {
        it(`'${inStr}' = '${outStr}'`, function() {
          assert.equal(parse(inStr).format(), outStr, "strings should match");
        });
      }
    });
  });

  describe("countdown", function() {
    const relativeTo = moment("2017-08-01 12:00:00", "YYYY-MM-DD HH:mm:ss");
    const inOut = [
      [ "2030s", "in the next 20-30 years" ],
      [ "2020s", "in the next 20 years" ],
      [ "2010s", "this decade" ],
      [ "2000s", "about a decade ago" ],
      [ "1990s", "2 decades ago" ],

      [ "2013", "4 years ago" ],
      [ "2014", "3 years ago" ],
      [ "2015", "2 years ago" ],
      [ "2016", "a year ago" ],
      [ "2017", "this year" ],
      [ "2018", "in a year" ],
      [ "2019", "in 2 years" ],
      [ "2020", "in 3 years" ],
      [ "2021", "in 4 years" ],

      [ "Q1 2013", "4 years ago" ],
      [ "Q2 2013", "4 years ago" ],
      [ "Q3 2013", "4 years ago" ],
      [ "Q4 2013", "about 3 years ago" ],

      [ "Q1 2014", "about 3 years ago" ],
      [ "Q2 2014", "about 3 years ago" ],
      [ "Q3 2014", "about 3 years ago" ],
      [ "Q4 2014", "about 2 years ago" ],

      [ "Q1 2015", "about 2 years ago" ],
      [ "Q2 2015", "about 2 years ago" ],
      [ "Q3 2015", "about 2 years ago" ],
      [ "Q4 2015", "about a year and a half ago" ],

      [ "Q1 2016", "about a year and a half ago" ],
      [ "Q2 2016", "about a year ago" ],
      [ "Q3 2016", "about a year ago" ],
      [ "Q4 2016", "about half a year ago" ],

      [ "Q1 2017", "3-6 months ago" ],
      [ "Q2 2017", "in the last 3 months" ],
      [ "Q3 2017", "this quarter" ],
      [ "Q4 2017", "in 3-6 months" ],

      [ "Q1 2018", "in 6-9 months" ],
      [ "Q2 2018", "in about a year" ],
      [ "Q3 2018", "in about a year" ],
      [ "Q4 2018", "in about a year" ],

      [ "Q1 2019", "in about a year and a half" ],
      [ "Q2 2019", "in about a year and a half" ],
      [ "Q3 2019", "in 2 years" ],
      [ "Q4 2019", "in 2 years" ],

      [ "Q1 2020", "in 2 years" ],
      [ "Q2 2020", "in 2 years" ],
      [ "Q3 2020", "in 3 years" ],
      [ "Q4 2020", "in 3 years" ],

      [ "Q1 2021", "in 3 years" ],
      [ "Q2 2021", "in 3 years" ],
      [ "Q3 2021", "in 4 years" ],
      [ "Q4 2021", "in 4 years" ]
    ];

    describe(`should return correctly relative to ${relativeTo.format("YYYY-MM-DD HH:mm:ss")}`, function() {
      for(let [ inStr, outStr ] of inOut) {
        it(`'${inStr}' = '${outStr}'`, function() {
          assert.equal(parse(inStr).differenceTo(relativeTo), outStr, "strings should match");
        });
      }
    });
  })
});