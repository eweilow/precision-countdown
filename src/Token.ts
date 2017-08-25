import { DateMode, Month, Alignment } from "./enums";
import { padStart, padEnd } from "./stringHelpers";
import { parseDateMode, parseQuarter, parseMonth, parseAlignment, parseDate, parseYear, parseDecade } from "./parsers";

export enum TokenType {
  DateMode,
  Quarter,
  Month,
  Date,
  Year,
  Decade,
  Alignment
}

export class TokenData {
  public dateMode: DateMode;
  public month: Month;
  public quarter: number;
  public date: number;
  public year: number;
  public decade: number;
  public alignment: Alignment;
}

export class Token {
  private _type: TokenType;
  private _input: string;
  private _token: string;
  private _data: TokenData;


  public get type(): TokenType {
    return this._type;
  }

  public get input(): string {
    return this._token;
  }

  public get token(): string {
    return this._input;
  }

  public get data(): TokenData {
    return this._data;
  }

  constructor(token: string, input: string) {
    this._token = token.toUpperCase();
    this._input = input;
    this._data = new TokenData();
    this._type = this.assignType(this._token);
  }

  private assignType(input: string): TokenType {
    const parsedDateMode = parseDateMode(input);
    if(parsedDateMode !== null) {
      this._data.dateMode = parsedDateMode;
      return TokenType.DateMode;
    }

    const parsedQuarter = parseQuarter(input);
    if(parsedQuarter !== null) {
      this._data.quarter = parsedQuarter;
      return TokenType.Quarter;
    }

    const parsedMonth = parseMonth(input);
    if(parsedMonth !== null) {
      this._data.month = parsedMonth;
      return TokenType.Month;
    }

    const parsedAlignment = parseAlignment(input);
    if(parsedAlignment !== null) {
      this._data.alignment = parsedAlignment;
      return TokenType.Alignment;
    }

    const parsedDate = parseDate(input);
    if(parsedDate !== null) {
      this._data.date = parsedDate;
      return TokenType.Date;
    }

    const parsedYear = parseYear(input);
    if(parsedYear !== null) {
      this._data.year = parsedYear;
      return TokenType.Year;
    }

    const parsedDecade = parseDecade(input);
    if(parsedDecade !== null) {
      this._data.decade = parsedDecade;
      return TokenType.Decade;
    }

    return null;
  }

  public toString(): string {
    return `${padEnd(TokenType[this.type], 10, " ")}: ${this._dataToString()}`;
  }

  public getData(): any {
    switch(this.type) {
      case TokenType.Alignment: 
        return this.data.alignment;
      case TokenType.Date: 
        return this.data.date;
      case TokenType.Quarter: 
        return this.data.quarter;
      case TokenType.DateMode: 
        return this.data.dateMode;
      case TokenType.Decade: 
        return this.data.decade;
      case TokenType.Month: 
        return this.data.month;
      case TokenType.Year: 
        return this.data.year;
    }
    return null;
  }

  private _dataToString(): string {
    return String(this.getData());
  }
}