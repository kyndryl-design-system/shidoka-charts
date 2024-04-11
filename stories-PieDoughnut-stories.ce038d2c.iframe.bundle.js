"use strict";(self.webpackChunk_kyndryl_design_system_shidoka_charts=self.webpackChunk_kyndryl_design_system_shidoka_charts||[]).push([[345],{"./src/common/config/chartArgTypes.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={colorPalette:{options:["categorical","sequential01","sequential02","sequential03","sequential04","sequential05","divergent01","divergent02"],control:{type:"select"}},type:{table:{disable:!0}},width:{control:{type:"number"}},height:{control:{type:"number"}},plugins:{table:{disable:!0}}}},"./src/stories/PieDoughnut.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Doughnut:()=>Doughnut,Pie:()=>Pie,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var lit__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/lit/index.js");__webpack_require__("./src/components/chart/index.ts");const __WEBPACK_DEFAULT_EXPORT__={title:"Charts/Pie & Doughnut",component:"kd-chart",decorators:[story=>lit__WEBPACK_IMPORTED_MODULE_0__.qy` <div style="max-width: 600px;">${story()}</div> `],parameters:{design:{type:"figma",url:"https://www.figma.com/file/9NrpK3rmbOk0lhlFkEPSaO/Data-Viz-Component-Library?node-id=64%3A4378&mode=dev"}},argTypes:__webpack_require__("./src/common/config/chartArgTypes.js").A},args={chartTitle:"Pie Chart",description:"Chart description.",labels:["Blue","Red","Orange","Yellow","Green","Purple"],datasets:[{label:"Dataset 1",data:[12,19,3,5,2,3]}],options:{scales:{x:{title:{text:"Color"}},y:{title:{text:"Votes"}}}},hideDescription:!1,hideCaptions:!1,hideHeader:!1,hideControls:!1,colorPalette:"categorical",noBorder:!1,width:null,height:null},Pie={args,render:args=>lit__WEBPACK_IMPORTED_MODULE_0__.qy`
      <kd-chart
        type="pie"
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
    `},Doughnut={args:{...args,chartTitle:"Doughnut Chart"},render:args=>lit__WEBPACK_IMPORTED_MODULE_0__.qy`
      <kd-chart
        type="doughnut"
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
    `,parameters:{design:{type:"figma",url:"https://www.figma.com/file/9NrpK3rmbOk0lhlFkEPSaO/Data-Viz-Component-Library?node-id=64%3A4703&mode=dev"}}};Pie.parameters={...Pie.parameters,docs:{...Pie.parameters?.docs,source:{originalSource:'{\n  args,\n  render: args => {\n    return html`\n      <kd-chart\n        type="pie"\n        .chartTitle=${args.chartTitle}\n        .description=${args.description}\n        .labels=${args.labels}\n        .datasets=${args.datasets}\n        ?hideDescription=${args.hideDescription}\n        ?hideCaptions=${args.hideCaptions}\n        ?hideHeader=${args.hideHeader}\n        ?hideControls=${args.hideControls}\n        ?noBorder=${args.noBorder}\n        .options=${{\n      colorPalette: args.colorPalette,\n      ...args.options\n    }}\n        .width=${args.width}\n        .height=${args.height}\n      ></kd-chart>\n    `;\n  }\n}',...Pie.parameters?.docs?.source}}},Doughnut.parameters={...Doughnut.parameters,docs:{...Doughnut.parameters?.docs,source:{originalSource:"{\n  args: {\n    ...args,\n    chartTitle: 'Doughnut Chart'\n  },\n  render: args => {\n    return html`\n      <kd-chart\n        type=\"doughnut\"\n        .chartTitle=${args.chartTitle}\n        .description=${args.description}\n        .labels=${args.labels}\n        .datasets=${args.datasets}\n        ?hideDescription=${args.hideDescription}\n        ?hideCaptions=${args.hideCaptions}\n        ?hideHeader=${args.hideHeader}\n        ?hideControls=${args.hideControls}\n        ?noBorder=${args.noBorder}\n        .options=${{\n      colorPalette: args.colorPalette,\n      ...args.options\n    }}\n        .width=${args.width}\n        .height=${args.height}\n      ></kd-chart>\n    `;\n  },\n  parameters: {\n    design: {\n      type: 'figma',\n      url: 'https://www.figma.com/file/9NrpK3rmbOk0lhlFkEPSaO/Data-Viz-Component-Library?node-id=64%3A4703&mode=dev'\n    }\n  }\n}",...Doughnut.parameters?.docs?.source}}};const __namedExportsOrder=["Pie","Doughnut"]}}]);
//# sourceMappingURL=stories-PieDoughnut-stories.ce038d2c.iframe.bundle.js.map