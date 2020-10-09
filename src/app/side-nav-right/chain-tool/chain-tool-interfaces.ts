import { DAddress } from 'src/app/bible-address/DAddress';

export interface IChainToolDataGetter {
  mainAsync(address: DAddress): Promise<DChainToolDataResult>;
}


export interface DChainToolDataResult {
  next?: DAddress;
  prev?: DAddress;
  title?: string;
  data: {
    w: string;
    des?: string;
  }[][];
}
