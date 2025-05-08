import { html } from 'lit';

export function renderBoxplotViolinTableHeader() {
  return html`
    <tr>
      <th>Group</th>
      <th>Minimum</th>
      <th>Q1</th>
      <th>Median</th>
      <th>Q3</th>
      <th>Maximum</th>
      <th>IQR</th>
      <th>Outlier(s)</th>
    </tr>
  `;
}

export function renderBoxplotViolinTableRow(label: string, values: number[]) {
  if (!values || !values.length) {
    return html`
      <tr>
        <td>${label}</td>
        <td>–</td>
        <td>–</td>
        <td>–</td>
        <td>–</td>
        <td>–</td>
        <td>–</td>
        <td>–</td>
      </tr>
    `;
  }

  const sortedValues = [...values].sort((a, b) => a - b);
  const len = sortedValues.length;

  const min = sortedValues[0];
  const max = sortedValues[len - 1];
  const median =
    len % 2 === 0
      ? (sortedValues[len / 2 - 1] + sortedValues[len / 2]) / 2
      : sortedValues[Math.floor(len / 2)];

  const lowerHalf = sortedValues.slice(0, Math.floor(len / 2));
  const upperHalf =
    len % 2 === 0
      ? sortedValues.slice(len / 2)
      : sortedValues.slice(Math.floor(len / 2) + 1);

  const q1 =
    lowerHalf.length % 2 === 0
      ? (lowerHalf[lowerHalf.length / 2 - 1] +
          lowerHalf[lowerHalf.length / 2]) /
        2
      : lowerHalf[Math.floor(lowerHalf.length / 2)];

  const q3 =
    upperHalf.length % 2 === 0
      ? (upperHalf[upperHalf.length / 2 - 1] +
          upperHalf[upperHalf.length / 2]) /
        2
      : upperHalf[Math.floor(upperHalf.length / 2)];

  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  const outliers = sortedValues.filter(
    (value) => value < lowerBound || value > upperBound
  );

  return html`
    <tr>
      <td>${label}</td>
      <td>${min}</td>
      <td>${q1}</td>
      <td>${median}</td>
      <td>${q3}</td>
      <td>${max}</td>
      <td>${iqr.toFixed(2)}</td>
      <td>${outliers.length ? outliers.join(', ') : '–'}</td>
    </tr>
  `;
}

export function renderBoxplotViolinTable(
  labels: string[],
  datasets: any[],
  axisLabel: string
) {
  if (!datasets || !datasets.length || !labels || !labels.length) {
    return html`
      <thead>
        <tr>
          <th>No data available</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>No data available for display</td>
        </tr>
      </tbody>
    `;
  }

  return html`
    <thead>
      <tr>
        <th>${axisLabel}</th>
        ${datasets.map(
          (dataset) => html`
            <th>${dataset.label || 'Dataset'} (Min)</th>
            <th>${dataset.label || 'Dataset'} (Q1)</th>
            <th>${dataset.label || 'Dataset'} (Median)</th>
            <th>${dataset.label || 'Dataset'} (Q3)</th>
            <th>${dataset.label || 'Dataset'} (Max)</th>
            <th>${dataset.label || 'Dataset'} (IQR)</th>
            <th>${dataset.label || 'Dataset'} (Outlier(s))</th>
          `
        )}
      </tr>
    </thead>
    <tbody>
      ${labels.map(
        (label, i) => html`
          <tr>
            <td>${label}</td>
            ${datasets.map((dataset) => {
              const values = dataset.data[i];
              if (!values || !values.length) {
                return html`
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                `;
              }

              const sortedValues = [...values].sort((a, b) => a - b);
              const len = sortedValues.length;

              const min = sortedValues[0];
              const max = sortedValues[len - 1];
              const median =
                len % 2 === 0
                  ? (sortedValues[len / 2 - 1] + sortedValues[len / 2]) / 2
                  : sortedValues[Math.floor(len / 2)];

              const lowerHalf = sortedValues.slice(0, Math.floor(len / 2));
              const upperHalf =
                len % 2 === 0
                  ? sortedValues.slice(len / 2)
                  : sortedValues.slice(Math.floor(len / 2) + 1);

              const q1 =
                lowerHalf.length % 2 === 0
                  ? (lowerHalf[lowerHalf.length / 2 - 1] +
                      lowerHalf[lowerHalf.length / 2]) /
                    2
                  : lowerHalf[Math.floor(lowerHalf.length / 2)];

              const q3 =
                upperHalf.length % 2 === 0
                  ? (upperHalf[upperHalf.length / 2 - 1] +
                      upperHalf[upperHalf.length / 2]) /
                    2
                  : upperHalf[Math.floor(upperHalf.length / 2)];

              const iqr = q3 - q1;
              const lowerBound = q1 - 1.5 * iqr;
              const upperBound = q3 + 1.5 * iqr;
              const outliers = sortedValues.filter(
                (value) => value < lowerBound || value > upperBound
              );

              return html`
                <td>${min}</td>
                <td>${q1}</td>
                <td>${median}</td>
                <td>${q3}</td>
                <td>${max}</td>
                <td>${iqr.toFixed(2)}</td>
                <td>${outliers.length ? outliers.join(', ') : '–'}</td>
              `;
            })}
          </tr>
        `
      )}
    </tbody>
  `;
}
