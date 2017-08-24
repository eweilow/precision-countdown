import "mocha";
import { assert } from "chai";

import parse from "../";

import { Month } from "../enums";

describe("parse", function() {
  function test(input: string, expectedYear: Number, expectMonth: Month, expectedQuarter: number, expectedDate: number) {
    it("should parse '" + input + "' correctly", function() {
      const date = parse(input);
      if(expectedYear !== null) assert.equal(date.year, expectedYear, "Expected year to be " + expectedYear);
      if(expectMonth !== null) assert.equal(date.month, expectMonth, "Expected month to be " + expectMonth);
      if(expectedQuarter !== null) assert.equal(date.quarter, expectedQuarter, "Expected quarter to be " + expectedQuarter);
      if(expectedDate !== null) assert.equal(date.date, expectedDate, "Expected date to be " + expectedDate);
    });
  }
  
  test("January 1 2017", 2017, Month.January, null, 1);
  test("February 2 2017", 2017, Month.February, null, 2);
  test("February 28 2017", 2017, Month.February, null, 28);
  test("February 32 2017", 2017, Month.February, null, 28);
});