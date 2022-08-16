# 大更新，因　angular material 主套件更新

## 源由

因為 windows 那台桌機 當機了，所以程式移到 mac。
同時，為了使原始碼小，就把node_modules砍掉了，想說這個用npm install package 就可以回來。
結果，並不預期，首先，它說我 package.json 不存在，所以無法用 npm install package。
再來，因為 mac 的 angular 環境還沒架好，即 global angluar cli 都還沒好。
結果搞了2天左右才能跑，特別記錄一下。

## 記錄

### 確認 node npm typescript angular 版本

- node -v。目前我是 14.13.1。若沒有，去網路上抓安裝檔。
- npm -v。目前我是 6.14.8。若沒有，去網路上抓 Node Js (這是一起的)。
- tsc -v。目前我是 4.0.3。若沒有，直接安裝 angular 應該就會有了。
- ng version。目前我是 10.1.5。若沒有，請安裝
  - sudo npm install -g @angular/cli

### 確認 所需套件 material linq jquery hammerjs flex-layout

- material 注意事項
  - 只用 ng add @angular/material 不足夠
  - 要再安裝 npm install --save @angular/material @angular/cdk @angular/animations
  - 參 <https://ithelp.ithome.com.tw/articles/10192517>
- linq 注意
  - npm install linq
  - linq 是 js 的函式庫，但 linq 本身就含 @types 所以不用再裝 @types/linq。
- jquery 注意
  - npm install -s jquery
  - npm install -s @types/jquery
  - 注意，若沒有安裝 @types 就會出錯，VSCODE 會給你畫紅線。
  - 注意，若沒有安裝 jquery, 只裝 @types，就是 compiler 時才會出錯。
  - 在 angular.json 中設定
    - build.options.scripts 中新增
    - "./node_modules/jquery/dist/jquery.min.js"
  - 使用時
    - import 'jquery' 即可
- jquery-ui 注意
  - 有2個超像的 jqueryui 與 jquery-ui
  - 看資料來說，應該是 jquery-ui，但 jquery-ui 又沒有 @types ， 只有 juqeryui 才有 types
  - 承上，就會安裝 jquery-ui @types/jqueryui
  - npm install -s jquery-ui
  - npm install -s @types/jqueryui
  - 在安裝路徑下，可以看到 jquery-ui/themes/base 有 images 裡面有許多資源會用到的 icon 等
  - 要手動設定 angular.json 中 architect.build 的 options 的 assets 屬性
    - 在 array 中，加入 {
                "input": "./node_modules/jquery-ui/themes/base/images/",
                "output": "/images/",
                "glob": "**/*"
              },
    - assets 這英文，我不知道它的意思，大概就是放一些 `靜態素材` 時會用到的
  - 承上，還要加入 .css ，就是在 options 的 styles 屬性
    - 在 array 中，加入 "./node_modules/jquery-ui/themes/base/all.css",
    - 你會發現，material 已經偷偷加進來了
  - 在 angular.json 中設定
    - build.options.scripts 中新增
    - "./node_modules/jquery-ui/dist/jquery-ui.min.js"
  - 使用時
    - import 'jquery-ui' 即可
- hammerjs
  - npm install --save hammerjs
- flex-layout
  - npm install -s @angular/flex-layout
  - 注意，目前專案沒用到，但曾經用。因為新版的 angular 好像相容性要另外處理。
- lit-html
  - npm install lit-html
  - 作 dialog 的時候用的 ， 用文字描述 html
- lodash
  - npm i --save lodash
  - delay
### 其它

- 從頭來作法
  - 用 ng new 開一個空專案 ng new NUIRWD，選項都用預設。
  - 用 ng add @angular/material，再安裝 material linq jquery ... 等等
  - 使用 ng serve (此時應該能正常跑起專案)
  - 將 原程式碼 src/app 中的複裝過去。
  - 使其 ng serve 無錯 (因為可能套件會升級)
  -
  - 將 index.html main.ts 也從原來的拷過來。
  - 使 ng serve 能成功
  -
  - 將全部成功的，全部覆蓋過壞的。
  - 試 壞的能 ng serve 起來嗎，能，解決。
  - 可更新至 git
- 注意 ng serve 時
  - 錯誤訊息，有時候會誤判，通常跟引用順序有關。所以 app.module.ts 若有錯，應該先處理，否則你會以為別的東西錯，但實際上是沒錯的。

# NUIRWD

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
