export function formatINR(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}
