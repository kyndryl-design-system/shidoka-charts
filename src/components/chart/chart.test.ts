import { BarChart } from '../../../dist/index.js';

import { assert } from '@open-wc/testing';

suite('kd-chart', () => {
  test('is defined', () => {
    const el = document.createElement('kd-chart');
    assert.instanceOf(el, BarChart);
  });
});
