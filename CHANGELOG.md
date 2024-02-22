## [1.1.6](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.1.5...v1.1.6) (2024-02-22)


### Bug Fixes

* **chart:** resolve issue where chart may not initialize ([8badc43](https://github.com/kyndryl-design-system/shidoka-charts/commit/8badc43f0e2fdddfb5d2e12689876d5fa78a1466))

## [1.1.5](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.1.4...v1.1.5) (2024-02-01)


### Bug Fixes

* update table styles, resolves [#10](https://github.com/kyndryl-design-system/shidoka-charts/issues/10) ([4912bdc](https://github.com/kyndryl-design-system/shidoka-charts/commit/4912bdceb19416d5eb17cb85a6d55da0f1612212))

## [1.1.4](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.1.3...v1.1.4) (2024-01-02)


### Reverts

* Revert "fix: don't bundle peer deps" ([2fb05b8](https://github.com/kyndryl-design-system/shidoka-charts/commit/2fb05b83d83f86cb11814d85a5a1a4c16d9e9c3f))

## [1.1.3](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.1.2...v1.1.3) (2024-01-02)


### Bug Fixes

* don't bundle peer deps ([ff7bea2](https://github.com/kyndryl-design-system/shidoka-charts/commit/ff7bea2c2602ca71e20d7fa78320915e897c580e))

## [1.1.2](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.1.1...v1.1.2) (2023-12-11)


### Bug Fixes

* geo and treemap adjustments ([#8](https://github.com/kyndryl-design-system/shidoka-charts/issues/8)) ([d859ebe](https://github.com/kyndryl-design-system/shidoka-charts/commit/d859ebe5fa6699623db05b22f46a992696785cd8))

## [1.1.1](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.1.0...v1.1.1) (2023-12-08)


### Bug Fixes

* add a default date adapter so time scales work ([78bea45](https://github.com/kyndryl-design-system/shidoka-charts/commit/78bea45b4c9d24319b8543c69a58ae624b758127))

# [1.1.0](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.0.0...v1.1.0) (2023-11-30)


### Bug Fixes

* added categorical as default palettes for treemap and choropleth as well as discussed with UX ([e91eb11](https://github.com/kyndryl-design-system/shidoka-charts/commit/e91eb11b170801ccbef671b44c93454d7421a034))
* change sequential01 for geo maps and divergent01 for treemap after discussed with Robert ([821a0fb](https://github.com/kyndryl-design-system/shidoka-charts/commit/821a0fbc6e5591570fffe30ff2d45e13dbba91a1))
* Remove old palettes from chartArgTypes ([bf1735f](https://github.com/kyndryl-design-system/shidoka-charts/commit/bf1735f7695c6fb69b94b67ce2b2cd49849ec01e))
* update color palette names ([3a640e4](https://github.com/kyndryl-design-system/shidoka-charts/commit/3a640e4a17c9a2654a86bbaad6701573f359220d))


### Features

*  Added palette and non palette colors for light theme only ([1083c8d](https://github.com/kyndryl-design-system/shidoka-charts/commit/1083c8d21d0f422adaa639eb92652f3fbc21c8cf))
* add neutral color for divergent palette ([6b7790f](https://github.com/kyndryl-design-system/shidoka-charts/commit/6b7790f9899d48f1fe3f67e42d4aeb9cf2daddaa))
* Added new color palettes for data viz ([24d943c](https://github.com/kyndryl-design-system/shidoka-charts/commit/24d943c15f13b3a4053aef1d8f05f449f926c259))
* change default color palette for each charts ([fb748f4](https://github.com/kyndryl-design-system/shidoka-charts/commit/fb748f4757a526a9e01b3795b8de1c9b835b08d5))

# 1.0.0 (2023-11-13)


### Bug Fixes

* add disconnected callback ([7530325](https://github.com/kyndryl-design-system/shidoka-charts/commit/753032570cb5dde4ad3875e2d2716b9cd91ed4b2))
* added datalables to bubble map default configs ([aebff61](https://github.com/kyndryl-design-system/shidoka-charts/commit/aebff614881ab2e260a9a581de50bed9c7094526))
* axis labels on radial charts ([9cf7216](https://github.com/kyndryl-design-system/shidoka-charts/commit/9cf7216bcb30c884c205236340a10a3d2743487b))
* **bar:** border radius ([30788a9](https://github.com/kyndryl-design-system/shidoka-charts/commit/30788a915c4f0fcdec727a4ac219aea9d32faa90))
* build ([e849149](https://github.com/kyndryl-design-system/shidoka-charts/commit/e8491493a18a0b1901f07d23236d6b0180362b13))
* canvas bg color ([d3657ab](https://github.com/kyndryl-design-system/shidoka-charts/commit/d3657ab9423f5ca73a0f4f0a48de047ab056da06))
* canvas max height ([8c32aa3](https://github.com/kyndryl-design-system/shidoka-charts/commit/8c32aa3c11a988c9cb4321b4e853f9ce6576634c))
* canvas max height non-fullscreen ([612718d](https://github.com/kyndryl-design-system/shidoka-charts/commit/612718d8d2c96860caef9773767d6a987ac78465))
* category name for geo and treemap charts ([ab15cfb](https://github.com/kyndryl-design-system/shidoka-charts/commit/ab15cfbd3fc9e03c8b42a0b851955fad233340fe))
* chart responsive resizing ([a9aea92](https://github.com/kyndryl-design-system/shidoka-charts/commit/a9aea929eaee19d9b566f63b71abcc93b1a565de))
* check for datasets before merging options ([cb9e838](https://github.com/kyndryl-design-system/shidoka-charts/commit/cb9e838d73d9e2f6781d853263a38ff48e5a4cf0))
* clean up control buttons ([09634fc](https://github.com/kyndryl-design-system/shidoka-charts/commit/09634fcd715d9bbedaaf9efb2d11baa66e5192c6))
* color palette repeating ([f87df44](https://github.com/kyndryl-design-system/shidoka-charts/commit/f87df44ce266fa458b930188eeca9f6346a13e24))
* **color:** update crystalcavern palette ([5c53eb6](https://github.com/kyndryl-design-system/shidoka-charts/commit/5c53eb68095b273504b72a8be4799b8777cc8750))
* conflicts ([296c89a](https://github.com/kyndryl-design-system/shidoka-charts/commit/296c89a7ef1460acb6c0b31d2698f34dc6c2aeef))
* datalable and world choropleth changes according to review ([8760eb7](https://github.com/kyndryl-design-system/shidoka-charts/commit/8760eb7acd8e6e47306aba7f98003c1795b8371a))
* disable custom legend hover effect ([eb99d64](https://github.com/kyndryl-design-system/shidoka-charts/commit/eb99d64eff88d49d5c4901549c8bdf7d330ec8d4))
* disable music plugin for non--standard charts ([c1b843c](https://github.com/kyndryl-design-system/shidoka-charts/commit/c1b843cbb3052abc94c1b87ce07c93fab13a7029))
* doughnut cleanup ([91faa3a](https://github.com/kyndryl-design-system/shidoka-charts/commit/91faa3aa4f588e20990d86d40f654817848983e2))
* fallback colors ([81171e5](https://github.com/kyndryl-design-system/shidoka-charts/commit/81171e56754f87400d6c9d88394d9fe226f45d54))
* floating combo grid ([f0eee99](https://github.com/kyndryl-design-system/shidoka-charts/commit/f0eee99874eceb671abd4a1bf71a9c84cbef9231))
* geo axes ([a6daf18](https://github.com/kyndryl-design-system/shidoka-charts/commit/a6daf18b73dacf5b52274c258df565b6496a0310))
* geo interpolation color count ([47899d9](https://github.com/kyndryl-design-system/shidoka-charts/commit/47899d93a4c2c42a1a09bf7ff474a88b91a89468))
* init and resize errors ([d4d4141](https://github.com/kyndryl-design-system/shidoka-charts/commit/d4d41419329caa51926b34333a520a049c3b34fb))
* init chart on async load ([5638df1](https://github.com/kyndryl-design-system/shidoka-charts/commit/5638df152a3eea86bfcca1c134f9d357e2d54677))
* initial global configs ([4f68a6a](https://github.com/kyndryl-design-system/shidoka-charts/commit/4f68a6ae1a57e15bae177766fc57ec0cb0e407d7))
* legend colors ([45f507c](https://github.com/kyndryl-design-system/shidoka-charts/commit/45f507cdbc9d0a86fd085aadefe01022de99dee1))
* line point styles ([a9ccc3f](https://github.com/kyndryl-design-system/shidoka-charts/commit/a9ccc3f777b0f26fbaf08099749c3523dd0f8304))
* **line:** begin at zero ([870c447](https://github.com/kyndryl-design-system/shidoka-charts/commit/870c4478440758170005dcf31251ed6b705bc74d))
* make hard-coded strings configurable ([fbf9568](https://github.com/kyndryl-design-system/shidoka-charts/commit/fbf95689ab60607ee9cb7934709ce13a409d91c1))
* max height, prevent fullscreen overflow ([14177e1](https://github.com/kyndryl-design-system/shidoka-charts/commit/14177e1930ca52ff21582c43bd09a02e6d984eef))
* mergeoptions error ([5b5e5c1](https://github.com/kyndryl-design-system/shidoka-charts/commit/5b5e5c13dd1686ee0eb8f595dce8d5a953e69e36))
* modified package-lock.json ([5ea351f](https://github.com/kyndryl-design-system/shidoka-charts/commit/5ea351ff828b1dd0031713e5343f9fd93541f6f2))
* move destroy ([4dd5f01](https://github.com/kyndryl-design-system/shidoka-charts/commit/4dd5f01b0fc9c22375beb0bb53fae4c77ec7c612))
* move foundation to peerdeps ([2943a6a](https://github.com/kyndryl-design-system/shidoka-charts/commit/2943a6ad4ea1e70e9f18f6ea4bdeba6385f9410e))
* multiaxis considerations ([8a7b440](https://github.com/kyndryl-design-system/shidoka-charts/commit/8a7b4408393724cdcb44ddb9d75776120ce33dcf))
* null datasets ([15433a6](https://github.com/kyndryl-design-system/shidoka-charts/commit/15433a658b87a9d920e0a2a707cf0ebf9a6724fb))
* plugin merging ([18d6c22](https://github.com/kyndryl-design-system/shidoka-charts/commit/18d6c227b32ea2749ddac426881b079e5fa66b99))
* radial legend color boxes ([e4c0498](https://github.com/kyndryl-design-system/shidoka-charts/commit/e4c04989e1210616c01fb8be5fa2ff3904a0277d))
* Remove default options from world charts ([a11c72a](https://github.com/kyndryl-design-system/shidoka-charts/commit/a11c72a08e82152bab61115a884b59944b6891f1))
* removed commented code from stories and add relevant options into choropleth.js ([e8b305e](https://github.com/kyndryl-design-system/shidoka-charts/commit/e8b305e41ebfecfa7e2eaa258c0465f9b49e18ff))
* Removed zoom plugin ([7826f36](https://github.com/kyndryl-design-system/shidoka-charts/commit/7826f3613fc124c9886d447c79c5faecd0eeba5f))
* rename to shidoka-charts ([e56e0a3](https://github.com/kyndryl-design-system/shidoka-charts/commit/e56e0a32ccc37a6fde8f5f09be1b004e75b8bb92))
* **scatter:** match point size with line charts ([ae0a000](https://github.com/kyndryl-design-system/shidoka-charts/commit/ae0a0002f9e9a124354e0969076b69e44bcc984e))
* stacked bar 2px gap ([837531d](https://github.com/kyndryl-design-system/shidoka-charts/commit/837531d5ca12392622d7fc9e7c434962ab2aefd2))
* third party type tooltip colors ([39ecce4](https://github.com/kyndryl-design-system/shidoka-charts/commit/39ecce4479094d65aa85c43defa706b583abf7dc))
* tighter dataset options merge logic ([d49b484](https://github.com/kyndryl-design-system/shidoka-charts/commit/d49b4841662c1d73600c7ee93cad27000dfa093a))
* tooltip box colors ([31072c5](https://github.com/kyndryl-design-system/shidoka-charts/commit/31072c58563e24cf007a979dbb1ac47905863ae3))
* tooltip label margin ([37adf53](https://github.com/kyndryl-design-system/shidoka-charts/commit/37adf536083912edb30f369f8d7d5d46270c10a0))
* tooltip title and total for horizontal ([04b90c6](https://github.com/kyndryl-design-system/shidoka-charts/commit/04b90c67ffd10589144db0c8f786ddb9cc14fa08))
* tooltip total stacked only ([8372700](https://github.com/kyndryl-design-system/shidoka-charts/commit/837270063542b286954e223efe175d4566e1021b))
* transparency cases ([f99e6db](https://github.com/kyndryl-design-system/shidoka-charts/commit/f99e6dbb97fe2967afdbcf89d0af7b5525407835))
* update bar/line grid display ([4abd2e3](https://github.com/kyndryl-design-system/shidoka-charts/commit/4abd2e3feb8563b6452eec94d43c45774fad07f1))
* update foundation ([5f0d65b](https://github.com/kyndryl-design-system/shidoka-charts/commit/5f0d65b9080c92b3abb1af8312b8bed6a96a08aa))


### Features

* add all color palettes ([4db61e6](https://github.com/kyndryl-design-system/shidoka-charts/commit/4db61e6f8896c4882457bf6c963cedcbf0d40253))
* add explicit size options to chart ([50ac4d7](https://github.com/kyndryl-design-system/shidoka-charts/commit/50ac4d72cc518d67a5dc7d0dd999ca4cf0f0dcf6))
* added dataLabel to geo charts as pe UX suggestions ([e156c75](https://github.com/kyndryl-design-system/shidoka-charts/commit/e156c75078d8e3cad1a9398128e1939a686cb424))
* Added hoverborderWidth to geo related config files ([09ffca2](https://github.com/kyndryl-design-system/shidoka-charts/commit/09ffca2c62bd7da4093381cce5da62157df23738))
* added outline related options to choropleth.js ([d347075](https://github.com/kyndryl-design-system/shidoka-charts/commit/d34707540d87377b25de6d75ae337b161d9fc405))
* Added suggested UX changes like border width, world choropleth etc. ([8bb4f19](https://github.com/kyndryl-design-system/shidoka-charts/commit/8bb4f192b389e653b60903b7132d2b0a3cdd3731))
* added zoom plugin for future use ([5c09056](https://github.com/kyndryl-design-system/shidoka-charts/commit/5c090569efccc555aa01e2e1548e594e93a0fd1e))
* line area gradient ([9259c91](https://github.com/kyndryl-design-system/shidoka-charts/commit/9259c9110fb93655805506e6462577bcea14112b))
* method to specify color palette in options ([f7e8965](https://github.com/kyndryl-design-system/shidoka-charts/commit/f7e8965b2ae51b0e32b8815a72d3d39cc6eb40e6))
* noBorder prop and grid height examples ([3627f74](https://github.com/kyndryl-design-system/shidoka-charts/commit/3627f741da3a12eb50abe6c8b5989cab589110f0))
* pie and doughnut styles and plugins ([24363b3](https://github.com/kyndryl-design-system/shidoka-charts/commit/24363b3fc4a5189f1b1060f73924e0d5fb683da2))
* tooltip initial styles ([b63ce8e](https://github.com/kyndryl-design-system/shidoka-charts/commit/b63ce8ea6a82b822439fb9ec6fae5486c2f6da42))

# [1.0.0-beta.15](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.0.0-beta.14...v1.0.0-beta.15) (2023-11-06)


### Bug Fixes

* added datalables to bubble map default configs ([aebff61](https://github.com/kyndryl-design-system/shidoka-charts/commit/aebff614881ab2e260a9a581de50bed9c7094526))
* category name for geo and treemap charts ([ab15cfb](https://github.com/kyndryl-design-system/shidoka-charts/commit/ab15cfbd3fc9e03c8b42a0b851955fad233340fe))
* conflicts ([296c89a](https://github.com/kyndryl-design-system/shidoka-charts/commit/296c89a7ef1460acb6c0b31d2698f34dc6c2aeef))
* datalable and world choropleth changes according to review ([8760eb7](https://github.com/kyndryl-design-system/shidoka-charts/commit/8760eb7acd8e6e47306aba7f98003c1795b8371a))
* disable music plugin for non--standard charts ([c1b843c](https://github.com/kyndryl-design-system/shidoka-charts/commit/c1b843cbb3052abc94c1b87ce07c93fab13a7029))
* modified package-lock.json ([5ea351f](https://github.com/kyndryl-design-system/shidoka-charts/commit/5ea351ff828b1dd0031713e5343f9fd93541f6f2))
* Remove default options from world charts ([a11c72a](https://github.com/kyndryl-design-system/shidoka-charts/commit/a11c72a08e82152bab61115a884b59944b6891f1))
* removed commented code from stories and add relevant options into choropleth.js ([e8b305e](https://github.com/kyndryl-design-system/shidoka-charts/commit/e8b305e41ebfecfa7e2eaa258c0465f9b49e18ff))
* Removed zoom plugin ([7826f36](https://github.com/kyndryl-design-system/shidoka-charts/commit/7826f3613fc124c9886d447c79c5faecd0eeba5f))


### Features

* added dataLabel to geo charts as pe UX suggestions ([e156c75](https://github.com/kyndryl-design-system/shidoka-charts/commit/e156c75078d8e3cad1a9398128e1939a686cb424))
* Added hoverborderWidth to geo related config files ([09ffca2](https://github.com/kyndryl-design-system/shidoka-charts/commit/09ffca2c62bd7da4093381cce5da62157df23738))
* added outline related options to choropleth.js ([d347075](https://github.com/kyndryl-design-system/shidoka-charts/commit/d34707540d87377b25de6d75ae337b161d9fc405))
* Added suggested UX changes like border width, world choropleth etc. ([8bb4f19](https://github.com/kyndryl-design-system/shidoka-charts/commit/8bb4f192b389e653b60903b7132d2b0a3cdd3731))
* added zoom plugin for future use ([5c09056](https://github.com/kyndryl-design-system/shidoka-charts/commit/5c090569efccc555aa01e2e1548e594e93a0fd1e))

# [1.0.0-beta.14](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.0.0-beta.13...v1.0.0-beta.14) (2023-10-26)


### Bug Fixes

* move destroy ([4dd5f01](https://github.com/kyndryl-design-system/shidoka-charts/commit/4dd5f01b0fc9c22375beb0bb53fae4c77ec7c612))

# [1.0.0-beta.13](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.0.0-beta.12...v1.0.0-beta.13) (2023-10-26)


### Bug Fixes

* fallback colors ([81171e5](https://github.com/kyndryl-design-system/shidoka-charts/commit/81171e56754f87400d6c9d88394d9fe226f45d54))

# [1.0.0-beta.12](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.0.0-beta.11...v1.0.0-beta.12) (2023-10-26)


### Bug Fixes

* plugin merging ([18d6c22](https://github.com/kyndryl-design-system/shidoka-charts/commit/18d6c227b32ea2749ddac426881b079e5fa66b99))

# [1.0.0-beta.11](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.0.0-beta.10...v1.0.0-beta.11) (2023-10-25)


### Bug Fixes

* move foundation to peerdeps ([2943a6a](https://github.com/kyndryl-design-system/shidoka-charts/commit/2943a6ad4ea1e70e9f18f6ea4bdeba6385f9410e))

# [1.0.0-beta.10](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2023-10-24)


### Bug Fixes

* init chart on async load ([5638df1](https://github.com/kyndryl-design-system/shidoka-charts/commit/5638df152a3eea86bfcca1c134f9d357e2d54677))

# [1.0.0-beta.9](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2023-10-24)


### Bug Fixes

* null datasets ([15433a6](https://github.com/kyndryl-design-system/shidoka-charts/commit/15433a658b87a9d920e0a2a707cf0ebf9a6724fb))

# [1.0.0-beta.8](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2023-10-24)


### Bug Fixes

* mergeoptions error ([5b5e5c1](https://github.com/kyndryl-design-system/shidoka-charts/commit/5b5e5c13dd1686ee0eb8f595dce8d5a953e69e36))

# [1.0.0-beta.7](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2023-10-24)


### Bug Fixes

* check for datasets before merging options ([cb9e838](https://github.com/kyndryl-design-system/shidoka-charts/commit/cb9e838d73d9e2f6781d853263a38ff48e5a4cf0))

# [1.0.0-beta.6](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2023-10-24)


### Bug Fixes

* init and resize errors ([d4d4141](https://github.com/kyndryl-design-system/shidoka-charts/commit/d4d41419329caa51926b34333a520a049c3b34fb))

# [1.0.0-beta.5](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2023-10-20)


### Bug Fixes

* update foundation ([5f0d65b](https://github.com/kyndryl-design-system/shidoka-charts/commit/5f0d65b9080c92b3abb1af8312b8bed6a96a08aa))

# [1.0.0-beta.4](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2023-10-12)


### Bug Fixes

* **scatter:** match point size with line charts ([ae0a000](https://github.com/kyndryl-design-system/shidoka-charts/commit/ae0a0002f9e9a124354e0969076b69e44bcc984e))

# [1.0.0-beta.3](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2023-10-04)


### Bug Fixes

* **color:** update crystalcavern palette ([5c53eb6](https://github.com/kyndryl-design-system/shidoka-charts/commit/5c53eb68095b273504b72a8be4799b8777cc8750))

# [1.0.0-beta.2](https://github.com/kyndryl-design-system/shidoka-charts/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2023-09-29)


### Bug Fixes

* add disconnected callback ([7530325](https://github.com/kyndryl-design-system/shidoka-charts/commit/753032570cb5dde4ad3875e2d2716b9cd91ed4b2))
* axis labels on radial charts ([9cf7216](https://github.com/kyndryl-design-system/shidoka-charts/commit/9cf7216bcb30c884c205236340a10a3d2743487b))
* **bar:** border radius ([30788a9](https://github.com/kyndryl-design-system/shidoka-charts/commit/30788a915c4f0fcdec727a4ac219aea9d32faa90))
* build ([e849149](https://github.com/kyndryl-design-system/shidoka-charts/commit/e8491493a18a0b1901f07d23236d6b0180362b13))
* canvas bg color ([d3657ab](https://github.com/kyndryl-design-system/shidoka-charts/commit/d3657ab9423f5ca73a0f4f0a48de047ab056da06))
* canvas max height ([8c32aa3](https://github.com/kyndryl-design-system/shidoka-charts/commit/8c32aa3c11a988c9cb4321b4e853f9ce6576634c))
* canvas max height non-fullscreen ([612718d](https://github.com/kyndryl-design-system/shidoka-charts/commit/612718d8d2c96860caef9773767d6a987ac78465))
* chart responsive resizing ([a9aea92](https://github.com/kyndryl-design-system/shidoka-charts/commit/a9aea929eaee19d9b566f63b71abcc93b1a565de))
* clean up control buttons ([09634fc](https://github.com/kyndryl-design-system/shidoka-charts/commit/09634fcd715d9bbedaaf9efb2d11baa66e5192c6))
* color palette repeating ([f87df44](https://github.com/kyndryl-design-system/shidoka-charts/commit/f87df44ce266fa458b930188eeca9f6346a13e24))
* disable custom legend hover effect ([eb99d64](https://github.com/kyndryl-design-system/shidoka-charts/commit/eb99d64eff88d49d5c4901549c8bdf7d330ec8d4))
* doughnut cleanup ([91faa3a](https://github.com/kyndryl-design-system/shidoka-charts/commit/91faa3aa4f588e20990d86d40f654817848983e2))
* floating combo grid ([f0eee99](https://github.com/kyndryl-design-system/shidoka-charts/commit/f0eee99874eceb671abd4a1bf71a9c84cbef9231))
* geo axes ([a6daf18](https://github.com/kyndryl-design-system/shidoka-charts/commit/a6daf18b73dacf5b52274c258df565b6496a0310))
* geo interpolation color count ([47899d9](https://github.com/kyndryl-design-system/shidoka-charts/commit/47899d93a4c2c42a1a09bf7ff474a88b91a89468))
* initial global configs ([4f68a6a](https://github.com/kyndryl-design-system/shidoka-charts/commit/4f68a6ae1a57e15bae177766fc57ec0cb0e407d7))
* legend colors ([45f507c](https://github.com/kyndryl-design-system/shidoka-charts/commit/45f507cdbc9d0a86fd085aadefe01022de99dee1))
* line point styles ([a9ccc3f](https://github.com/kyndryl-design-system/shidoka-charts/commit/a9ccc3f777b0f26fbaf08099749c3523dd0f8304))
* **line:** begin at zero ([870c447](https://github.com/kyndryl-design-system/shidoka-charts/commit/870c4478440758170005dcf31251ed6b705bc74d))
* make hard-coded strings configurable ([fbf9568](https://github.com/kyndryl-design-system/shidoka-charts/commit/fbf95689ab60607ee9cb7934709ce13a409d91c1))
* max height, prevent fullscreen overflow ([14177e1](https://github.com/kyndryl-design-system/shidoka-charts/commit/14177e1930ca52ff21582c43bd09a02e6d984eef))
* multiaxis considerations ([8a7b440](https://github.com/kyndryl-design-system/shidoka-charts/commit/8a7b4408393724cdcb44ddb9d75776120ce33dcf))
* radial legend color boxes ([e4c0498](https://github.com/kyndryl-design-system/shidoka-charts/commit/e4c04989e1210616c01fb8be5fa2ff3904a0277d))
* stacked bar 2px gap ([837531d](https://github.com/kyndryl-design-system/shidoka-charts/commit/837531d5ca12392622d7fc9e7c434962ab2aefd2))
* third party type tooltip colors ([39ecce4](https://github.com/kyndryl-design-system/shidoka-charts/commit/39ecce4479094d65aa85c43defa706b583abf7dc))
* tighter dataset options merge logic ([d49b484](https://github.com/kyndryl-design-system/shidoka-charts/commit/d49b4841662c1d73600c7ee93cad27000dfa093a))
* tooltip box colors ([31072c5](https://github.com/kyndryl-design-system/shidoka-charts/commit/31072c58563e24cf007a979dbb1ac47905863ae3))
* tooltip label margin ([37adf53](https://github.com/kyndryl-design-system/shidoka-charts/commit/37adf536083912edb30f369f8d7d5d46270c10a0))
* tooltip title and total for horizontal ([04b90c6](https://github.com/kyndryl-design-system/shidoka-charts/commit/04b90c67ffd10589144db0c8f786ddb9cc14fa08))
* tooltip total stacked only ([8372700](https://github.com/kyndryl-design-system/shidoka-charts/commit/837270063542b286954e223efe175d4566e1021b))
* transparency cases ([f99e6db](https://github.com/kyndryl-design-system/shidoka-charts/commit/f99e6dbb97fe2967afdbcf89d0af7b5525407835))
* update bar/line grid display ([4abd2e3](https://github.com/kyndryl-design-system/shidoka-charts/commit/4abd2e3feb8563b6452eec94d43c45774fad07f1))


### Features

* add all color palettes ([4db61e6](https://github.com/kyndryl-design-system/shidoka-charts/commit/4db61e6f8896c4882457bf6c963cedcbf0d40253))
* add explicit size options to chart ([50ac4d7](https://github.com/kyndryl-design-system/shidoka-charts/commit/50ac4d72cc518d67a5dc7d0dd999ca4cf0f0dcf6))
* line area gradient ([9259c91](https://github.com/kyndryl-design-system/shidoka-charts/commit/9259c9110fb93655805506e6462577bcea14112b))
* method to specify color palette in options ([f7e8965](https://github.com/kyndryl-design-system/shidoka-charts/commit/f7e8965b2ae51b0e32b8815a72d3d39cc6eb40e6))
* noBorder prop and grid height examples ([3627f74](https://github.com/kyndryl-design-system/shidoka-charts/commit/3627f741da3a12eb50abe6c8b5989cab589110f0))
* pie and doughnut styles and plugins ([24363b3](https://github.com/kyndryl-design-system/shidoka-charts/commit/24363b3fc4a5189f1b1060f73924e0d5fb683da2))
* tooltip initial styles ([b63ce8e](https://github.com/kyndryl-design-system/shidoka-charts/commit/b63ce8ea6a82b822439fb9ec6fae5486c2f6da42))

# 1.0.0-beta.1 (2023-09-18)


### Bug Fixes

* rename to shidoka-charts ([e56e0a3](https://github.com/kyndryl-design-system/shidoka-charts/commit/e56e0a32ccc37a6fde8f5f09be1b004e75b8bb92))
