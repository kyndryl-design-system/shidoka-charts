/**
 * Chart.js plugin to add a color gradient legend for heatmap and matrix charts
 */
export default {
  id: 'colorLegend',
  afterDraw: (chart, args, options) => {
    if (!options || !options.display) {
      return;
    }

    const ctx = chart.ctx;
    const chartArea = chart.chartArea;

    const colorScale = chart.options.colorScale || {
      min: 0,
      max: 100,
      neutral: 50,
      colors: ['#d3686d', '#e8e8e8', '#5285c5'],
    };

    const legendOptions = {
      position: options.position || 'bottom',
      width: options.width || Math.min(400, chartArea.width * 0.8),
      height: options.height || 20,
      margin: options.margin || 10,
      borderRadius: options.borderRadius || 4,
      title: options.title || '',
      titleFontSize: options.titleFontSize || 12,
      labelFontSize: options.labelFontSize || 12,
      labelMargin: options.labelMargin || 5,
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
      x = chartArea.left - 40;
      y = chartArea.bottom + 60;
    }

    const Colors = options.colors ||
      chart.options.plugins?.colorLegend?.colors ||
      chart.options.colorScale?.colors ||
      chart.data?.datasets?.[0]?._colorPalette || [
        '#d3686d',
        '#e8e8e8',
        '#5285c5',
      ];

    const getColorWithOpacity = (color, position) => {
      if (!color) return '#888888';

      if (typeof color === 'string' && color.startsWith('#')) {
        let opacity;
        if (position === 0) opacity = 'AA';
        else if (position === 0.5) opacity = '90';
        else opacity = 'AA';

        return color + (color.length === 7 ? opacity : '');
      }

      return color;
    };

    const generateValueBasedColor = (value, min, max, neutral, colors) => {
      const [negativeColor, neutralColor, positiveColor] = colors;

      if (value < neutral) {
        const normalizedValue = Math.max(
          0,
          Math.min(1, (neutral - value) / (neutral - min))
        );
        return (
          negativeColor +
          Math.round(normalizedValue * 90 + 10)
            .toString(16)
            .padStart(2, '0')
        );
      } else if (value > neutral) {
        const normalizedValue = Math.max(
          0,
          Math.min(1, (value - neutral) / (max - neutral))
        );
        return (
          positiveColor +
          Math.round(normalizedValue * 90 + 10)
            .toString(16)
            .padStart(2, '0')
        );
      } else {
        return neutralColor + '50';
      }
    };

    const gradient = ctx.createLinearGradient(x, y, x + legendOptions.width, y);

    if (
      colorScale &&
      colorScale.min !== undefined &&
      colorScale.max !== undefined
    ) {
      const min = colorScale.min;
      const max = colorScale.max;
      const neutral =
        colorScale.neutral !== undefined ? colorScale.neutral : (min + max) / 2;

      if (Colors.length >= 3) {
        gradient.addColorStop(
          0,
          generateValueBasedColor(min, min, max, neutral, Colors)
        );
        gradient.addColorStop(
          0.5,
          generateValueBasedColor(neutral, min, max, neutral, Colors)
        );
        gradient.addColorStop(
          1,
          generateValueBasedColor(max, min, max, neutral, Colors)
        );
      } else if (Colors.length === 2) {
        gradient.addColorStop(0, getColorWithOpacity(Colors[0], 0));
        gradient.addColorStop(1, getColorWithOpacity(Colors[1], 1));
      }
    } else {
      if (Colors.length === 3) {
        gradient.addColorStop(0, getColorWithOpacity(Colors[0], 0));
        gradient.addColorStop(0.5, getColorWithOpacity(Colors[1], 0.5));
        gradient.addColorStop(1, getColorWithOpacity(Colors[2], 1));
      } else if (Colors.length === 2) {
        gradient.addColorStop(0, getColorWithOpacity(Colors[0], 0));
        gradient.addColorStop(1, getColorWithOpacity(Colors[1], 1));
      }
    }

    if (legendOptions.title) {
      ctx.font = `${legendOptions.titleFontSize}px ${
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
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    drawRoundedRect(
      x,
      y,
      legendOptions.width,
      legendOptions.height,
      legendOptions.borderRadius
    );
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = gradient;
    drawRoundedRect(
      x,
      y,
      legendOptions.width,
      legendOptions.height,
      legendOptions.borderRadius
    );
    ctx.fill();

    ctx.font = `${legendOptions.labelFontSize}px ${
      chart.options.font?.family || 'Arial'
    }`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = chart.options.color || '#666';

    ctx.fillText(
      colorScale.min.toString(),
      x,
      y + legendOptions.height + legendOptions.labelMargin
    );

    if (
      colorScale.colors &&
      colorScale.colors.length === 3 &&
      colorScale.neutral !== undefined
    ) {
      ctx.fillText(
        colorScale.neutral.toString(),
        x + legendOptions.width / 2,
        y + legendOptions.height + legendOptions.labelMargin
      );
    } else if (Colors.length >= 3 && colorScale.neutral !== undefined) {
      ctx.fillText(
        colorScale.neutral.toString(),
        x + legendOptions.width / 2,
        y + legendOptions.height + legendOptions.labelMargin
      );
    }

    ctx.fillText(
      colorScale.max.toString(),
      x + legendOptions.width,
      y + legendOptions.height + legendOptions.labelMargin
    );
  },
};
