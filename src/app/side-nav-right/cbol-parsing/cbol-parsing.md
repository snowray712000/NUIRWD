# RWD

## cbol-parsing component

原文解析功能
- 原始資料
    -  qp.php
        -  input: book chap verse
        -  https://bible.fhl.net/json/qp.php?engs=Matt&chap=1&sec=1
        -  ApiQp class
- 畫面
    - 顯示一節，中文，原文。
        - 多行。一節可能有多行。
    - 下面一個表格，是每個原文的解析。
    - foreach .words 此節原文
    - foreach .exps 此節中文直譯
    - foreach .origs 此段落的原文分析
    - foreach lines
        - foreach .words .exps .origs

![](https://i.imgur.com/yLfjmgv.png)

```plantuml

```