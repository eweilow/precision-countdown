import { formatMonthPrecision } from "./month";
import { getDefaultPrefix } from "./prefix";

export function formatWeekPrecision(weekDifference: number, prefixForPast: string, prefixForFuture: string): string {
  const sign = Math.sign(weekDifference);
  const absoluteDifference = Math.abs(weekDifference);
  const inThePast = sign < 0;

  const months = Math.floor(absoluteDifference / 4);
  const weeksInMonth = absoluteDifference - months * 4;

  if(absoluteDifference > 48) {
    return formatMonthPrecision(months, prefixForPast, prefixForFuture);
  }

  if(absoluteDifference === 0) return `${prefixForFuture||""} this week`.trim();
  if(inThePast) {
    if(absoluteDifference > 8) {
      if(weeksInMonth === 0) {
        if(months - 1 === 1) return `1 month, 4 weeks ago`;
        return `${months - 1} months, 4 weeks ago`;
      }
      if(weeksInMonth === 1) return `${months} months, 1 week ago`;
      return `${months} months, ${weeksInMonth} weeks ago`;
    }
    if(absoluteDifference === 1) return "last week";
    return `${absoluteDifference} weeks ago`;
  } else {
    const defaultPrefix = getDefaultPrefix(prefixForFuture);
    if(absoluteDifference > 8) {
      if(weeksInMonth === 0) {
        if(months - 1 === 1) return `${defaultPrefix}1 month, 4 weeks`;
        return `${defaultPrefix}${months - 1} months, 4 weeks`;
      }
      if(weeksInMonth === 1) return `${defaultPrefix}${months} months, 1 week`;
      return `${defaultPrefix}${months} months, ${weeksInMonth} weeks`;
    }
    if(absoluteDifference === 1) return `${prefixForFuture||""} next week`.trim();
    return `${defaultPrefix}${absoluteDifference} weeks`;
  }
}