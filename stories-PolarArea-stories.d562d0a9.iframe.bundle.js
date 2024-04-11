"use strict";(self.webpackChunk_kyndryl_design_system_shidoka_charts=self.webpackChunk_kyndryl_design_system_shidoka_charts||[]).push([[422],{"./src/common/config/chartArgTypes.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={colorPalette:{options:["categorical","sequential01","sequential02","sequential03","sequential04","sequential05","divergent01","divergent02"],control:{type:"select"}},type:{table:{disable:!0}},width:{control:{type:"number"}},height:{control:{type:"number"}},plugins:{table:{disable:!0}}}},"./src/stories/PolarArea.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{PolarArea:()=>PolarArea,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var lit__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/lit/index.js");__webpack_require__("./src/components/chart/index.ts");const __WEBPACK_DEFAULT_EXPORT__={title:"Future/Polar Area",component:"kd-chart",decorators:[story=>lit__WEBPACK_IMPORTED_MODULE_0__.qy` <div style="max-width: 600px;">${story()}</div> `],parameters:{design:{type:"figma",url:""}},argTypes:__webpack_require__("./src/common/config/chartArgTypes.js").A},PolarArea={args:{chartTitle:"Polar Area Chart",description:"Chart description.",labels:["Blue","Red","Orange","Yellow","Green","Purple"],datasets:[{label:"Dataset 1",data:[12,19,3,5,2,3]}],options:{scales:{x:{title:{text:"Color"}},y:{title:{text:"Votes"}}}},hideDescription:!1,hideCaptions:!1,hideHeader:!1,hideControls:!1,colorPalette:"categorical",noBorder:!1,width:null,height:null},render:args=>lit__WEBPACK_IMPORTED_MODULE_0__.qy`
      <kd-chart
        type="polarArea"
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
    `};PolarArea.parameters={...PolarArea.parameters,docs:{...PolarArea.parameters?.docs,source:{originalSource:'{\n  args,\n  render: args => {\n    return html`\n      <kd-chart\n        type="polarArea"\n        .chartTitle=${args.chartTitle}\n        .description=${args.description}\n        .labels=${args.labels}\n        .datasets=${args.datasets}\n        ?hideDescription=${args.hideDescription}\n        ?hideCaptions=${args.hideCaptions}\n        ?hideHeader=${args.hideHeader}\n        ?hideControls=${args.hideControls}\n        ?noBorder=${args.noBorder}\n        .options=${{\n      colorPalette: args.colorPalette,\n      ...args.options\n    }}\n        .width=${args.width}\n        .height=${args.height}\n      ></kd-chart>\n    `;\n  }\n}',...PolarArea.parameters?.docs?.source}}};const __namedExportsOrder=["PolarArea"]}}]);
//# sourceMappingURL=stories-PolarArea-stories.d562d0a9.iframe.bundle.js.map