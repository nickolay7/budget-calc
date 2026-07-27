export function formatChange(
  value: number | null,
): { text: string | null; positive: boolean } {
  if (value === null) return { text: null, positive: true };
  return {
    text: `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`,
    positive: value >= 0,
  };
}
