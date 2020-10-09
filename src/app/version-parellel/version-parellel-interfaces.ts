import { Observable } from 'rxjs';

export interface IOnChangedSettingIsSn {
  onChangedIsSn$: Observable<{ value: boolean }>;
}
