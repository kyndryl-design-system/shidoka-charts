const TextColor =
  getComputedStyle(document.documentElement).getPropertyValue(
    '--kd-color-text-primary'
  ) || '#3d3c3c';

export default {
  id: 'doughnutLabel',
  beforeDraw: (chart, args, options) => {
    if (chart.config.type === 'doughnut') {
      const { ctx } = chart;

      // get sum of all visible data points
      const total = chart.config.data.datasets[0].data
        .filter((dataPoint, index) => !chart.legend.legendItems[index].hidden)
        .reduce((a, b) => a + b, 0);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2 - 10;
      ctx.font = '16px "Helvetica Neue", Helvetica, Arial, sans-serif';
      ctx.fillStyle = TextColor;

      //Draw text in center
      // get custom options for center text
      const Line1textOption = chart.config.options.doughnutLabel?.line1text;
      const Line2textOption = chart.config.options.doughnutLabel?.line2text;
      let Line1text = total;
      let Line2text = chart.config.options.scales.y.title.text;

      if (Line1textOption || Line1textOption === '') {
        Line1text =
          typeof Line1textOption === 'function'
            ? Line1textOption(Line1text, ctx)
            : Line1textOption;
      }

      if (Line2textOption || Line2textOption === '') {
        Line2text =
          typeof Line2textOption === 'function'
            ? Line2textOption(Line2text, ctx)
            : Line2textOption;
      }
      // const Line1text =
      //   chart.config.options.doughnutLabel?.line1text(ctx) || total;
      // const Line2text =
      //   chart.config.options.doughnutLabel?.line2text ||
      //   chart.config.options.scales.y.title.text;

      ctx.fillText(Line1text, centerX, centerY);
      ctx.fillText(Line2text, centerX, centerY + 20);
    }
  },
};
