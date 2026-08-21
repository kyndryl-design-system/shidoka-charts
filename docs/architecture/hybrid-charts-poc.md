# Hybrid charts proof of concept

Status: accepted for implementation on `poc/echarts-d3`.

## Baseline

The POC started from `90b7cc97092ab233851c0ebd4bdb37ec9c159c46` with a
clean worktree.

- `npm run lint` passes with 28 pre-existing warnings and no errors.
- `npm test` passes in the configured Storybook browser projects.
- `npm run build` passes with pre-existing TypeScript declaration warnings.
- `npm run build-storybook` passes.
- `npm pack --ignore-scripts --dry-run --json`, run from `dist`, reports 148
  files, 128,503 packed bytes, and 478,255 unpacked bytes.
- The baseline package has root, `components/chart`, and
  `components/mermaid` entry points and no `exports` or `sideEffects` field.

The plain `npm pack --dry-run` command currently fails from `dist` because the
copied `prepare` script runs Husky where `.git` is unavailable. The
`--ignore-scripts` result is the POC package-content baseline.

## Decisions

### Semantic components own their renderer

`kd-chart-sunburst` and `kd-chart-chord` expose chart-specific typed data.
They do not expose an engine selector or a universal native configuration.
ECharts and D3 remain implementation details except for the explicitly unsafe
native escape hatch.

### Shared code is engine neutral

The shared chart frame owns public chrome, accessible title and description,
table and CSV views, capability-driven controls, theme observation, resize
coordination, and normalized events. It must not import Chart.js, ECharts, or
any D3 module.

Each renderer owns only the contents of the stable host supplied by the frame.
It implements mount, update, resize, destroy, and capability discovery.

### Imports enforce bundle isolation

The semantic registration entries are:

- `charts/sunburst`
- `charts/chord`

Each entry registers exactly one guarded custom element. Neither entry is
re-exported from the root barrel. ECharts is imported only below the sunburst
renderer, and individual `d3-*` modules are imported only below the chord
renderer.

### Renderer choices

The sunburst POC uses the ECharts canvas renderer initially. Canvas is the
representative ECharts production path and supports image export directly.
The renderer choice remains isolated so SVG can be measured without changing
the semantic component.

The chord POC uses D3 only for layout and SVG path generation. Lit owns the
shell and stable host; the D3 renderer owns the SVG subtree. No D3 selection
module is required.

### Legacy isolation

`KDChart` and its Chart.js registration, public API, stories, and runtime
dependencies remain unchanged. The POC does not add engine-prefixed chart
types or route either new renderer through `KDChart`.

## Source layout

```text
src/
  charts/
    sunburst/             # guarded public registration entry
    chord/                # guarded public registration entry
  components/
    chart-sunburst/       # semantic component, model, stories
    chart-chord/          # semantic component, model, stories
  internal/
    chart-frame/          # engine-neutral frame, contracts, view models
    renderers/
      echarts/            # sunburst mapping and lifecycle
      d3/                 # chord mapping and lifecycle
```

The chord contributes one representative story and the sunburst contributes a
default and constrained-label story, in addition to Storybook's automatic Docs
pages. The top-level engine sections are ordered `Chart.js`, `Apache ECharts`,
`D3`, and `Mermaid`.

### Unsafe native escape hatch

`unsafeNativeOptions` and `unsafeGetNativeInstance()` are intentionally
non-portable. They are available for advanced experiments that cannot be
expressed through a semantic chart API, but native option shapes, instance
types, and behavior may change with an engine update without following the
semantic component's compatibility guarantees. Application code should not
depend on these APIs for ordinary chart configuration.

## Acceptance evidence

POC verification is reported against AC-001 through AC-011 from the
architecture handoff. Bundle and performance results are measurements, not
preselected pass/fail budgets.

### Browser and accessibility

`npm test` passes 324 Storybook tests across Chromium, Firefox, and WebKit,
including both sunburst stories and the chord story. Storybook runs the
accessibility addon with violations configured as test failures.

### Representative performance measurements

Measurements were captured in headless Chromium with a 1200 by 900 viewport
against the production Storybook build. Each result is from 20 warmed runs of
the representative story data. Mount and update include two animation frames
for renderer settlement; resize includes three frames for `ResizeObserver` and
renderer settlement. These are elapsed interaction baselines rather than
isolated JavaScript execution timings.

| Chart | Operation | Median | p95 |
| --- | --- | ---: | ---: |
| Apache ECharts sunburst | mount | 33.1 ms | 33.7 ms |
| Apache ECharts sunburst | data update | 33.4 ms | 35.2 ms |
| Apache ECharts sunburst | resize | 50.0 ms | 50.3 ms |
| D3 chord | mount | 33.1 ms | 33.6 ms |
| D3 chord | data update | 33.4 ms | 34.1 ms |
| D3 chord | resize | 50.0 ms | 50.5 ms |

The measurements are frame-bound by the settlement method and establish the
POC baseline. No pass/fail budget is inferred from them.
