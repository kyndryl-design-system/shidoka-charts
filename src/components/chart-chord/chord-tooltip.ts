import type { ChordModel } from './chord.types';
import { formatValue } from '../../internal/chart-frame/format';
import type { ChartInteraction, TooltipContent } from '../../internal/chart-frame/types';

/** Hover tooltip copy for the chord diagram. */
export function formatChordInteractionTooltip(
  interaction: ChartInteraction,
  model: ChordModel
): TooltipContent | null {
  if (interaction.kind !== 'hover') return null;

  const lines: string[] = [];

  if (interaction.path.length === 2) {
    lines.push(`${interaction.path[0]} → ${interaction.path[1]}`);
  } else if (interaction.path.length === 1) {
    lines.push(interaction.path[0]);
  } else if (interaction.label) {
    lines.push(interaction.label);
  } else {
    return null;
  }

  lines.push(`${model.valueLabel}: ${formatValue(interaction.value)}`);
  return { lines };
}
