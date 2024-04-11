"use strict";(self.webpackChunk_kyndryl_design_system_shidoka_charts=self.webpackChunk_kyndryl_design_system_shidoka_charts||[]).push([[335],{"./src/common/config/chartArgTypes.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={colorPalette:{options:["categorical","sequential01","sequential02","sequential03","sequential04","sequential05","divergent01","divergent02"],control:{type:"select"}},type:{table:{disable:!0}},width:{control:{type:"number"}},height:{control:{type:"number"}},plugins:{table:{disable:!0}}}},"./src/stories/Combo.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Combo:()=>Combo,ComboFloating:()=>ComboFloating,ComboStacked:()=>ComboStacked,MultiAxis:()=>MultiAxis,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var lit__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/lit/index.js");__webpack_require__("./src/components/chart/index.ts");const __WEBPACK_DEFAULT_EXPORT__={title:"Charts/Combo",component:"kd-chart",decorators:[story=>lit__WEBPACK_IMPORTED_MODULE_0__.qy` <div style="max-width: 800px;">${story()}</div> `],parameters:{design:{type:"figma",url:"https://www.figma.com/file/9NrpK3rmbOk0lhlFkEPSaO/Data-Viz-Component-Library?node-id=71%3A5439&mode=dev"}},argTypes:__webpack_require__("./src/common/config/chartArgTypes.js").A},args={chartTitle:"Combo Chart",description:"Chart description.",labels:["Red","Blue","Yellow","Green","Purple","Orange"],datasets:[{label:"Dataset 1",data:[12,19,3,5,2,3],order:2},{type:"line",label:"Dataset 2",data:[8,15,7,9,6,13],order:1}],options:{scales:{x:{title:{text:"Color"}},y:{title:{text:"Votes"}}}},hideDescription:!1,hideCaptions:!1,hideHeader:!1,hideControls:!1,colorPalette:"categorical",noBorder:!1,width:null,height:null},Combo={args,render:args=>lit__WEBPACK_IMPORTED_MODULE_0__.qy`
      <kd-chart
        type="bar"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{colorPalette:args.colorPalette,...args.options}}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `},MultiAxis={args:{...args,datasets:[{label:"Dataset 1",data:[12,19,3,5,2,3],yAxisID:"y",order:2},{type:"line",label:"Dataset 2",data:[8,11,7,9,6,13],yAxisID:"y1",order:1}],options:{scales:{x:{title:{text:"Color"}},y:{title:{text:"Votes (Bars)"}},y1:{title:{text:"Likes (Lines)"}}}}},render:args=>lit__WEBPACK_IMPORTED_MODULE_0__.qy`
      <kd-chart
        type="bar"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{colorPalette:args.colorPalette,...args.options}}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `},ComboStacked={args:{...args,datasets:[{label:"Dataset 1",data:[12,19,3,5,2,3],stack:"combined"},{type:"line",label:"Dataset 2",data:[8,15,7,9,6,13],stack:"combined"}],options:{scales:{x:{title:{text:"Color"}},y:{title:{text:"Votes"},stacked:!0}}}},render:args=>lit__WEBPACK_IMPORTED_MODULE_0__.qy`
      <kd-chart
        type="bar"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{colorPalette:args.colorPalette,...args.options}}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `},ComboFloating={args:{...args,datasets:[{label:"Dataset 1",data:[[2,10],[12,19],[3,5],[5,9],[2,11],[3,7]],order:2},{type:"line",label:"Dataset 2",data:[8,15,7,9,6,13],order:1}],options:{scales:{x:{title:{text:"Color"}},y:{title:{text:"Votes"}}}}},render:args=>lit__WEBPACK_IMPORTED_MODULE_0__.qy`
      <kd-chart
        type="bar"
        .chartTitle=${args.chartTitle}
        .description=${args.description}
        .labels=${args.labels}
        .datasets=${args.datasets}
        ?hideDescription=${args.hideDescription}
        ?hideCaptions=${args.hideCaptions}
        ?hideHeader=${args.hideHeader}
        ?hideControls=${args.hideControls}
        ?noBorder=${args.noBorder}
        .options=${{colorPalette:args.colorPalette,...args.options}}
        .width=${args.width}
        .height=${args.height}
      ></kd-chart>
    `};Combo.parameters={...Combo.parameters,docs:{...Combo.parameters?.docs,source:{originalSource:'{\n  args,\n  render: args => {\n    return html`\n      <kd-chart\n        type="bar"\n        .chartTitle=${args.chartTitle}\n        .description=${args.description}\n        .labels=${args.labels}\n        .datasets=${args.datasets}\n        ?hideDescription=${args.hideDescription}\n        ?hideCaptions=${args.hideCaptions}\n        ?hideHeader=${args.hideHeader}\n        ?hideControls=${args.hideControls}\n        ?noBorder=${args.noBorder}\n        .options=${{\n      colorPalette: args.colorPalette,\n      ...args.options\n    }}\n        .width=${args.width}\n        .height=${args.height}\n      ></kd-chart>\n    `;\n  }\n}',...Combo.parameters?.docs?.source}}},MultiAxis.parameters={...MultiAxis.parameters,docs:{...MultiAxis.parameters?.docs,source:{originalSource:"{\n  args: {\n    ...args,\n    datasets: [{\n      label: 'Dataset 1',\n      data: [12, 19, 3, 5, 2, 3],\n      yAxisID: 'y',\n      order: 2\n    }, {\n      type: 'line',\n      label: 'Dataset 2',\n      data: [8, 11, 7, 9, 6, 13],\n      yAxisID: 'y1',\n      order: 1\n    }],\n    options: {\n      scales: {\n        x: {\n          title: {\n            text: 'Color'\n          }\n        },\n        y: {\n          title: {\n            text: 'Votes (Bars)'\n          }\n        },\n        y1: {\n          title: {\n            text: 'Likes (Lines)'\n          }\n        }\n      }\n    }\n  },\n  render: args => {\n    return html`\n      <kd-chart\n        type=\"bar\"\n        .chartTitle=${args.chartTitle}\n        .description=${args.description}\n        .labels=${args.labels}\n        .datasets=${args.datasets}\n        ?hideDescription=${args.hideDescription}\n        ?hideCaptions=${args.hideCaptions}\n        ?hideHeader=${args.hideHeader}\n        ?hideControls=${args.hideControls}\n        ?noBorder=${args.noBorder}\n        .options=${{\n      colorPalette: args.colorPalette,\n      ...args.options\n    }}\n        .width=${args.width}\n        .height=${args.height}\n      ></kd-chart>\n    `;\n  }\n}",...MultiAxis.parameters?.docs?.source}}},ComboStacked.parameters={...ComboStacked.parameters,docs:{...ComboStacked.parameters?.docs,source:{originalSource:"{\n  args: {\n    ...args,\n    datasets: [{\n      label: 'Dataset 1',\n      data: [12, 19, 3, 5, 2, 3],\n      stack: 'combined'\n    }, {\n      type: 'line',\n      label: 'Dataset 2',\n      data: [8, 15, 7, 9, 6, 13],\n      stack: 'combined'\n    }],\n    options: {\n      scales: {\n        x: {\n          title: {\n            text: 'Color'\n          }\n        },\n        y: {\n          title: {\n            text: 'Votes'\n          },\n          stacked: true\n        }\n      }\n    }\n  },\n  render: args => {\n    return html`\n      <kd-chart\n        type=\"bar\"\n        .chartTitle=${args.chartTitle}\n        .description=${args.description}\n        .labels=${args.labels}\n        .datasets=${args.datasets}\n        ?hideDescription=${args.hideDescription}\n        ?hideCaptions=${args.hideCaptions}\n        ?hideHeader=${args.hideHeader}\n        ?hideControls=${args.hideControls}\n        ?noBorder=${args.noBorder}\n        .options=${{\n      colorPalette: args.colorPalette,\n      ...args.options\n    }}\n        .width=${args.width}\n        .height=${args.height}\n      ></kd-chart>\n    `;\n  }\n}",...ComboStacked.parameters?.docs?.source}}},ComboFloating.parameters={...ComboFloating.parameters,docs:{...ComboFloating.parameters?.docs,source:{originalSource:"{\n  args: {\n    ...args,\n    datasets: [{\n      label: 'Dataset 1',\n      data: [[2, 10], [12, 19], [3, 5], [5, 9], [2, 11], [3, 7]],\n      order: 2\n    }, {\n      type: 'line',\n      label: 'Dataset 2',\n      data: [8, 15, 7, 9, 6, 13],\n      order: 1\n    }],\n    options: {\n      scales: {\n        x: {\n          title: {\n            text: 'Color'\n          }\n        },\n        y: {\n          title: {\n            text: 'Votes'\n          }\n        }\n      }\n    }\n  },\n  render: args => {\n    return html`\n      <kd-chart\n        type=\"bar\"\n        .chartTitle=${args.chartTitle}\n        .description=${args.description}\n        .labels=${args.labels}\n        .datasets=${args.datasets}\n        ?hideDescription=${args.hideDescription}\n        ?hideCaptions=${args.hideCaptions}\n        ?hideHeader=${args.hideHeader}\n        ?hideControls=${args.hideControls}\n        ?noBorder=${args.noBorder}\n        .options=${{\n      colorPalette: args.colorPalette,\n      ...args.options\n    }}\n        .width=${args.width}\n        .height=${args.height}\n      ></kd-chart>\n    `;\n  }\n}",...ComboFloating.parameters?.docs?.source}}};const __namedExportsOrder=["Combo","MultiAxis","ComboStacked","ComboFloating"]}}]);
//# sourceMappingURL=stories-Combo-stories.c96262c6.iframe.bundle.js.map