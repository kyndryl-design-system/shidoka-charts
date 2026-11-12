import { addons } from 'storybook/manager-api';
import { createElement } from 'react';
import {
  Sidebar,
  defaultConfig,
  matchTags,
  renderLabel,
} from 'storybook-addon-tag-badges/manager-helpers';
import theme from './theme';

// Prefix a badge tag with `section:` to display it on the story's root section.
// Example: `tags: ['section:new']`.
const sectionTagPrefix = 'section:';
const tagBadges = [
  {
    tags: 'updated',
    badge: {
      text: 'Updated',
      style: {
        backgroundColor: '#0255d0',
        color: '#e9f2ff',
      },
    },
  },
  ...defaultConfig,
];

function getSectionBadgeTag(sectionName, api) {
  const sectionTags = Object.values(api.getIndex()?.entries ?? {})
    .filter((entry) => entry.title.split('/')[0] === sectionName)
    .flatMap((entry) => entry.tags ?? [])
    .filter((tag) => tag.startsWith(sectionTagPrefix))
    .map((tag) => tag.slice(sectionTagPrefix.length));

  for (const config of tagBadges) {
    const [tag] = matchTags(sectionTags, config.tags);
    if (tag) return tag;
  }
}

addons.setConfig({
  theme: theme,
  tagBadges,
  sidebar: {
    renderLabel: (item, api) => {
      const badgeTag =
        item.type === 'root' && getSectionBadgeTag(item.name, api);

      if (badgeTag) {
        return createElement(
          Sidebar,
          { item: { ...item, type: 'component', tags: [badgeTag] } },
          item.name
        );
      }

      return renderLabel(item);
    },
  },
});
