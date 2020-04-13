import { Observable } from 'rxjs';

export interface IUpdateBibleVersionEngs {
  updateBibleVersionEngs(vers: string[]);
}
export interface IOnChangedBibleVersionEngs {
  onChangedBibleVersionEngs$: Observable<string[]>;
}
