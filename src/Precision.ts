import { DateMode, Month, Alignment } from "./enums";

export enum PrecisionType {
  Day = "DAY",
  Week = "WEEK",
  Month = "MONTH",
  Quarter = "QUARTER",
  Year = "YEAR",
  Decade = "DECADE"
};

export class Precision {
  static parse(dateMode: DateMode, alignment: Alignment, date: number, month: Month, quarter: number, year: number, decade: number) {
    if(date != null) {
      return new Precision(PrecisionType.Day, null, false);
    } else if(month != null) {
      return new Precision(PrecisionType.Month, null, false);
    } else if(quarter != null) {
      if(alignment != null) {
        switch(alignment) {
          case Alignment.Early: return new Precision(PrecisionType.Quarter, PrecisionType.Month, -1);
          case Alignment.Mid:   return new Precision(PrecisionType.Quarter, PrecisionType.Month, 0);
          case Alignment.Late:  return new Precision(PrecisionType.Quarter, PrecisionType.Month, 1);
        }
      }
      return new Precision(PrecisionType.Quarter, null, false);
    } else if(year != null) {
      if(alignment != null) {
        switch(alignment) {
          case Alignment.Early: return new Precision(PrecisionType.Year, PrecisionType.Quarter, -2);
          case Alignment.Mid:   return new Precision(PrecisionType.Year, PrecisionType.Quarter, 0);
          case Alignment.Late:  return new Precision(PrecisionType.Year, PrecisionType.Quarter, 1);
        }
      }
      return new Precision(PrecisionType.Year, null, false);
    } else if(decade != null) {
      return new Precision(PrecisionType.Decade, null, false);
    }
    return null;
  }

  public type: PrecisionType;
  public countdownType: PrecisionType;
  public span: number | boolean;

  constructor(type: PrecisionType, countdownType: PrecisionType, span: number | boolean) {
    this.type = type;
    if(countdownType == null) countdownType = type;
    this.countdownType = countdownType;
    this.span = span;
  }
}