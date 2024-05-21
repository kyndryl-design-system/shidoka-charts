const TextColor =
  getComputedStyle(document.documentElement).getPropertyValue(
    '--kd-color-text-primary'
  ) || '#3d3c3c';

export default {
  id: 'doughnutLabel',
  beforeDraw: (chart, args, options) => {
    if (
      chart.config.type === 'doughnut' &&
      !chart.config.options.doughnutLabel?.disabled
    ) {
      const { ctx } = chart;

      // get sum of all visible data points
      const total = chart.config.data.datasets[0].data
        .filter((dataPoint, index) => !chart.legend.legendItems[index].hidden)
        .reduce((a, b) => a + b, 0);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2 - 10;
      ctx.fillStyle = TextColor;

      //Draw text in center
      // get custom options for center text
      const Line1textOption = chart.config.options.doughnutLabel?.line1text;
      const Line1fontSize =
        chart.config.options.doughnutLabel?.line1fontSize || '16px';
      const Line2textOption = chart.config.options.doughnutLabel?.line2text;
      const Line2fontSize =
        chart.config.options.doughnutLabel?.line2fontSize || '16px';

      // set default values
      let Line1text = total;
      let Line2text = chart.config.options.scales.y.title.text;

      // determine if line1text option is given, is a function or not, and update text
      if (Line1textOption || Line1textOption === '') {
        Line1text =
          typeof Line1textOption === 'function'
            ? Line1textOption(Line1text, ctx)
            : Line1textOption;
      }

      // determine if line2text option is given, is a function or not, and update text
      if (Line2textOption || Line2textOption === '') {
        Line2text =
          typeof Line2textOption === 'function'
            ? Line2textOption(Line2text, ctx)
            : Line2textOption;
      }

      ctx.font = `${Line1fontSize} "Helvetica Neue", Helvetica, Arial, sans-serif`;
      ctx.fillText(Line1text, centerX, centerY);
      ctx.font = `${Line2fontSize} "Helvetica Neue", Helvetica, Arial, sans-serif`;
      ctx.fillText(Line2text, centerX, centerY + 20);
    }
  },
};
