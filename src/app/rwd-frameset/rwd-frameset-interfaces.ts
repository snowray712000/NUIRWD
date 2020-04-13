import { Observable } from 'rxjs';

export interface IOnChangedBibleVersionIds {
  onChangedBibleVersionIds$: Observable<Array<number>>;
}
export interface IUpdateBibleVersionIds {
  updateBibleVersionIds(ids: Array<number>);
}
