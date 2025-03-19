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
  afterDraw: (chart, args, options) => {
    if (!options || !options.display) return;
    const Colors =
      options.colors ||
      chart.options.plugins?.gradientLegend?.colors ||
      chart.options.colorScale?.colors ||
      chart.data?.datasets?.[0]?._colorPalette;
    if (!Colors || !Colors.length) return;
    const paletteKey = options.paletteKey || '';
    const isDivergentPalette = paletteKey.toLowerCase().includes('divergent');
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;

    const defaultLegendLabels = isDivergentPalette
      ? [-100, 0, 100]
      : [0, 50, 100];
    const legendLabels = options.legendLabels || defaultLegendLabels;

    let colorScale = {
      min: legendLabels[0],
      neutral: legendLabels[1],
      max: legendLabels[2],
    };
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
    }
    const gradient = ctx.createLinearGradient(x, y, x + legendOptions.width, y);
    const neutralIndex = Colors.findIndex((c) => c.includes('neutral'));
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
    const drawRoundedRect = (x, y, width, height, radius) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.arcTo(x + width, y, x + width, y + radius, radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
      ctx.lineTo(x + radius, y + height);
      ctx.arcTo(x, y + height, x, y + height - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
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
    const formatValue = (val) => val.toString();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = chart.options.color || '#666';
    ctx.fillText(
      formatValue(colorScale.min),
      x,
      y + legendOptions.height + legendOptions.labelMargin
    );
    if (Colors.length >= 3 && colorScale.neutral !== undefined) {
      ctx.textAlign = 'center';
      ctx.fillText(
        formatValue(colorScale.neutral),
        x + legendOptions.width / 2,
        y + legendOptions.height + legendOptions.labelMargin
      );
    }
    ctx.textAlign = 'right';
    ctx.fillText(
      formatValue(colorScale.max),
      x + legendOptions.width,
      y + legendOptions.height + legendOptions.labelMargin
    );
  },
};
