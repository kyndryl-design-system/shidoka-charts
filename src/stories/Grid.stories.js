import { html } from 'lit';
import '../components/chart';

export default {
  title: 'Guidelines/Grid',
  argTypes: {
    height: {
      control: { type: 'number' },
    },
  },
};

const args = {
  noBorder: false,
  height: null,
};

export const Full = {
  args,
  render: (args) => {
    return html` <div class="kd-grid">
      <div class="kd-grid__col--sm-4 kd-grid__col--md-8 kd-grid__col--lg-12">
        <kd-chart
          type="bar"
          chartTitle="Bar Chart"
          description="Full Example"
          .height=${args.height}
          ?noBorder=${args.noBorder}
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
    </div>`;
  },
};
export const Half = {
  args,
  render: (args) => {
    return html`
      <div class="kd-grid">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-6">
          <kd-chart
            type="bar"
            chartTitle="Bar Chart"
            description="Half Example"
            .height=${args.height}
            ?noBorder=${args.noBorder}
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
              aspectRatio: 1.25,
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
            .height=${args.height}
            ?noBorder=${args.noBorder}
            .labels=${['Blue', 'Red', 'Orange', 'Yellow', 'Green', 'Purple']}
            .datasets=${[
              {
                label: 'Dataset 1',
                data: [12, 19, 3, 5, 2, 3],
              },
            ]}
            .options=${{
              aspectRatio: 1.25,
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
    `;
  },
};

export const Third = {
  args,
  render: (args) => {
    return html`
      <div class="kd-grid">
        <div class="kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-4">
          <kd-chart
            type="bar"
            chartTitle="Bar Chart"
            description="Third Example"
            .height=${args.height}
            ?noBorder=${args.noBorder}
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
              aspectRatio: 1,
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
            .height=${args.height}
            ?noBorder=${args.noBorder}
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
            .height=${args.height}
            ?noBorder=${args.noBorder}
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
              aspectRatio: 1,
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
    `;
  },
};
