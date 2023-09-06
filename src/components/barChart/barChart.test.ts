import { BarChart } from '../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kd-chart-bar', () => {
  test('is defined', () => {
    const el = document.createElement('kd-chart-bar');
    assert.instanceOf(el, BarChart);
  });
});
