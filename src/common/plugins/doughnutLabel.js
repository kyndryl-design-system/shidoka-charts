const TextColor = getComputedStyle(document.documentElement).getPropertyValue(
  '--kd-color-text-primary'
);

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
      ctx.fillText(total, centerX, centerY);
      ctx.fillText(
        chart.config.options.scales.y.title.text,
        centerX,
        centerY + 20
      );
    }
  },
};
