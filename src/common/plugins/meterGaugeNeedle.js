const NeedleColor =
  getComputedStyle(document.documentElement).getPropertyValue(
    '--kd-color-background-ui'
  ) || '#898888';

export default {
  id: 'meterGaugeNeedle',
  afterDatasetsDraw: (chart, args, plugins) => {
    const { ctx, data } = chart;
    ctx.save();
    // fetch x and y for needle position
    const xCenter = chart.getDatasetMeta(0).data[0].x;
    const yCenter = chart.getDatasetMeta(0).data[0].y;
    // fetch outerRadius of arc and innerRadius of arc
    const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
    const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
    const widthSlice = (outerRadius - innerRadius) / 2;
    const radius = 10;
    const angle = Math.PI / 180; // half circle

    // Needle value
    const needleValue = data.datasets[0].needleValue;

    const dataTotal = data.datasets[0].data.reduce((a, b) => a + b, 0);

    // const angle = Math.PI + (1 / dataTotal) * needleValue * Math.PI;

    const circumference =
      (chart.getDatasetMeta(0).data[0].circumference /
        Math.PI /
        data.datasets[0].data[0]) *
      needleValue;

    // Draw needle
    ctx.translate(xCenter, yCenter);
    // rotate needle
    ctx.rotate(Math.PI * (circumference + 1.5));

    ctx.beginPath();

    ctx.strokeStyle = NeedleColor;
    ctx.fillStyle = NeedleColor;
    ctx.lineWidth = 1;

    ctx.moveTo(0 - radius, 0);
    ctx.lineTo(0, 0 - innerRadius - widthSlice);
    ctx.lineTo(0 + radius, 0);

    ctx.closePath();

    ctx.stroke();
    ctx.fill(); // fill needle color

    // dot
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, angle * 360, false);
    ctx.fill();

    ctx.restore();
  },
};
