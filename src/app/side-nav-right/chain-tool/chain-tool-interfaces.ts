export interface IChainToolDataGetter {
  mainAsync(address: { book: number; chap: number; sec: number; }): Promise<{ w: string, des?: string }[][]>;
}
