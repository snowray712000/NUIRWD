// 蠻多人用的, 就抽出來
export interface IConvertBibleVersionEng2Id {
  convertEng2IdAsync(eng: string): Promise<number>;
  convertEngs2IdsAsync(eng: string[]): Promise<number[]>;
}
export interface IConvertBibleVersionId2Eng {
  convertId2EngAsync(id: number): Promise<string>;
  convertIds2EngsAsync(id: number[]): Promise<string[]>;
}
