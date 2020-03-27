import { ShowBase } from './ShowBase';

export class ShowBibleVersion extends ShowBase {
  public versionBible: string; // 和合本

  constructor(versionBible: string) {
    super();
    this.versionBible = versionBible;
  }

  toString(): string {
    return `(${this.versionBible})`; // (和合本)
  }
}
