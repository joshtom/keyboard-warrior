const averageBand = 80;

export function getHeatmapColorVariable(
  reactionMs: number | undefined,
  sessionAverageMs: number,
) {
  if (!reactionMs || !sessionAverageMs) {
    return "var(--color-heatmap-empty)";
  }

  if (reactionMs < sessionAverageMs - averageBand) {
    return "var(--color-heatmap-fast)";
  }

  if (reactionMs > sessionAverageMs + averageBand) {
    return "var(--color-heatmap-slow)";
  }

  return "var(--color-heatmap-avg)";
}
