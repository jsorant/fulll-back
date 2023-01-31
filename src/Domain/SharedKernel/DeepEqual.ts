export function deepEquals(left: any, right: any): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
