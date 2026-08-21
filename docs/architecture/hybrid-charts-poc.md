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

Each new chart contributes one representative story plus Storybook's automatic
Docs page, matching the existing Chart.js story structure. The sunburst lives
under `Echarts/Apache` and the chord under `D3`, two dedicated top-level
Storybook sections ordered beside the existing chart catalogs. Behaviors such as
updates, theming and the native escape hatch are exercised through story
controls and unit tests rather than extra variant stories.

## Acceptance evidence

POC verification is reported against AC-001 through AC-011 from the
architecture handoff. Bundle and performance results are measurements, not
preselected pass/fail budgets.
