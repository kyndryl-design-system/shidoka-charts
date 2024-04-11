"use strict";(self.webpackChunk_kyndryl_design_system_shidoka_charts=self.webpackChunk_kyndryl_design_system_shidoka_charts||[]).push([[583],{"./src/common/config/chartArgTypes.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={colorPalette:{options:["categorical","sequential01","sequential02","sequential03","sequential04","sequential05","divergent01","divergent02"],control:{type:"select"}},type:{table:{disable:!0}},width:{control:{type:"number"}},height:{control:{type:"number"}},plugins:{table:{disable:!0}}}},"./src/stories/Scatter.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Scatter:()=>Scatter,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var lit__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/lit/index.js");__webpack_require__("./src/components/chart/index.ts");const __WEBPACK_DEFAULT_EXPORT__={title:"Future/Scatter",component:"kd-chart",decorators:[story=>lit__WEBPACK_IMPORTED_MODULE_0__.qy` <div style="max-width: 800px;">${story()}</div> `],parameters:{design:{type:"figma",url:""}},argTypes:__webpack_require__("./src/common/config/chartArgTypes.js").A},Scatter={args:{chartTitle:"Scatter Chart",description:"Chart description.",labels:[],datasets:[{label:"Dataset 1",data:[{x:20,y:30},{x:30,y:20},{x:40,y:10}]},{label:"Dataset 2",data:[{x:15,y:25},{x:32,y:10},{x:38,y:15}]}],options:{scales:{x:{title:{text:"X Axis"}},y:{title:{text:"Y Axis"}}}},hideDescription:!1,hideCaptions:!1,hideHeader:!1,hideControls:!1,colorPalette:"categorical",noBorder:!1,width:null,height:null},render:args=>lit__WEBPACK_IMPORTED_MODULE_0__.qy`
      <kd-chart
        type="scatter"
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
    `};Scatter.parameters={...Scatter.parameters,docs:{...Scatter.parameters?.docs,source:{originalSource:'{\n  args,\n  render: args => {\n    return html`\n      <kd-chart\n        type="scatter"\n        .chartTitle=${args.chartTitle}\n        .description=${args.description}\n        .labels=${args.labels}\n        .datasets=${args.datasets}\n        ?hideDescription=${args.hideDescription}\n        ?hideCaptions=${args.hideCaptions}\n        ?hideHeader=${args.hideHeader}\n        ?hideControls=${args.hideControls}\n        ?noBorder=${args.noBorder}\n        .options=${{\n      colorPalette: args.colorPalette,\n      ...args.options\n    }}\n        .width=${args.width}\n        .height=${args.height}\n      ></kd-chart>\n    `;\n  }\n}',...Scatter.parameters?.docs?.source}}};const __namedExportsOrder=["Scatter"]}}]);
//# sourceMappingURL=stories-Scatter-stories.bc7bc5a9.iframe.bundle.js.map