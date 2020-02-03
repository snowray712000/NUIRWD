import { ShowBase } from './ShowBase';

export class ShowMap extends ShowBase {
  public idMap: number;
  public isGB: boolean;
  constructor(idMap: number, isGB: boolean = false) {
    super();
    this.idMap = idMap;
    this.isGB = isGB;
  }

  toString(): string {
    return '';
  }
}
