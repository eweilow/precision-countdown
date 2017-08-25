import { getDefaultPrefix } from "./prefix";

export function formatDecadePrecision(decadeDifference: number, prefixForPast: string, prefixForFuture: string): string {
  const sign = Math.sign(decadeDifference);
  const absoluteDifference = Math.abs(Math.floor(decadeDifference / 10));
  const inThePast = sign < 0;

  if(inThePast) {
    if(absoluteDifference === 1) return `about a decade ago`;
    return `${absoluteDifference} decades ago`;
  } else {
    const defaultPrefix = getDefaultPrefix(prefixForFuture);
    if(absoluteDifference === 0) {
      return `${prefixForFuture || ""} this decade`.trim();
    }
    if(absoluteDifference === 1) return `${defaultPrefix}the next ${absoluteDifference * 10 + 10} years`;
    return `${defaultPrefix}the next ${(absoluteDifference * 10)}-${absoluteDifference * 10 + 10} years`;
  }
}