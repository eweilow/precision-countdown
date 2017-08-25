import { DateMode, Month, Alignment } from "./enums";

export function iterateAndMatchValue<T>(enumeration: any, token): T {
  const keys = Object.keys(<T>enumeration)
    .filter(element => typeof element === "string");

  for(let key of keys) { 
    if(key.toUpperCase() === token) return <T>enumeration[key];
    if(enumeration[key].toUpperCase() === token) return <T>enumeration[key];
  }
  return null;
}

export function parseDateMode(token): DateMode {
  if(token === "NET") {
    return DateMode.NoEarlierThan;
  } else if(token === "NLT") {
    return DateMode.NoLaterThan;
  }
  return null;
}

export function parseMonth(token: string): Month {
  return iterateAndMatchValue<Month>(Month, token);
}

export function parseQuarter(token: string): number {
  if(/^Q[1-4]$/.test(token)) return parseInt(token.slice(1), 10);
  return null;
}

export function parseAlignment(token: string): Alignment {
  return iterateAndMatchValue<Alignment>(Alignment, token);
}

export function parseDate(token: string): number {
  if(!/^\s*[0-9]?[0-9][A-Z]?[A-Z]?\s*$/i.test(token)) return null;

  const parsed = parseInt(token, 10);
  if(parsed > 0 && parsed <= 31) return parsed;
  return null;
}

export function parseYear(token: string): number {
  if(!/^\s*[0-9]{4}\s*$/i.test(token)) return null;

  const parsed = parseInt(token, 10);
  return parsed;
}

export function parseDecade(token: string): number {
  const year = parseYear(token.slice(0, 4));
  if(year !== null && token.charAt(4) === "S") return year;
  return null;
}