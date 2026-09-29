import { chromium } from 'playwright';

const url = 'http://localhost:6006/iframe.html?id=apache-echarts-area--smooth-with-points&viewMode=story';
const outDir = '/private/tmp/claude-501/-Users-will-barbee-Developer-ghec-Shidoka-shidoka-charts/ad6f543c-b162-4442-95f7-1550fc7e8787/scratchpad';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 760, height: 600 } });
await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${outDir}/gap-check.png` });

// Measure the actual host container width vs where the canvas content starts.
const measurements = await page.evaluate(() => {
  const el = document.querySelector('kd-chart-area');
  const shadow = el?.shadowRoot;
  const host = shadow?.querySelector('.renderer-host');
  const canvas = host?.querySelector('canvas');
  const hostRect = host?.getBoundingClientRect();
  const canvasRect = canvas?.getBoundingClientRect();
  return { hostRect, canvasRect, hostWidth: host?.clientWidth, hostHeight: host?.clientHeight };
});
console.log(JSON.stringify(measurements, null, 2));

await browser.close();
