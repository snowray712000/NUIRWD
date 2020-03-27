import { Observable } from 'rxjs';
import { QsbArgs, QsbResult } from './qsb';
export interface IApiQsb {
  queryQsbAsync(args: QsbArgs): Observable<QsbResult>;
}
