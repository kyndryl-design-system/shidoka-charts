declare module '*.scss' {
  import { CSSResultGroup } from 'lit';
  const styles: CSSResultGroup;
  export default styles;
}

declare module '*.svg';
declare module '@kyndryl-design-system/shidoka-icons';

declare module 'chartjs-plugin-a11y-legend';
declare module 'chartjs-plugin-chart2music';

declare module '*?raw' {
  const content: string;
  export default content;
}

declare module '*?inline' {
  const content: string;
  export default content;
}
