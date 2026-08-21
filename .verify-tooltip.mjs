import { chromium, firefox } from 'playwright';

const base = 'http://127.0.0.1:6018/iframe.html';
const launcher = process.env.BROWSER === 'firefox' ? firefox : chromium;
const browser = await launcher.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function open(id) {
  await page.goto(`${base}?id=${id}&viewMode=story`, {
    waitUntil: 'networkidle',
  });
  await page.waitForFunction(() => {
    const el = document.querySelector('kd-chart-sunburst');
    return !!el?.shadowRoot?.querySelector('canvas');
  });
  await page.waitForTimeout(900);
}

async function report(id, label) {
  await open(id);
  const info = await page.evaluate(() => {
    const host = document.querySelector('kd-chart-sunburst');
    const root = host.shadowRoot;
    const rendererHost = root.querySelector('.renderer-host');
    const tips = [...root.querySelectorAll('kyn-tooltip')];
    const anchors = tips.map((t) => t.shadowRoot.querySelector('.anchor'));
    const echartsTipDivs = [
      ...rendererHost.querySelectorAll('div[style*="position: absolute"]'),
    ].filter((d) => d.style.zIndex);

    return {
      chips: tips.length,
      hostTransforms: [
        ...new Set(tips.map((t) => getComputedStyle(t).transform)),
      ],
      anchorTransforms: [
        ...new Set(
          [...root.querySelectorAll('.label-anchor')].map(
            (a) => getComputedStyle(a).transform
          )
        ),
      ],
      titles: [...new Set(anchors.map((a) => a.getAttribute('title')))],
      ariaLabels: [...new Set(anchors.map((a) => a.getAttribute('aria-label')))],
      accNames: anchors.slice(0, 2).map((a) => a.textContent.trim()),
      describedBy: [
        ...new Set(anchors.map((a) => a.getAttribute('aria-describedby'))),
      ],
      echartsTooltipNodes: echartsTipDivs.length,
      overlayInsideRenderer: !!rendererHost.querySelector('.label-box'),
      overlaySiblingOfRenderer: !!root.querySelector(
        '.host-stack > .host-overlay > .label-box'
      ),
    };
  });
  console.log(`\n=== ${label} (${id}) ===`);
  console.log(info);

  if (!info.chips) return;

  const anchorBox = await page.evaluate(() => {
    const root = document.querySelector('kd-chart-sunburst').shadowRoot;
    const anchor = root.querySelectorAll('.label-anchor')[0];
    const point = anchor.getBoundingClientRect();
    const chip = root
      .querySelectorAll('kyn-tooltip')[0]
      .shadowRoot.querySelector('.anchor')
      .getBoundingClientRect();
    return {
      point: { x: point.x, y: point.y },
      chip: { x: chip.x, y: chip.y, w: chip.width, h: chip.height },
      centeredOnPoint: {
        dx: +(chip.x + chip.width / 2 - point.x).toFixed(1),
        dy: +(chip.y + chip.height / 2 - point.y).toFixed(1),
      },
    };
  });
  console.log('anchor geometry:', anchorBox);

  const target = await page.evaluateHandle(() => {
    const root = document.querySelector('kd-chart-sunburst').shadowRoot;
    return root.querySelectorAll('kyn-tooltip')[0].shadowRoot.querySelector(
      '.anchor'
    );
  });
  const box = await target.asElement().boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(700);

  const hover = await page.evaluate(() => {
    const root = document.querySelector('kd-chart-sunburst').shadowRoot;
    const tips = [...root.querySelectorAll('kyn-tooltip')];
    const open = tips
      .map((t) => t.shadowRoot.querySelector('.content'))
      .filter((c) => getComputedStyle(c).visibility === 'visible');
    const rendererHost = root.querySelector('.renderer-host');
    const echartsVisible = [...rendererHost.querySelectorAll('div')].filter(
      (d) =>
        d.style.zIndex &&
        getComputedStyle(d).visibility !== 'hidden' &&
        d.offsetWidth > 0
    );

    return {
      openTooltips: open.length,
      openText: open[0]?.innerText.replace(/\n+/g, ' | '),
      fontSize: open[0] && getComputedStyle(open[0]).fontSize,
      lineHeight: open[0] && getComputedStyle(open[0]).lineHeight,
      padding: open[0] && getComputedStyle(open[0]).padding,
      rect: open[0] && (({ x, y, width, height }) => ({ x, y, width, height }))(
        open[0].getBoundingClientRect()
      ),
      inViewport:
        open[0] &&
        (() => {
          const r = open[0].getBoundingClientRect();
          return (
            r.left >= -1 &&
            r.top >= -1 &&
            r.right <= window.innerWidth + 1 &&
            r.bottom <= window.innerHeight + 1
          );
        })(),
      echartsTooltipVisible: echartsVisible.length,
    };
  });
  console.log('on hover:', hover);

  await page.keyboard.press('Tab');
  const focusPath = await page.evaluate(() => {
    const deep = (el) =>
      el?.shadowRoot?.activeElement ? deep(el.shadowRoot.activeElement) : el;
    const active = deep(document.activeElement);
    return active?.className || active?.tagName;
  });
  console.log('first Tab lands on:', focusPath);
}

await report('apache-echarts-sunburst--constrained-labels', 'constrained');
await report('apache-echarts-sunburst--sunburst', 'inline default');

await browser.close();
