import * as LQ from 'linq';
let r1 = [        
    { big5: "全部", gb: "全部" },
    { big5: "舊約", gb: "旧约" },
    { big5: "新約", gb: "新约" },
    { big5: "摩西五經", gb: "摩西五经" },
    { big5: "歷史書", gb: "历史书" },
    { big5: "詩歌智慧書", gb: "诗歌智慧书" },
    { big5: "大先知書", gb: "大先知书" },
    { big5: "小先知書", gb: "小先知书" },
    { big5: "福音書", gb: "福音书" },
    { big5: "保羅書信", gb: "保罗书信" },
    { big5: "其它書信", gb: "其它书信" },
    { big5: "異常", gb: "异常" },
    { big5: "舊約", gb: "旧约" },
    { big5: "新約", gb: "新约" },
    // { big5:"上章", gb:"上章" },
    // { big5:"下章", gb:"下章" },
    { big5: "設定", gb: "设定" },
    { big5: "譯本", gb: "译本" },
    // { big5:"串珠", gb:"串珠" },
    // { big5:"分析", gb:"分析" },
    { big5: "註釋", gb: "注释" },
    // { big5:"章", gb:"章" },
    { big5: "希伯來排序", gb: "希伯来排序" },
    { big5: "完整名稱", gb: "完整名称" },
    { big5: "歷史記錄", gb: "历史记录" },
    { big5: "前1節", gb: "前1节" },
    { big5: "後1節", gb: "後1节" },
    { big5: "資料查詢中", gb: "资料查询中" },
    { big5: "查無資料", gb: "查无资料" },
    { big5: "前", gb: "前" },
    { big5: "簡義", gb: "简义" },
    // { big5:"原型", gb:"原型" }, 
    // { big5:"分析", gb:"分析" }, 
    { big5: "備註", gb: "备注" },
    { big5: "分類", gb: "分类" },
    { big5: "書卷", gb: "书卷" },
    { big5: "關鍵字上色", gb: "关键字上色" },
    { big5: "切換網址", gb: "切换网址" },
    { big5: "彙編", gb: "汇编" },
    { big5: "查詢中", gb: "查询中" },
    { big5: "詳細清單", gb: "详细清单" },
    { big5: "聖經目錄", gb: "圣经目录" },
    

];
export function getBig5Text(str: string) {
    let r2 = LQ.from(r1).firstOrDefault(a1 => a1.gb === str);
    if (r2 !== undefined) return r2.big5;
    return str;
}
// if isGB return GBText or str.
export function getGbText(str: string) {
    if (DisplayLangSetting.s.getValueIsGB() === false) {
        return str;
    }

    let r2 = LQ.from(r1).firstOrDefault(a1 => a1.big5 === str);
    if (r2 !== undefined) return r2.gb;
    return str;
}
import { Pipe, PipeTransform } from '@angular/core';
import { DisplayLangSetting } from '../rwd-frameset/dialog-display-setting/DisplayLangSetting';

@Pipe({ name: 'gbpipe' })
export class GbPipe implements PipeTransform {
    transform(value: string, args: string[]): any {
        if (!value) return value;

        return getGbText(value);
    }
}