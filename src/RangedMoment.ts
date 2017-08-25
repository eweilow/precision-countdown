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
  private _alignment: Alignment;
  private _backingMoment: moment.Moment;

  public get utcSeconds(): number {
    return Math.floor(this._backingMoment.toDate().getTime() / 1000);
  }

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

  public get alignment(): Alignment {
    return this._alignment;
  }

  public get precisionType(): PrecisionType {
    return this._precision.type;
  }

  public get countdownPrecisionType(): PrecisionType {
    return this._precision.countdownType;
  }

  public get precisionSpan(): number {
    return typeof this._precision.span === "boolean" ? 0 : this._precision.span;
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

  constructor(input: string, precision: Precision, dateMode: DateMode, alignment: Alignment, backingMoment: moment.Moment = null) {
    this._input = input;
    this._precision = precision;
    this._dateMode = dateMode;
    this._alignment = alignment;
    this._backingMoment = backingMoment !== null ? backingMoment.clone() : moment();
  }

  static floorToZero(val) {
    const sign = Math.sign(val);

    return Math.floor(val); //Math.floor(Math.abs(val)) * sign;
  }

  differenceTo(otherMoment: moment.Moment): string {
    if(this.invalid) return "Invalid";

    const prefix = null;
    const postfix = null;

    if(this.countdownPrecisionType === PrecisionType.Decade) {
      const otherRangedMoment = new RangedMoment(null, this._precision, null, null, otherMoment);
      const difference = this.decade - otherRangedMoment.decade;

      return formatDecadePrecision(RangedMoment.floorToZero(difference) + this.precisionSpan, prefix, postfix);
    }
    if(this.countdownPrecisionType === PrecisionType.Year) {
      const difference = this._backingMoment.diff(otherMoment, "year", true);

      return formatYearPrecision(RangedMoment.floorToZero(difference) + this.precisionSpan, prefix, postfix);
    }
    if(this.countdownPrecisionType === PrecisionType.Quarter) {
      const difference = this._backingMoment.diff(otherMoment, "quarter", true);

      return formatQuarterPrecision(RangedMoment.floorToZero(difference) + this.precisionSpan, prefix, postfix);
    }
    if(this.countdownPrecisionType === PrecisionType.Month) {
      const difference = this._backingMoment.diff(otherMoment, "month", true);

      return formatMonthPrecision(RangedMoment.floorToZero(difference) + this.precisionSpan, prefix, postfix);
    }
    if(this.countdownPrecisionType === PrecisionType.Week) {
      const difference = this._backingMoment.diff(otherMoment, "week", true);

      return formatWeekPrecision(RangedMoment.floorToZero(difference) + this.precisionSpan, prefix, postfix);
    }
    if(this.countdownPrecisionType === PrecisionType.Day) {
      const difference = this._backingMoment.diff(otherMoment, "hours", true) / 24 + 0.5;

      return formatDayPrecision(RangedMoment.floorToZero(difference) + this.precisionSpan, prefix, postfix);
    }

    return null;
  }

  private prefix(): string {
    switch(this.dateMode) {
      case DateMode.NET: return "NET";
      case DateMode.NLT: return "NLT";
      default: return "";
    }
  }

  private alignmentPrefix(): string {
    switch(this.alignment) {
      case Alignment.Early: return "Early";
      case Alignment.Mid: return "Mid";
      case Alignment.Late: return "Late";
      default: return "";
    }
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

    return [this.prefix(), this.alignmentPrefix(), this._format()].filter(el => el.length > 0).join(" ");
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

    return [this.prefix(), this.alignmentPrefix(), this._humanized()].filter(el => el.length > 0).join(" ");
  }

  toString() {
    return [padStart(this.precision.type + " @ " + this.precision.span), padStart(this.date), padStart(this.month), padStart(this.quarter), padStart(this.year), padStart(this.decade)].join(" | ");
  }
}