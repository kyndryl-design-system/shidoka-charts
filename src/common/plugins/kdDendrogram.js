/**
 * kdDendrogram — a Chart.js plugin (written from scratch) that renders
 * dendrogram (tree) diagrams directly onto a Chart.js canvas.
 *
 * Self-contained: no chartjs-chart-graph dependency. Works under a standard
 * Chart.js `scatter` chart whose scales are fixed to [0, 1].
 *
 * Configuration (under `options.plugins.kdDendrogram`):
 *   - orientation:   'vertical' | 'horizontal' | 'radial' (default 'vertical')
 *   - direction:     'none' | 'forward' | 'reverse' | 'both' (default 'none')
 *                      forward = parent→child arrow
 *                      reverse = child→parent arrow
 *                      both    = arrowheads on both ends
 *   - expandable:    boolean (default true) — click a node to toggle its
 *                    subtree. Subtree expand/collapse is animated.
 *   - animationDuration: number ms for layout transitions (default 350)
 *   - hoverScale:    number multiplier on hover (default 1.2)
 *   - nodeRadius:    base node radius in px (default 14)
 *   - nodeStroke / nodeStrokeWidth: optional border (default no border)
 *   - edgeColor / edgeWidth / arrowSize
 *   - iconSize:      px size for icon images (default 16)
 *   - palette:       string[] override (default categorical palette)
 *
 * Labels are rendered by chartjs-plugin-datalabels — style them via
 * `options.plugins.datalabels` (color, font, backgroundColor, etc).
 */

import { getComputedColorPalette } from '../config/colorPalettes';

const PLUGIN_ID = 'kdDendrogram';
const ICON_CACHE = new WeakMap(); // chart -> Map(key -> {img, ready})
const STATE = new WeakMap(); // chart -> internal state

/* ------------------------------------------------------------------ */
/* Tree building / traversal                                           */
/* ------------------------------------------------------------------ */

function buildTree(nodes, collapsedSet) {
  const list = nodes.map((n, i) => ({
    index: i,
    id: n.id ?? i,
    name: n.name ?? String(i),
    icon: n.icon,
    direction: n.direction || null,
    raw: n,
    parentRef: n.parent ?? null,
    parent: null,
    children: [],
    depth: 0,
    branch: -1,
    collapsed: collapsedSet.has(n.id ?? i) || n.collapsed === true,
  }));

  // Build a lookup from id -> index for resolving parent references.
  const idMap = new Map();
  for (const node of list) {
    idMap.set(node.id, node.index);
  }

  let root = null;
  for (const node of list) {
    if (node.parentRef === null || node.parentRef === undefined) {
      root = root || node;
      node.parent = null;
    } else {
      // Resolve parent: try as an id first, then as a numeric index.
      let parentIdx = idMap.get(node.parentRef);
      if (parentIdx === undefined && typeof node.parentRef === 'number') {
        parentIdx = node.parentRef;
      }
      if (parentIdx !== undefined && list[parentIdx]) {
        node.parent = parentIdx;
        list[parentIdx].children.push(node);
      } else {
        // Unresolved parent — treat as root-level.
        node.parent = null;
        root = root || node;
      }
    }
  }
  if (!root && list.length) root = list[0];
  if (!root) return { root: null, list };

  const queue = [{ node: root, depth: 0, branch: -1 }];
  while (queue.length) {
    const { node, depth, branch } = queue.shift();
    node.depth = depth;
    node.branch = branch;
    for (let i = 0; i < node.children.length; i++) {
      const c = node.children[i];
      const cb = depth === 0 ? i : branch;
      queue.push({ node: c, depth: depth + 1, branch: cb });
    }
  }
  return { root, list };
}

function effectiveChildren(n) {
  return n.collapsed ? [] : n.children;
}

function visibleNodes(root) {
  const out = [];
  if (!root) return out;
  (function walk(n) {
    out.push(n);
    if (!n.collapsed) for (const c of n.children) walk(c);
  })(root);
  return out;
}

/* ------------------------------------------------------------------ */
/* Layout (works in normalized [0..1] data space)                      */
/* ------------------------------------------------------------------ */

function layoutCartesian(root, orientation) {
  // Layout uses ALL children (ignoring collapsed state) so node positions
  // remain stable when subtrees are collapsed/expanded.
  const leaves = [];
  let maxDepth = 0;
  (function walk(n) {
    maxDepth = Math.max(maxDepth, n.depth);
    if (!n.children.length) leaves.push(n);
    else n.children.forEach(walk);
  })(root);

  // Inset by PAD so outermost nodes aren't clipped by the canvas boundary.
  const PAD = 0.06;
  const lo = PAD;
  const hi = 1 - PAD;
  const span = hi - lo;

  const leafCount = Math.max(leaves.length, 1);
  leaves.forEach((leaf, i) => {
    leaf._cross = leafCount === 1 ? 0.5 : lo + (i / (leafCount - 1)) * span;
  });

  (function walk(n) {
    if (n.children.length) {
      n.children.forEach(walk);
      n._cross =
        (n.children[0]._cross + n.children[n.children.length - 1]._cross) / 2;
    }
  })(root);

  const depthFrac = (d) => (maxDepth === 0 ? 0.5 : lo + (d / maxDepth) * span);

  (function place(n) {
    if (orientation === 'horizontal') {
      n.dataX = depthFrac(n.depth);
      n.dataY = n._cross;
    } else {
      n.dataX = n._cross;
      n.dataY = depthFrac(n.depth);
    }
    n.children.forEach(place);
  })(root);
}

function layoutRadial(root) {
  // Layout uses ALL children (ignoring collapsed state) so positions are stable.
  const leaves = [];
  let maxDepth = 0;
  (function walk(n) {
    maxDepth = Math.max(maxDepth, n.depth);
    if (!n.children.length) leaves.push(n);
    else n.children.forEach(walk);
  })(root);

  const leafCount = Math.max(leaves.length, 1);
  leaves.forEach((leaf, i) => {
    leaf._angle = (2 * Math.PI * i) / leafCount;
  });

  (function walk(n) {
    if (n.children.length) {
      n.children.forEach(walk);
      const angles = n.children.map((c) => c._angle);
      n._angle = angles.reduce((a, b) => a + b, 0) / angles.length;
    }
  })(root);

  // Use radius 0.42 (instead of 0.5) so outermost ring stays inside canvas.
  (function place(n) {
    const r = maxDepth === 0 ? 0 : n.depth / maxDepth;
    n.dataX = 0.5 + r * 0.42 * Math.cos(n._angle - Math.PI / 2);
    n.dataY = 0.5 + r * 0.42 * Math.sin(n._angle - Math.PI / 2);
    n.children.forEach(place);
  })(root);
}

/* ------------------------------------------------------------------ */
/* Canvas drawing helpers                                              */
/* ------------------------------------------------------------------ */

function drawArrowHead(ctx, fromX, fromY, toX, toY, size, color) {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - size * Math.cos(angle - Math.PI / 6),
    toY - size * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - size * Math.cos(angle + Math.PI / 6),
    toY - size * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function nodeColor(node, palette) {
  if (!palette || !palette.length) return '#3a5cff';
  // Root uses palette[0]; child branches start at palette[1] to avoid sharing
  // the same color as the root.
  if (node.branch < 0) return palette[0];
  const idx = (node.branch + 1) % palette.length;
  return palette[idx];
}

function drawEdges(ctx, edges, opts) {
  const { edgeColor, edgeWidth, direction, arrowSize, nodeRadius } = opts;

  ctx.save();
  ctx.strokeStyle = edgeColor;
  ctx.lineWidth = edgeWidth;
  ctx.lineCap = 'round';

  for (const [p, c, alpha, edgeDir] of edges) {
    ctx.globalAlpha = alpha;
    const dx = c.px - p.px;
    const dy = c.py - p.py;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const sx = p.px + ux * nodeRadius;
    const sy = p.py + uy * nodeRadius;
    const ex = c.px - ux * nodeRadius;
    const ey = c.py - uy * nodeRadius;

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // Per-edge direction overrides global direction.
    const dir = edgeDir || direction;
    if (dir === 'forward' || dir === 'both') {
      drawArrowHead(ctx, sx, sy, ex, ey, arrowSize, edgeColor);
    }
    if (dir === 'reverse' || dir === 'both') {
      drawArrowHead(ctx, ex, ey, sx, sy, arrowSize, edgeColor);
    }
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function getIconImage(chart, icon) {
  if (!icon) return null;
  let cache = ICON_CACHE.get(chart);
  if (!cache) {
    cache = new Map();
    ICON_CACHE.set(chart, cache);
  }
  let entry = cache.get(icon);
  if (entry) return entry;

  entry = { img: null, ready: false };
  cache.set(icon, entry);

  let src = icon;
  let revoke = null;
  const trimmed = typeof icon === 'string' ? icon.trim() : '';
  if (trimmed.startsWith('<svg') || trimmed.startsWith('<?xml')) {
    try {
      const blob = new Blob([trimmed], { type: 'image/svg+xml' });
      src = URL.createObjectURL(blob);
      revoke = src;
    } catch {
      return entry;
    }
  }

  const img = new Image();
  img.onload = () => {
    entry.ready = true;
    if (revoke) URL.revokeObjectURL(revoke);
    try {
      chart.draw();
    } catch {
      /* destroyed */
    }
  };
  img.onerror = () => {
    if (revoke) URL.revokeObjectURL(revoke);
  };
  img.src = src;
  entry.img = img;
  return entry;
}

function drawNode(ctx, chart, node, opts, palette, hoverScale, alpha) {
  const r = opts.nodeRadius * (hoverScale || 1);
  const fill = nodeColor(node, palette);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.arc(node.px, node.py, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (opts.nodeStrokeWidth > 0) {
    ctx.lineWidth = opts.nodeStrokeWidth;
    ctx.strokeStyle = opts.nodeStroke;
    ctx.stroke();
  }
  ctx.restore();

  if (node.icon) {
    const entry = getIconImage(chart, node.icon);
    if (entry && entry.ready && entry.img) {
      const size = opts.iconSize * (hoverScale || 1);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.drawImage(
        entry.img,
        node.px - size / 2,
        node.py - size / 2,
        size,
        size
      );
      ctx.restore();
    }
  }

  if (node.collapsed && node.children.length) {
    const bx = node.px + r * 0.75;
    const by = node.py - r * 0.75;
    const br = Math.max(5, r * 0.4);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fillStyle = opts.badgeFill;
    ctx.fill();
    ctx.strokeStyle = opts.badgeStroke;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = opts.badgeStroke;
    ctx.font = `bold ${Math.round(br * 1.5)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', bx, by + 1);
    ctx.restore();
  }
}

/* ------------------------------------------------------------------ */
/* State / interaction / animation                                     */
/* ------------------------------------------------------------------ */

function getState(chart) {
  let s = STATE.get(chart);
  if (!s) {
    s = {
      collapsed: new Set(),
      hoverIndex: -1,
      hoverScales: new Map(),
      // Animation: per-node-index tracked positions/alphas.
      // each entry: { x, y, alpha } (current values)
      tracked: new Map(),
      animating: false,
      handlers: null,
      lastVisible: [],
      lastTargets: new Map(), // index -> { x, y, alpha }
    };
    STATE.set(chart, s);
  }
  return s;
}

function pickNode(chart, x, y, opts) {
  const s = getState(chart);
  const r = opts.nodeRadius * 1.25;
  for (let i = s.lastVisible.length - 1; i >= 0; i--) {
    const n = s.lastVisible[i];
    const dx = x - n.px;
    const dy = y - n.py;
    if (dx * dx + dy * dy <= r * r) return n;
  }
  return null;
}

function ensureHandlers(chart, opts) {
  const s = getState(chart);
  if (s.handlers) return;
  const canvas = chart.canvas;
  if (!canvas) return;

  const toCanvas = (e) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height,
    };
  };

  const onMove = (e) => {
    const { x, y } = toCanvas(e);
    const node = pickNode(chart, x, y, opts);
    const next = node ? node.index : -1;
    if (next !== s.hoverIndex) {
      s.hoverIndex = next;
      canvas.style.cursor = node ? 'pointer' : '';
      requestRedraw(chart);
    }
  };
  const onLeave = () => {
    if (s.hoverIndex !== -1) {
      s.hoverIndex = -1;
      canvas.style.cursor = '';
      requestRedraw(chart);
    }
  };
  const onClick = (e) => {
    if (!opts.expandable) return;
    const { x, y } = toCanvas(e);
    const node = pickNode(chart, x, y, opts);
    if (!node || !node.children.length) return;
    if (s.collapsed.has(node.id)) s.collapsed.delete(node.id);
    else s.collapsed.add(node.id);
    requestRedraw(chart);
  };

  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseleave', onLeave);
  canvas.addEventListener('click', onClick);
  s.handlers = { onMove, onLeave, onClick };
}

function removeHandlers(chart) {
  const s = STATE.get(chart);
  if (!s || !s.handlers) return;
  const canvas = chart.canvas;
  if (canvas) {
    canvas.removeEventListener('mousemove', s.handlers.onMove);
    canvas.removeEventListener('mouseleave', s.handlers.onLeave);
    canvas.removeEventListener('click', s.handlers.onClick);
  }
  s.handlers = null;
}

function requestRedraw(chart) {
  const s = getState(chart);
  if (s.rafPending) return;
  s.rafPending = true;
  requestAnimationFrame(() => {
    s.rafPending = false;
    try {
      chart.update('none');
    } catch {
      /* destroyed */
    }
  });
}

/* ------------------------------------------------------------------ */
/* Plugin definition                                                   */
/* ------------------------------------------------------------------ */

const kdDendrogramPlugin = {
  id: PLUGIN_ID,

  defaults: {
    _enabled: false,
    orientation: 'vertical',
    direction: 'none',
    expandable: true,
    animationDuration: 350,
    hoverScale: 1.2,
    nodeRadius: 14,
    nodeStroke: '#3d3c3c',
    nodeStrokeWidth: 0,
    edgeColor: '#9a9a9a',
    edgeWidth: 1.5,
    arrowSize: 9,
    iconSize: 16,
    palette: null,
    badgeFill: '#ffffff',
    badgeStroke: '#3d3c3c',
  },

  /**
   * Mutates the chart's first dataset to contain one point per visible node.
   * This lets chartjs-plugin-datalabels render labels using the standard
   * theming, and gives Chart.js scales meaningful data to lay out against.
   */
  beforeUpdate(chart, _args, opts) {
    if (!opts || !opts._enabled) return;

    // Resolve tree from dataset[0].data.
    const ds = chart.data?.datasets?.[0];
    const fromDataset =
      Array.isArray(ds?._dendroSource) && ds._dendroSource.length
        ? ds._dendroSource
        : Array.isArray(ds?.data) &&
          ds.data.length &&
          ds.data[0] &&
          typeof ds.data[0].name !== 'undefined' &&
          typeof ds.data[0].x === 'undefined'
        ? ds.data
        : null;
    const tree = fromDataset || [];
    if (!tree.length || !ds) return;

    // Stash original tree on the dataset so subsequent updates don't mistake
    // our generated `{x,y,name}` points for source data.
    if (fromDataset) ds._dendroSource = fromDataset;

    const s = getState(chart);

    // Seed collapsed set from node data on first pass (respects per-node
    // `collapsed: true` in the tree definition).
    if (!s._seeded) {
      for (const n of tree) {
        if (n.collapsed === true) {
          s.collapsed.add(n.id ?? tree.indexOf(n));
        }
      }
      s._seeded = true;
    }

    const orientation = ['vertical', 'horizontal', 'radial'].includes(
      opts.orientation
    )
      ? opts.orientation
      : 'vertical';

    const built = buildTree(tree, s.collapsed);
    if (!built.root) return;

    if (orientation === 'radial') layoutRadial(built.root);
    else layoutCartesian(built.root, orientation);

    const visible = visibleNodes(built.root);

    // Build dataset points. For horizontal/vertical we map dataY directly to
    // the y-scale; consumers should set y reversed so the root appears on top.
    ds.data = visible.map((n) => ({
      x: n.dataX,
      y: n.dataY,
      name: n.name,
      _index: n.index,
      _branch: n.branch,
    }));

    // Ensure the underlying scatter points are invisible — the plugin paints
    // its own circles. Datalabels still anchors to these points.
    // pointHitRadius keeps tooltip detection working despite pointRadius 0.
    ds.pointRadius = 0;
    ds.pointHoverRadius = 0;
    ds.pointHitRadius = opts.nodeRadius || 14;
    ds.showLine = false;
    ds.borderColor = 'rgba(0,0,0,0)';

    // Set per-point backgroundColor matching the plugin's palette so that
    // Chart.js tooltips inherit the correct color swatch automatically.
    let palette = Array.isArray(opts.palette) ? opts.palette : null;
    if (!palette || !palette.length) {
      try {
        palette = getComputedColorPalette(
          chart.options.colorPalette || 'categorical'
        );
      } catch {
        palette = ['#3a5cff'];
      }
    }
    ds.backgroundColor = visible.map((n) => {
      if (n.branch < 0) return palette[0];
      return palette[(n.branch + 1) % palette.length] || palette[0];
    });

    // Stash the build for beforeDatasetsDraw.
    s.lastBuild = { root: built.root, list: built.list, visible, orientation };
  },

  // Draw edges and nodes in beforeDatasetsDraw so they render underneath
  // chartjs-plugin-datalabels (which draws in afterDatasetsDraw).
  beforeDatasetsDraw(chart, _args, opts) {
    if (!opts || !opts._enabled) return;
    const s = getState(chart);
    if (!s.lastBuild) return;

    ensureHandlers(chart, opts);

    const ctx = chart.ctx;
    const xScale = chart.scales?.x;
    const yScale = chart.scales?.y;
    if (!xScale || !yScale) return;

    const { visible } = s.lastBuild;

    // Compute target pixel positions for visible nodes.
    const targets = new Map();
    for (const n of visible) {
      n.px = xScale.getPixelForValue(n.dataX);
      n.py = yScale.getPixelForValue(n.dataY);
      targets.set(n.index, { x: n.px, y: n.py, alpha: 1 });
    }

    // Per-frame lerp factor — converges in ~20-25 frames (~350ms @ 60fps).
    // Higher = snappier; lower = smoother.
    const LERP = Math.min(
      0.5,
      Math.max(0.08, 16 / Math.max(60, opts.animationDuration ?? 350))
    );

    // For nodes that disappeared (in tracked but not visible), animate them
    // toward their parent's target position and fade out.
    const visibleIndexSet = new Set(visible.map((n) => n.index));
    const exitingTargets = new Map();
    for (const idx of s.tracked.keys()) {
      if (!visibleIndexSet.has(idx)) {
        // Find nearest visible ancestor in the original list.
        const node = s.lastBuild.list[idx];
        let anc = node?.parent != null ? s.lastBuild.list[node.parent] : null;
        while (anc && !visibleIndexSet.has(anc.index)) {
          anc = anc.parent != null ? s.lastBuild.list[anc.parent] : null;
        }
        if (anc) {
          exitingTargets.set(idx, {
            x: anc.px,
            y: anc.py,
            alpha: 0,
          });
        } else {
          exitingTargets.set(idx, { x: 0, y: 0, alpha: 0 });
        }
      }
    }

    // For new nodes, start them at their parent's last tracked position.
    for (const n of visible) {
      if (!s.tracked.has(n.index)) {
        let parentTracked = null;
        let p = n.parent != null ? s.lastBuild.list[n.parent] : null;
        while (p) {
          if (s.tracked.has(p.index)) {
            parentTracked = s.tracked.get(p.index);
            break;
          }
          p = p.parent != null ? s.lastBuild.list[p.parent] : null;
        }
        s.tracked.set(n.index, {
          x: parentTracked ? parentTracked.x : n.px,
          y: parentTracked ? parentTracked.y : n.py,
          alpha: 0,
        });
      }
    }

    // Compose the full target set (visible + exiting).
    const allTargets = new Map(targets);
    for (const [k, v] of exitingTargets) allTargets.set(k, v);

    let stillAnimating = false;
    for (const [idx, target] of allTargets) {
      const cur = s.tracked.get(idx) || { x: target.x, y: target.y, alpha: 0 };
      const nx = cur.x + (target.x - cur.x) * LERP;
      const ny = cur.y + (target.y - cur.y) * LERP;
      const na = cur.alpha + (target.alpha - cur.alpha) * LERP;
      const settled =
        Math.abs(nx - target.x) < 0.5 &&
        Math.abs(ny - target.y) < 0.5 &&
        Math.abs(na - target.alpha) < 0.01;
      if (settled) {
        if (target.alpha === 0) {
          // Fully exited: drop tracking for next pass.
          s.tracked.delete(idx);
        } else {
          s.tracked.set(idx, { x: target.x, y: target.y, alpha: target.alpha });
        }
      } else {
        s.tracked.set(idx, { x: nx, y: ny, alpha: na });
        stillAnimating = true;
      }
    }

    // Resolve palette. Prefer explicit opts.palette array, then fall back to
    // the kd-chart component-level colorPalette (chart.options.colorPalette).
    let palette = Array.isArray(opts.palette) ? opts.palette : null;
    if (!palette || !palette.length) {
      try {
        palette = getComputedColorPalette(
          chart.options.colorPalette || 'categorical'
        );
      } catch {
        palette = ['#3a5cff'];
      }
    }

    // Compute hover scale animation per node.
    const HOVER_SCALE = opts.hoverScale ?? 1.2;
    for (const n of visible) {
      const cur = s.hoverScales.get(n.index) ?? 1;
      const targetScale = n.index === s.hoverIndex ? HOVER_SCALE : 1;
      const next = cur + (targetScale - cur) * 0.25;
      if (Math.abs(next - targetScale) < 0.005) {
        if (targetScale === 1) s.hoverScales.delete(n.index);
        else s.hoverScales.set(n.index, targetScale);
      } else {
        s.hoverScales.set(n.index, next);
        stillAnimating = true;
      }
    }

    // Apply tracked positions to nodes (override target with current animated
    // value so edges/nodes/datalabels move together).
    for (const n of visible) {
      const tr = s.tracked.get(n.index);
      if (tr) {
        n.px = tr.x;
        n.py = tr.y;
      }
    }
    s.lastVisible = visible;

    // Build edges from visible parent-child relationships, plus exiting edges
    // (for collapse animation): an exiting node still in `tracked` connects
    // to its visible ancestor.
    const edges = [];
    for (const n of visible) {
      for (const c of effectiveChildren(n)) {
        const cTr = s.tracked.get(c.index);
        const a = cTr ? cTr.alpha : 1;
        // Mutate child px/py temporarily for drawing
        const cx = cTr ? cTr.x : c.px;
        const cy = cTr ? cTr.y : c.py;
        // Per-node direction: the child's `direction` field controls the
        // arrow style on the edge from parent to this child.
        edges.push([
          { px: n.px, py: n.py },
          { px: cx, py: cy },
          a,
          c.direction,
        ]);
      }
    }
    // Edges to exiting nodes
    for (const [idx, tr] of s.tracked) {
      if (visibleIndexSet.has(idx)) continue;
      const node = s.lastBuild.list[idx];
      if (!node) continue;
      // Find visible ancestor
      let anc = node.parent != null ? s.lastBuild.list[node.parent] : null;
      while (anc && !visibleIndexSet.has(anc.index)) {
        anc = anc.parent != null ? s.lastBuild.list[anc.parent] : null;
      }
      if (!anc) continue;
      edges.push([
        { px: anc.px, py: anc.py },
        { px: tr.x, py: tr.y },
        tr.alpha,
      ]);
    }

    drawEdges(ctx, edges, opts);

    // Draw exiting nodes first (so they appear under live ones).
    for (const [idx, tr] of s.tracked) {
      if (visibleIndexSet.has(idx)) continue;
      const node = s.lastBuild.list[idx];
      if (!node) continue;
      node.px = tr.x;
      node.py = tr.y;
      drawNode(ctx, chart, node, opts, palette, 1, tr.alpha);
    }

    for (const n of visible) {
      const scale = s.hoverScales.get(n.index) ?? 1;
      const tr = s.tracked.get(n.index);
      drawNode(ctx, chart, n, opts, palette, scale, tr ? tr.alpha : 1);
    }

    // Hide datalabels on exiting nodes (they're not in dataset anyway).

    if (stillAnimating) requestRedraw(chart);
  },

  afterDestroy(chart) {
    removeHandlers(chart);
    ICON_CACHE.delete(chart);
    STATE.delete(chart);
  },
};

export default kdDendrogramPlugin;
