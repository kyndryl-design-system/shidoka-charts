import { html } from 'lit';

export default {
  title: 'Patterns/Grid',
  decorators: [
    (story) =>
      html`
        <style>
          .grid-examples .kd-grid {
            margin-top: 32px;
            margin-bottom: 32px;
          }
        </style>
        ${story()}
      `,
  ],
};

const args = {};

export const Grid = {
  args,
  render: (args) => {
    return html`
      <div class="grid-examples">
        <div class="kd-grid">
          <div
            class="kd-grid__col--sm-4 kd-grid__col--md-8 kd-grid__col--lg-12"
          >
            <kd-chart
              type="bar"
              chartTitle="Bar Chart"
              description="Full Example"
              .labels=${['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']}
              .datasets=${[
                {
                  label: 'Dataset 1',
                  data: [12, 19, 3, 5, 2, 3],
                },
                {
                  label: 'Dataset 2',
                  data: [8, 15, 7, 9, 6, 13],
                },
              ]}
              .options=${{
                scales: {
                  x: {
                    title: {
                      text: 'Color',
                    },
                  },
                  y: {
                    title: {
                      text: 'Votes',
                    },
                  },
                },
              }}
            ></kd-chart>
          </div>
        </div>

        <div class="kd-grid">
          <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-6">
            <kd-chart
              type="bar"
              chartTitle="Bar Chart"
              description="Half Example"
              .labels=${['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']}
              .datasets=${[
                {
                  label: 'Dataset 1',
                  data: [12, 19, 3, 5, 2, 3],
                },
                {
                  label: 'Dataset 2',
                  data: [8, 15, 7, 9, 6, 13],
                },
              ]}
              .options=${{
                scales: {
                  x: {
                    title: {
                      text: 'Color',
                    },
                  },
                  y: {
                    title: {
                      text: 'Votes',
                    },
                  },
                },
              }}
            ></kd-chart>
          </div>

          <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-6">
            <kd-chart
              type="doughnut"
              chartTitle="Doughnut Chart"
              description="Half Example"
              .labels=${['Blue', 'Red', 'Orange', 'Yellow', 'Green', 'Purple']}
              .datasets=${[
                {
                  label: 'Dataset 1',
                  data: [12, 19, 3, 5, 2, 3],
                },
              ]}
              .options=${{
                scales: {
                  x: {
                    title: {
                      text: 'Color',
                    },
                  },
                  y: {
                    title: {
                      text: 'Votes',
                    },
                  },
                },
              }}
            ></kd-chart>
          </div>
        </div>

        <div class="kd-grid">
          <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4">
            <kd-chart
              type="bar"
              chartTitle="Bar Chart"
              description="Third Example"
              .labels=${['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']}
              .datasets=${[
                {
                  label: 'Dataset 1',
                  data: [12, 19, 3, 5, 2, 3],
                },
                {
                  label: 'Dataset 2',
                  data: [8, 15, 7, 9, 6, 13],
                },
              ]}
              .options=${{
                scales: {
                  x: {
                    title: {
                      text: 'Color',
                    },
                  },
                  y: {
                    title: {
                      text: 'Votes',
                    },
                  },
                },
              }}
            ></kd-chart>
          </div>

          <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4">
            <kd-chart
              type="doughnut"
              chartTitle="Doughnut Chart"
              description="Third Example"
              .labels=${['Blue', 'Red', 'Orange', 'Yellow', 'Green', 'Purple']}
              .datasets=${[
                {
                  label: 'Dataset 1',
                  data: [12, 19, 3, 5, 2, 3],
                },
              ]}
              .options=${{
                scales: {
                  x: {
                    title: {
                      text: 'Color',
                    },
                  },
                  y: {
                    title: {
                      text: 'Votes',
                    },
                  },
                },
              }}
            ></kd-chart>
          </div>

          <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4">
            <kd-chart
              type="line"
              chartTitle="Line Chart"
              description="Third Example"
              .labels=${['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']}
              .datasets=${[
                {
                  label: 'Dataset 1',
                  data: [12, 19, 3, 5, 2, 3],
                },
                {
                  label: 'Dataset 2',
                  data: [8, 15, 7, 9, 6, 13],
                },
              ]}
              .options=${{
                scales: {
                  x: {
                    title: {
                      text: 'Color',
                    },
                  },
                  y: {
                    title: {
                      text: 'Votes',
                    },
                  },
                },
              }}
            ></kd-chart>
          </div>
        </div>
      </div>
    `;
  },
};
