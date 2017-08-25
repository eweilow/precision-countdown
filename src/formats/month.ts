import { formatYearPrecision } from "./year";
import { getDefaultPrefix } from "./prefix";

export function formatMonthPrecision(monthDifference: number, prefixForPast: string, prefixForFuture: string): string {
  const sign = Math.sign(monthDifference);
  const absoluteDifference = Math.abs(monthDifference);
  const inThePast = sign < 0;

  const years = Math.floor(absoluteDifference / 12);
  const monthsInYear = absoluteDifference - years * 12;

  if(absoluteDifference > 48) {
    return formatYearPrecision(sign * years, prefixForPast, prefixForFuture);
  }

  if(absoluteDifference === 0) return `${prefixForFuture || ""} this month`.trim();
  if(inThePast) {
    if(absoluteDifference > 12) {
      if(years === 1) {
        if(monthsInYear === 1) return `1 year, 1 month ago`; 
        return `1 year, ${monthsInYear} months ago`;
      }
      if(monthsInYear === 0) {
        if(years - 1 === 1) return `1 year, 12 months ago`;
        return `${years - 1} years, 12 months ago`;
      }
      if(monthsInYear === 1) return `${years} years, 1 month ago`;
      return `${years} years, ${monthsInYear} months ago`;
    }
    if(absoluteDifference === 1) return "last month";
    return `${absoluteDifference} months ago`;
  } else {
    const defaultPrefix = getDefaultPrefix(prefixForFuture);
    if(absoluteDifference > 12) {
      if(years === 1) {
        if(monthsInYear === 1) return `${defaultPrefix}1 year, 1 month`;
        return `${defaultPrefix}1 year, ${monthsInYear} months`;
      }
      if(monthsInYear === 0) {
        if(years - 1 === 1) return `${defaultPrefix}1 year, 12 months`;
        return `${defaultPrefix}${years - 1} years, 12 months`;
      }
      if(monthsInYear === 1) return `${defaultPrefix}${years} years, 1 month`;
      return `${defaultPrefix}${years} years, ${monthsInYear} months`;
    }
    if(absoluteDifference === 1) return `${prefixForFuture || ""} next month`.trim();
    return `${defaultPrefix}${absoluteDifference} months`;
  }
}