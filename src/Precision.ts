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
  static parse(dateMode: DateMode, alignment: Alignment, date: boolean, month: Month, quarter: number, year: number, decade: number) {
    if(date != null) {
      return new Precision(PrecisionType.Day, 1);
    } else if(month != null) {
      //if(alignment) return new Precision(PrecisionType.Week, 2);
      return new Precision(PrecisionType.Month, 1);
    } else if(quarter != null) {
      //if(alignment) return new Precision(PrecisionType.Month, 1);
      return new Precision(PrecisionType.Quarter, 1);
    } else if(year != null) {
      //if(alignment) return new Precision(PrecisionType.Quarter, 2);
      return new Precision(PrecisionType.Year, 1);
    } else if(decade != null) {
      //if(alignment) return new Precision(PrecisionType.Year, 4);
      return new Precision(PrecisionType.Decade, 1);
    }
    return null;
  }

  public type: PrecisionType;
  public span: number;

  constructor(type: PrecisionType, span: number) {
    this.type = type;
    this.span = span;
  }
}