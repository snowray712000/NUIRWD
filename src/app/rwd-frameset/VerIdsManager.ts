import { Observable, Subscriber, of, interval } from 'rxjs';
import { IOnChangedBibleVersionIds, IUpdateBibleVersionIds } from './rwd-frameset-interfaces';
import { IConvertBibleVersionEng2Id, IConvertBibleVersionId2Eng } from '../fhl-api/i-convert-bible-version';
import { ConvertBibleVersionTool } from '../fhl-api/convert-bible-version';
import { map } from 'rxjs/operators';
import { IUpdateBibleVersionEngs, IOnChangedBibleVersionEngs } from './VerIdsManager-interfaces';
import { BibleVersionsManager } from './settings/BibleVersionsManager';

export class VerIdsManager implements IUpdateBibleVersionIds, IOnChangedBibleVersionIds {
  private iUpdateVerEngs: IUpdateBibleVersionEngs;
  private onChangedVerEngs: IOnChangedBibleVersionEngs;
  private iCvtEng2id: IConvertBibleVersionEng2Id;
  private iCvtId2Eng: IConvertBibleVersionId2Eng;

  private ob: Subscriber<number[]>;
  onChangedBibleVersionIds$: Observable<number[]>;
  constructor() {
    const r1 = new BibleVersionsManager();
    this.iUpdateVerEngs = r1;
    this.onChangedVerEngs = r1;
    // this.initEngsInterfaceTestor(); // test

    this.initConvertor();
    this.impOnChangedInterface();
  }
  /** 測試用, 正式不會用到 */

  private initEngsInterfaceTestor() {
    this.iUpdateVerEngs = {
      updateBibleVersionEngs(vers) {
        console.log('update engs call');
        console.log(vers);
      }
    };
    const testVersionFn = (i: number) => {
      const r1 = ['unv', 'kjv', 'tcv95'];
      const r2 = i % r1.length;
      return [r1[r2]];
    };
    const test$ = interval(2000).pipe(map(i => testVersionFn(i)));
    this.onChangedVerEngs = {
      onChangedBibleVersionEngs$: test$
    };
  }

  private initConvertor() {
    const r1 = new ConvertBibleVersionTool();
    this.iCvtEng2id = r1;
    this.iCvtId2Eng = r1;
  }

  private impOnChangedInterface() {
    const pthis = this;
    this.onChangedBibleVersionIds$ = new Observable<Array<number>>(ob => {
      pthis.ob = ob;
    });
    this.onChangedVerEngs.onChangedBibleVersionEngs$.subscribe({
      next(engs: string[]) {
        pthis.iCvtEng2id.convertEngs2IdsAsync(engs).then(ids => pthis.ob.next(ids));
      }
    });
  }

  updateBibleVersionIds(ids: number[]) {
    this.iCvtId2Eng.convertIds2EngsAsync(ids).then(engs =>
      this.iUpdateVerEngs.updateBibleVersionEngs(engs)
    );
  }
}

