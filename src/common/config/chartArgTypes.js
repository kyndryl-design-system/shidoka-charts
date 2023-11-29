export default {
  colorPalette: {
    options: [
      'categorical',
      'single',
      'highlight',
      'sequential01',
      'sequential02',
      'sequential03',
      'sequential04',
      'sequential05',
      'divergent01',
      'divergent02',
    ],
    control: { type: 'select' },
  },
  type: {
    table: {
      disable: true,
    },
  },
  width: {
    control: { type: 'number' },
  },
  height: {
    control: { type: 'number' },
  },
  plugins: {
    table: {
      disable: true,
    },
  },
};
