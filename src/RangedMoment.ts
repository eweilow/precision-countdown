import moment = require("moment");
import { Precision, PrecisionType } from "./Precision";
import { padStart, padEnd } from "./stringHelpers";
import { DateMode, Month, Alignment } from "./enums";

import { formatDayPrecision } from "./formats/day";
import { formatWeekPrecision } from "./formats/week";
import { formatMonthPrecision } from "./formats/month";
import { formatQuarterPrecision } from "./formats/quarter";
import { formatYearPrecision } from "./formats/year";
import { formatDecadePrecision } from "./formats/decade";

export class RangedMoment {
  private _input: string;
  private _precision: Precision;
  private _dateMode: DateMode;
  private _backingMoment: moment.Moment;

  public get invalid(): boolean {
    return this.precision == null || !this._backingMoment.isValid();
  }

  public get input(): string {
    return this._input;
  }

  public get dateMode(): DateMode {
    return this._dateMode;
  }

  public get precision(): Precision {
    return this._precision;
  }

  public get precisionType(): PrecisionType {
    return this._precision.type;
  }

  public get precisionSpan(): number {
    return this._precision.span;
  }  
  
  public get date(): number {
    return this._backingMoment.date();
  }

  public set date(date: number) {
    this._backingMoment.date(Math.max(1, Math.min(date, this._backingMoment.daysInMonth())));
  }

  public get month(): Month { 
    return Month[this._backingMoment.format("MMMM")];
  }

  public get monthAndYear(): number {
    return this._backingMoment.month() + this.year * 12;
  }

  public set month(month: Month) {
    this._backingMoment.month(month);
  }

  public get quarterAndYear(): number {
    return this.quarter + this.year * 4;
  }

  public get quarter(): number {
    return this._backingMoment.quarter();
  }

  public set quarter(quarter: number) {
    this._backingMoment.quarter(quarter);
  }

  public get year(): number {
    return this._backingMoment.year();
  }

  public set year(year: number) {
    this._backingMoment.year(year);
  }

  public get decade(): number {
    return Math.floor(this._backingMoment.year() / 10) * 10;
  }

  public set decade(decade: number) {
    this._backingMoment.year(Math.floor(decade / 10) * 10);
  }

  constructor(input: string, precision: Precision, dateMode: DateMode, backingMoment: moment.Moment = null) {
    this._input = input;
    this._precision = precision;
    this._dateMode = dateMode;
    this._backingMoment = backingMoment !== null ? backingMoment.clone() : moment();
  }

  differenceTo(otherMoment: moment.Moment): string {
    if(this.invalid) return "Invalid";

    const otherRangedMoment = new RangedMoment(null, this._precision, null, otherMoment);

    const prefix = null;
    const postfix = null;

    if(this.precisionType === PrecisionType.Decade) {
      const difference = this.decade - otherRangedMoment.decade;

      return formatDecadePrecision(Math.floor(difference), prefix, postfix);
    }
    if(this.precisionType === PrecisionType.Year) {
      const difference = this._backingMoment.diff(otherRangedMoment._backingMoment, "year", true);

      return formatYearPrecision(Math.floor(difference), prefix, postfix);
    }
    if(this.precisionType === PrecisionType.Quarter) {
      const difference = this._backingMoment.diff(otherRangedMoment._backingMoment, "quarter", true);

      return formatQuarterPrecision(Math.floor(difference), prefix, postfix);
    }
    if(this.precisionType === PrecisionType.Month) {
      const difference = this._backingMoment.diff(otherRangedMoment._backingMoment, "month", true);

      return formatMonthPrecision(Math.floor(difference), prefix, postfix);
    }
    if(this.precisionType === PrecisionType.Week) {
      const difference = this._backingMoment.diff(otherRangedMoment._backingMoment, "week", true);

      return formatWeekPrecision(Math.floor(difference), prefix, postfix);
    }
    if(this.precisionType === PrecisionType.Day) {
      const difference = this._backingMoment.diff(otherRangedMoment._backingMoment, "day", true);

      return formatDayPrecision(Math.floor(difference), prefix, postfix);
    }

    return null;
  }

  private prefix(): string {
    return this.dateMode === DateMode.NET 
      ? "NET"
      : (this.dateMode === DateMode.NLT
          ? "NLT"
          : "" );
  }

  private _format(): string {
    if(this.precisionType === PrecisionType.Day) {
      return this._backingMoment.format("YYYY-MM-DD");
    }
    if(this.precisionType === PrecisionType.Week || this.precisionType === PrecisionType.Month) {
      return this._backingMoment.format("YYYY-MM");
    }
    if(this.precisionType === PrecisionType.Quarter) {
      return this._backingMoment.format("[Q]Q YYYY");
    }
    if(this.precisionType === PrecisionType.Year) {
      return this._backingMoment.format("YYYY");
    }
    if(this.precisionType === PrecisionType.Decade) {
      return String(this.decade) + "-" + String(10 + this.decade);
    }
    return null;
  }

  format(): string {
    if(this.invalid) return "Invalid";

    return `${this.prefix()} ${this._format()}`.trim();
  }

  private _humanized(): string {
    if(this.precisionType === PrecisionType.Day) {
      return this._backingMoment.format("MMMM Do, YYYY");
    }
    if(this.precisionType === PrecisionType.Week || this.precisionType === PrecisionType.Month) {
      return this._backingMoment.format("MMMM YYYY");
    }
    if(this.precisionType === PrecisionType.Quarter) {
      return this._backingMoment.format("[Q]Q YYYY");
    }
    if(this.precisionType === PrecisionType.Year) {
      return this._backingMoment.format("YYYY");
    }
    if(this.precisionType === PrecisionType.Decade) {
      return String(this.decade) + "s";
    }
    return null;
  }

  humanized(): string {
    if(this.invalid) return "Invalid";

    return `${this.prefix()} ${this._humanized()}`.trim();
  }

  toString() {
    return [padStart(this.precision.type + " @ " + this.precision.span), padStart(this.date), padStart(this.month), padStart(this.quarter), padStart(this.year), padStart(this.decade)].join(" | ");
  }
}