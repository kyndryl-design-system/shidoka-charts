export default {
  colorPalette: {
    options: [
      'categorical',
      'sequential01',
      'sequential02',
      'sequential03',
      'sequential04',
      'sequential05',
      'divergent01',
      'divergent02',
      'rag03',
      'rag06',
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
