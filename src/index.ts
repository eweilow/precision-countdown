import moment = require("moment");

import { padStart, padEnd } from "./stringHelpers";

import { DateMode, Month, Alignment } from "./enums";
import { Token, TokenData, TokenType } from "./Token";
import { Precision, PrecisionType } from "./Precision";
import { RangedMoment } from "./RangedMoment";

function tokenize(input: string, order: TokenType[] = []): Token[] {
  return input.split(" ")
    .filter(element => element.trim().length > 0)
    .map(element => new Token(element, input))
    .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
}

const Order = [
  TokenType.DateMode,
  TokenType.Alignment,
  TokenType.Date,
  TokenType.Month,
  TokenType.Quarter,
  TokenType.Year,
  TokenType.Decade
];

function parse(input: string, createdAtString: string = null): RangedMoment {
  const createdAt = createdAtString !== null ? moment(createdAtString) : moment();
  const tokens = tokenize(input, Order);
  const args = new Array(Order.length);
  for(let token of tokens) {
    const index = Order.indexOf(token.type);
    if(index >= 0) args[index] = token.getData();
  }

  const precision = Precision.parse.apply(Precision, args);
  return parseTokens.apply(this, [].concat([ input, createdAt, precision ], args));
}

function parseTokens(input: string, createdAt: moment.Moment, precision: Precision, dateMode: DateMode, alignment: Alignment, date: number, month: Month, quarter: number, year: number, decade: number): RangedMoment {
  let moment: RangedMoment = new RangedMoment(input, precision, dateMode, createdAt);
  
  if(decade) {
    moment.decade = decade;
  }
  if(year) {
    moment.year = year;
    if(decade) throw new Error("Both year and decade cannot be set at the same time.");
  }
  if(quarter) {
    moment.quarter = quarter;
  }
  if(month) {
    moment.month = month;
  }
  if(date) {
    moment.date = date;
  }
  return moment;
}

import { formatDayPrecision } from "./formats/day";
import { formatWeekPrecision } from "./formats/week";
import { formatMonthPrecision } from "./formats/month";
import { formatQuarterPrecision } from "./formats/quarter";
import { formatYearPrecision } from "./formats/year";
import { formatDecadePrecision } from "./formats/decade";

export default parse;

/*
parseAndPrint("NET Q4 2017");
parseAndPrint("NET Q3 2017");
parseAndPrint("NET Q1 2018");
parseAndPrint("NET Q2 2018");
parseAndPrint("NLT Q4 2017");
parseAndPrint("NLT Q3 2017");
parseAndPrint("NLT Q1 2018");
parseAndPrint("NLT Q2 2018");


parseAndPrint("NET Early Jan 2017");
parseAndPrint("NET Late Jan 2017");
parseAndPrint("NET Mid Jan 2017");
parseAndPrint("NET Feb 17 2017");
parseAndPrint("NET Feb 17 2017");
parseAndPrint("NET Feb 17 2017");
parseAndPrint("NET January 2017");
parseAndPrint("NLT January 2017");
parseAndPrint("NLT January 17");
parseAndPrint("Late 2020s");
*/