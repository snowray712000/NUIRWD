import { DAddress } from 'src/app/bible-address/DAddress';

export interface IChainToolDataGetter {
  mainAsync(address: DAddress): Promise<{ w: string, des?: string }[][]>;
}
