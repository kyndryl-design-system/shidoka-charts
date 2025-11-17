import { html } from 'lit';

export function renderGraphTreeTable(datasets: any[]) {
  if (!datasets || !datasets.length || !datasets[0]?.data) {
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

  const data = datasets[0].data;

  // get parent name by index
  const getParentName = (parentIndex: number | null): string => {
    if (parentIndex === null || parentIndex === undefined) {
      return 'Root';
    }
    const parent = data[parentIndex];
    return parent ? parent.name : `Unknown (${parentIndex})`;
  };

  // calculate depth/level
  const getDepth = (index: number, visited = new Set()): number => {
    if (visited.has(index)) return 0;
    visited.add(index);

    const item = data[index];
    if (!item || item.parent === null || item.parent === undefined) {
      return 0;
    }
    return 1 + getDepth(item.parent, visited);
  };

  // get children count
  const getChildrenCount = (parentIndex: number): number => {
    return data.filter((item: any) => item.parent === parentIndex).length;
  };

  return html`
    <thead>
      <tr>
        <th>Parent Name</th>
        <th>Depth/Level</th>
        <th>Children Count</th>
      </tr>
    </thead>
    <tbody>
      ${data.map((item: any, index: number) => {
        const depth = getDepth(index);
        const parentName = getParentName(item.parent);
        const childrenCount = getChildrenCount(index);

        return html`
          <tr class="depth-${depth}">
            <td>${parentName}</td>
            <td>${depth}</td>
            <td>${childrenCount}</td>
          </tr>
        `;
      })}
    </tbody>
  `;
}
