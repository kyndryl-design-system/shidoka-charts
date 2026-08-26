import { formatValue } from './format';
import type { ChartInteraction, TooltipContent } from './types';

/**
 * Default hover tooltip copy derived from a normalized interaction.
 *
 * Charts with richer semantics should override `formatInteractionTooltip` on
 * their frame component instead of branching here.
 */
export function formatDefaultInteractionTooltip(
  interaction: ChartInteraction
): TooltipContent | null {
  if (interaction.kind !== 'hover') return null;

  const lines: string[] = [];

  if (interaction.path.length > 1) {
    lines.push(interaction.path.join(' → '));
  } else if (interaction.path.length === 1) {
    lines.push(interaction.path[0]);
  } else if (interaction.label) {
    lines.push(interaction.label);
  }

  if (interaction.value !== null) {
    lines.push(formatValue(interaction.value));
  }

  return lines.length ? { lines } : null;
}
