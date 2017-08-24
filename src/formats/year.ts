import { getDefaultPrefix } from "./prefix";

export function formatYearPrecision(yearDifference: number, prefixForPast: string, prefixForFuture: string): string {
  const sign = Math.sign(yearDifference);
  const absoluteDifference = Math.abs(yearDifference);
  const inThePast = sign < 0;

  if(absoluteDifference === 0) return `${prefixForFuture||""} this year`.trim();

  if(inThePast) {
    if(absoluteDifference === 1) return "a year ago";
    return `${absoluteDifference} years ago`;
  } else {
    const defaultPrefix = getDefaultPrefix(prefixForFuture);
    if(absoluteDifference === 1) return `${defaultPrefix}a year`;
    return `${defaultPrefix}${absoluteDifference} years`;
  }
}