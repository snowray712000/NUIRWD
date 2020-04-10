import { IConvertBibleVersionEng2Id, IConvertBibleVersionId2Eng } from './i-convert-bible-version';
import { IBibleVersionQueryService } from './IBibleVersionQueryService';
import { BibleVersionQueryService } from './bible-version-query.service';

/** 有 static cache 優化速度 */
export class ConvertBibleVersionTool implements IConvertBibleVersionEng2Id, IConvertBibleVersionId2Eng {
  constructor() {
    this.verQ = new BibleVersionQueryService();
  }
  private static id2eng: Map<number, string> = undefined;
  private static eng2id: Map<string, number> = undefined;
  private verQ: IBibleVersionQueryService;
  private get id2eng() {
    return ConvertBibleVersionTool.id2eng;
  }
  private get eng2id() {
    return ConvertBibleVersionTool.eng2id;
  }
  async convertEng2IdAsync(eng: string): Promise<number> {
    if (this.isInitNotYet()) {
      await this.generateMap();
    }
    if (!this.eng2id.has(eng)) {
      return undefined;
    }
    return this.eng2id.get(eng);
  }
  async convertId2EngAsync(id: number): Promise<string> {
    if (this.isInitNotYet()) {
      await this.generateMap();
    }
    if (!this.id2eng.has(id)) {
      return undefined;
    }
    return this.id2eng.get(id);
  }
  private isInitNotYet() {
    if (this.id2eng === undefined) {
      return true;
    }
    return false;
  }
  private async generateMap() {
    const re1 = new Map<number, string>();
    const re2 = new Map<string, number>();
    const r1 = await this.verQ.queryBibleVersionsAsync().toPromise();
    for (const it of r1) {
      re1.set(it.id, it.na);
      re2.set(it.na, it.id);
    }
    ConvertBibleVersionTool.id2eng = re1;
    ConvertBibleVersionTool.eng2id = re2;
  }


}
