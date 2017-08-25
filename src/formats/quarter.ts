import { getDefaultPrefix } from "./prefix";

export function moreThan3YearsAgo(inThePast: boolean, absoluteDifference: number, defaultPrefix: string, prefixForPast: string, prefixForFuture: string): string {
  const years = Math.floor(absoluteDifference / 4);
  if(inThePast) {
    return `${years} years ago`;
  } else {
    return `${defaultPrefix}${years} years`;
  }
}
export function moreThan1YearsAgo(inThePast: boolean, absoluteDifference: number, defaultPrefix: string, prefixForPast: string, prefixForFuture: string): string {
  const years = Math.floor(absoluteDifference / 4);
  const months = absoluteDifference - years * 4;

  if(inThePast) {
    if(years === 1) {
      if(months <= 6) return "about a year and a half ago";
      else return "about a year ago";
    } else {
      if(months <= 6) return `about ${years} years ago`;
      else return `about ${years + 1} years ago`;
    }
  } else {
    if(years === 1) {
      if(months <= 6) return `${defaultPrefix}about a year and a half`;
      else return `${defaultPrefix}about a year`;
    } else {
      if(months <= 6) return `${defaultPrefix}${years} years`;
      else return `${defaultPrefix}about ${years} years and a half`;
    }
  }
}
export function asMonths(inThePast, absoluteDifference: number, defaultPrefix: string, prefixForPast: string, prefixForFuture: string): string {
  const months = absoluteDifference * 3;

  if(months === 0) {
    return `${prefixForFuture||""} this quarter`.trim();
  }
  if(inThePast) {
    if(months > 9) return "about a year ago";
    if(months > 6) return "6-9 months ago";
    if(months > 3) return "3-6 months ago";
    return defaultPrefix + "the last 3 months";
  } else {
    if(months >= 9) return defaultPrefix + "about a year";
    if(months >= 6) return defaultPrefix + "6-9 months";
    if(months >= 3) return defaultPrefix + "3-6 months";
    return defaultPrefix + "next 3 months";
  }
}

export function formatQuarterPrecision(quarterDifference: number, prefixForPast: string, prefixForFuture: string): string {
  const sign = Math.sign(quarterDifference);
  const absoluteDifference = Math.abs(quarterDifference);
  const inThePast = sign < 0;

  const defaultPrefix = getDefaultPrefix(prefixForFuture);
  if(absoluteDifference >= 16) {
    return moreThan3YearsAgo(inThePast, absoluteDifference, defaultPrefix, prefixForPast, prefixForFuture);
  }
  if(absoluteDifference > 5) {
    return moreThan1YearsAgo(inThePast, absoluteDifference, defaultPrefix, prefixForPast, prefixForFuture);
  }
  return asMonths(inThePast, absoluteDifference, defaultPrefix, prefixForPast, prefixForFuture);
}