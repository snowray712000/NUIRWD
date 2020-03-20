import { Observable } from 'rxjs';
import { OneBibleVersion } from './OneBibleVersion';
export interface IBibleVersionQueryService {
  queryBibleVersionsAsync(): Observable<OneBibleVersion[]>;
  queryBibleVersions(): OneBibleVersion[];
}
