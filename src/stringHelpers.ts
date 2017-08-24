export function padStart(input: any, length: number = 10, char: string = " "): string {
  return padStartStr(String(input), length, char);
}
function padStartStr(input: string, length: number, char: string): string {
  input = String(input);
  while(input.length < length) input += char;
  return input;
}
export function padEnd(input: any, length: number = 10, char: string = " "): string {
  return padEndStr(String(input), length, char);
}
function padEndStr(input: string, length: number, char: string): string {
  input = String(input);
  while(input.length < length) input = char + input;
  return input;
}