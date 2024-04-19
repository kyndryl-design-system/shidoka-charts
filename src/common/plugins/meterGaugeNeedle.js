const NeedleColor =
  getComputedStyle(document.documentElement).getPropertyValue(
    '--kd-color-background-ui'
  ) || '#898888';

const LabelColor =
  getComputedStyle(document.documentElement).getPropertyValue(
    '--kd-color-text-primary'
  ) || '#3d3c3c';

// if someone enters needle value more than total value of dataset then needle is point downwards so
// in this scenario we set max value of needle is total value of data. Also if someone enters negative value then we need to set needle to 0
const evaluateNeedleVal = (val, total) => {
  let needleVal = val ?? 0; // if val undefined then we have to set to 0
  // if needleValue more than total value of data then max val of needle is total
  if (needleVal >= total) {
    return total;
  }
  // if needleValue -ve number then we set it to 0
  if (needleVal < 0) {
    return 0;
  }
  return needleVal;
};
// currently no use
const displayLabelBelowNeedle = (
  dataLabels,
  data,
  needleVal,
  circumference,
  customWord
) => {
  const defaultVal = `${(circumference * 100).toFixed(1)}%`;
  // default customWord along with Lable is RISK, user can modify it.
  const appendCustomWord = customWord ?? '';
  // if dataLabels arr not provided or needleVal is not prsent then we returning % of circumference of where needle points
  if (dataLabels.length === 0 || needleVal === undefined) {
    return defaultVal;
  }
  let cumulativeValue = 0;
  for (let i = 0; i < data.length; i++) {
    cumulativeValue += data[i];
    // Check if needleValue is less than or equal to the cumulative value
    if (needleVal <= cumulativeValue) {
      // Return the corresponding data label
      return `${dataLabels[i]} ${appendCustomWord}`;
    }
  }
  // If needleValue is greater than the cumulative value of all data points, return the last data label
  return dataLabels[dataLabels.length - 1];
};

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
    // width of needle
    const radius = 10;
    const angle = Math.PI / 180; // half circle

    // Total value of data
    const dataTotal = data.datasets[0].data.reduce((a, b) => a + b, 0);

    // Needle value. Evaluate if entered needle value is more than data total or less than 0
    const needleValue = evaluateNeedleVal(
      data.datasets[0].needleValue,
      dataTotal
    );

    const circumference =
      (chart.getDatasetMeta(0).data[0].circumference /
        Math.PI /
        data.datasets[0].data[0]) *
      needleValue;

    // Dynamically add dataLabel below needle
    // const textBelowNeedle = displayLabelBelowNeedle(
    //   chart.data.labels,
    //   data.datasets[0].data,
    //   needleValue,
    //   circumference,
    //   data.datasets[0].customWord
    // );
    const textBelowNeedle = chart.config.options.scales.x.title.text ?? '';

    // ctx.save();
    // Enter needle value
    ctx.font = 'bold 12px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = LabelColor;
    ctx.textAlign = 'center';
    ctx.fillText(needleValue, xCenter, yCenter + 25);
    // Enter text value below needle
    ctx.font = '16px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = LabelColor;
    ctx.fillText(textBelowNeedle, xCenter, yCenter + 43);

    ctx.translate(xCenter, yCenter);

    // Min - Max value
    ctx.font = '12px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    // Min value 0
    ctx.fillText('0', 0 - innerRadius - widthSlice, 25);
    // Max value 100
    ctx.fillText('100', 0 + innerRadius + widthSlice, 25);

    // rotate needle
    ctx.rotate(Math.PI * (circumference + 1.5));

    ctx.beginPath();

    // Needle color
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = NeedleColor;
    ctx.lineWidth = 2;

    // Draw needle
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
