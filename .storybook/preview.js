import DocumentationTemplate from './DocumentationTemplate.mdx';
import { setCustomElementsManifest } from '@storybook/web-components';
import customElements from '../custom-elements.json';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { BREAKPOINT_VIEWPORTS } from '@kyndryl-design-system/shidoka-foundation/common/helpers/breakpoints';

import './global.scss?global';

export default {
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      page: DocumentationTemplate,
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Welcome'],
      },
    },
    backgrounds: { disable: true },
    viewport: {
      viewports: {
        ...BREAKPOINT_VIEWPORTS,
        ...INITIAL_VIEWPORTS,
      },
    },
    a11y: {
      // disable violations flagged in chartjs-plugin-a11y-legend
      config: {
        rules: [
          {
            id: 'aria-toggle-field-name',
            enabled: false,
          },
          {
            id: 'aria-required-parent',
            enabled: false,
          },
        ],
      },
    },
  },

  tags: ['autodocs'],
};

setCustomElementsManifest(customElements);
