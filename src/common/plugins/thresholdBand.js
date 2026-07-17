/**
 * Threshold Bands Plugin
 * Draws filled horizontal bands at specified Y-values to represent threshold ranges
 *
 * Usage:
 * plugins: {
 *   thresholdBands: {
 *     bands: [
 *       { value: 20, color: '#ff6b6b' },
 *       { value: 40, color: '#ffa500'},
 *       { value: 60, color: '#ffd700'},
 *       { value: 80, color: '#90ee90' },
 *       { value: 100, color: '#00aa00' }
 *     ]
 *   }
 * }
 */
export default {
  id: 'thresholdBands',
  beforeDatasetsDraw: (chart, args, options) => {
    if (!options.bands || options.bands.length === 0) return;

    const { ctx } = chart;
    const { chartArea, scales } = chart;
    const yScale = scales.y;

    if (!yScale) return;

    ctx.save();

    // Sort bands by value
    const sortedBands = [...options.bands].sort((a, b) => a.value - b.value);

    // Filled rectangles between bands
    for (let i = 0; i < sortedBands.length; i++) {
      const currentBand = sortedBands[i];
      const nextBand = sortedBands[i + 1];

      const yPixelCurrent = yScale.getPixelForValue(currentBand.value);
      const yPixelNext = nextBand
        ? yScale.getPixelForValue(nextBand.value)
        : chartArea.top;
      ctx.fillStyle = (nextBand ? nextBand.color : currentBand.color) + '18';
      ctx.fillRect(
        chartArea.left,
        Math.min(yPixelCurrent, yPixelNext),
        chartArea.width,
        Math.abs(yPixelNext - yPixelCurrent)
      );

      // Draw the threshold line
      ctx.strokeStyle = currentBand.color || '#cccccc';
      ctx.lineWidth = currentBand.width || 1;
      ctx.setLineDash(currentBand.line || []);

      ctx.beginPath();
      ctx.moveTo(chartArea.left, yPixelCurrent);
      ctx.lineTo(chartArea.right, yPixelCurrent);
      ctx.stroke();
    }

    ctx.restore();
  },
};
