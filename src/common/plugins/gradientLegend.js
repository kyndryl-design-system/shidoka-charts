/**
 * Chart.js plugin to add a color gradient legend for heatmap/matrix charts
 */

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getColorWithOpacity = (color, opacity) => {
  const finalOpacity = opacity !== undefined && !isNaN(opacity) ? opacity : 0.7;
  return hexToRgba(color, finalOpacity);
};

export default {
  id: 'gradientLegend',
  afterDraw(chart, args, options) {
    if (!options?.display) return;

    const Colors =
      options.colors ||
      chart.options.plugins?.gradientLegend?.colors ||
      chart.options.colorScale?.colors ||
      chart.data?.datasets?.[0]?._colorPalette;
    if (!Colors || !Colors.length) return;

    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    const paletteKey = options.paletteKey || '';
    const isDivergentPalette = paletteKey.toLowerCase().includes('divergent');

    const colorScale = chart.options.colorScale || {};
    const fallbackMin = isDivergentPalette ? -100 : 0;
    const fallbackNeutral = isDivergentPalette ? 0 : 50;
    const fallbackMax = isDivergentPalette ? 100 : 100;

    // rounding to nearest value in intervals of 50
    const roundToInterval = (value) => {
      if (value === 0) return 0;

      const absValue = Math.abs(value);
      const base = Math.floor(absValue / 50) * 50;

      const rounded = absValue % 50 >= 26 ? base + 50 : base;

      return value < 0 ? -rounded : rounded;
    };

    const minVal = roundToInterval(colorScale.min ?? fallbackMin);
    const neutralVal = roundToInterval(colorScale.neutral ?? fallbackNeutral);
    const maxVal = roundToInterval(colorScale.max ?? fallbackMax);

    const legendOptions = {
      position: options.position || 'bottom',
      width: options.width || Math.min(400, chartArea.width * 0.8),
      height: options.height || 20,
      margin: options.margin || 10,
      borderRadius: options.borderRadius || 4,
      gradientBorderRadius: 1,
      title: options.title || '',
      titleFontSize: options.titleFontSize || 12,
      labelFontSize: options.labelFontSize || 12,
      labelMargin: options.labelMargin || 5,
      opacity: typeof options.opacity === 'number' ? options.opacity : 0.7,
      ...options,
    };

    let x, y;
    if (legendOptions.position === 'bottom') {
      x = chartArea.left + (chartArea.width - legendOptions.width) / 2;
      y = chartArea.bottom + legendOptions.margin;
    } else if (legendOptions.position === 'top') {
      x = chartArea.left + (chartArea.width - legendOptions.width) / 2;
      y = chartArea.top - legendOptions.margin - legendOptions.height;
    } else if (legendOptions.position === 'bottom-left') {
      x = chartArea.left - 70;
      y = chartArea.bottom + 70;
    } else {
      x = chartArea.left + (chartArea.width - legendOptions.width) / 2;
      y = chartArea.bottom + legendOptions.margin;
    }

    const gradient = ctx.createLinearGradient(x, y, x + legendOptions.width, y);
    const neutralIndex = Colors.findIndex((c) =>
      c.toLowerCase().includes('neutral')
    );
    if (neutralIndex > 0) {
      const negativeColors = Colors.slice(0, neutralIndex);
      const neutralColor = Colors[neutralIndex];
      const positiveColors = Colors.slice(neutralIndex + 1);

      negativeColors.forEach((color, i) => {
        const t =
          negativeColors.length > 1
            ? (i / (negativeColors.length - 1)) * 0.5
            : 0;
        gradient.addColorStop(
          t,
          getColorWithOpacity(color, legendOptions.opacity)
        );
      });
      gradient.addColorStop(
        0.5,
        getColorWithOpacity(neutralColor, legendOptions.opacity)
      );
      positiveColors.forEach((color, i) => {
        const t =
          0.5 +
          (positiveColors.length > 1
            ? (i / (positiveColors.length - 1)) * 0.5
            : 0);
        gradient.addColorStop(
          t,
          getColorWithOpacity(color, legendOptions.opacity)
        );
      });
    } else {
      Colors.forEach((color, i) => {
        gradient.addColorStop(
          i / (Colors.length - 1),
          getColorWithOpacity(color, legendOptions.opacity)
        );
      });
    }

    if (legendOptions.title) {
      ctx.font = `500 ${legendOptions.titleFontSize}px ${
        chart.options.font?.family || 'Arial'
      }`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = chart.options.color || '#666';
      ctx.fillText(legendOptions.title, x, y - legendOptions.labelMargin);
    }

    const drawRoundedRect = (xx, yy, w, h, radius) => {
      ctx.beginPath();
      ctx.moveTo(xx + radius, yy);
      ctx.lineTo(xx + w - radius, yy);
      ctx.arcTo(xx + w, yy, xx + w, yy + radius, radius);
      ctx.lineTo(xx + w, yy + h - radius);
      ctx.arcTo(xx + w, yy + h, xx + w - radius, yy + h, radius);
      ctx.lineTo(xx + radius, yy + h);
      ctx.arcTo(xx, yy + h, xx, yy + h - radius, radius);
      ctx.lineTo(xx, yy + radius);
      ctx.arcTo(xx, yy, xx + radius, yy, radius);
      ctx.closePath();
    };

    ctx.fillStyle = '#fff';
    drawRoundedRect(
      x,
      y,
      legendOptions.width,
      legendOptions.height,
      legendOptions.borderRadius
    );
    ctx.fill();

    ctx.fillStyle = gradient;
    drawRoundedRect(
      x,
      y,
      legendOptions.width,
      legendOptions.height,
      legendOptions.gradientBorderRadius
    );
    ctx.fill();

    ctx.font = `${legendOptions.labelFontSize}px ${
      chart.options.font?.family || 'Arial'
    }`;
    ctx.fillStyle = chart.options.color || '#666';
    const formatValue = (val) => roundToInterval(val).toString();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(
      formatValue(minVal),
      x,
      y + legendOptions.height + legendOptions.labelMargin
    );

    if (Colors.length >= 3 && neutralVal !== undefined) {
      ctx.textAlign = 'center';
      ctx.fillText(
        formatValue(neutralVal),
        x + legendOptions.width / 2,
        y + legendOptions.height + legendOptions.labelMargin
      );
    }

    ctx.textAlign = 'right';
    ctx.fillText(
      formatValue(maxVal),
      x + legendOptions.width,
      y + legendOptions.height + legendOptions.labelMargin
    );
  },
};
