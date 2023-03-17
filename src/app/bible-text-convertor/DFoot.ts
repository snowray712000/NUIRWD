// rt.php?engs=Gen&chap=4&version=cnet&id=182 真的缺一參數不可,試過只有id不行
// 和合本 2010 版, 是只有 text ([4.1]「該隱」意思是「得」。)
// csb: 中文標準譯本 cnet: NET聖經中譯本

export interface DFoot {
  text?: string;
  book?: number;
  chap?: number;
  verse?: number;
  version?: string;
  id?: number;
}
