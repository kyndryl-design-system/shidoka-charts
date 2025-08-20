export type PaletteKey =
  | 'Categorical01'
  | 'Sequential01'
  | 'Sequential02'
  | 'Sequential03'
  | 'Sequential04'
  | 'Sequential05'
  | 'Divergent01'
  | 'Divergent02'
  | 'RAG03'
  | 'RAG08';

export type Mode = 'light' | 'dark';

type Hex = `#${string}`;

type SolidColor = { solid: { color: Hex } };

export interface PbiTheme {
  name: string;
  dataColors: Hex[];
  background: Hex;
  foreground: Hex;
  tableAccent: Hex;
  visualStyles: {
    '*': {
      '*': {
        general: {
          background: SolidColor;
          foreground: SolidColor;
          tableAccent: SolidColor;
        };
        colorPalette: SolidColor[];
      };
    };
  };
}

interface ThemeFile {
  generatedAt: string;
  source: string;
  palette: PaletteKey;
  themes: Record<Mode, PbiTheme>;
}

export interface LoadThemeOptions {
  /**
   * Base path or absolute URL where the JSON theme files are hosted
   */
  basePath?: string;
}

function buildUrl(paletteKey: PaletteKey, basePath: string): string {
  const base = basePath.replace(/\/+$/, '');
  return `${base}/Shidoka-${paletteKey}.json`;
}

export async function loadPbiTheme(
  paletteKey: PaletteKey,
  mode: Mode,
  options: LoadThemeOptions = {}
): Promise<PbiTheme> {
  const basePath = options.basePath ?? 'pbi-themes';
  const url = buildUrl(paletteKey, basePath);

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Theme fetch failed: ${res.status} ${url}`);

  const json: ThemeFile = await res.json();
  const theme = json?.themes?.[mode];
  if (!theme) throw new Error(`Theme missing for ${paletteKey}/${mode}`);
  return theme;
}
