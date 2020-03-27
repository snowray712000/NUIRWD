import { ShowBase } from './ShowBase';

export class ShowPhoto extends ShowBase {
  public idPhoto: number;
  public isGB: boolean;
  constructor(idPhoto: number, isGB: boolean = false) {
    super();
    this.idPhoto = idPhoto;
    this.isGB = isGB;
  }

  toString(): string {
    return '';
  }
}
