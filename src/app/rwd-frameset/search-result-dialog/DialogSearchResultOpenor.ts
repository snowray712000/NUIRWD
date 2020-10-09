import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SearchResultDialogComponent, DSearchData } from './search-result-dialog.component';
import { DAddress } from 'src/app/bible-address/DAddress';
export class DialogSearchResultOpenor {
  constructor(private dialog: MatDialog) { }
  /**
   * @param arg keyword 例子, G81 H81 #太2:3|; 摩西
   */
  // tslint:disable-next-line: max-line-length
  showDialog(arg: { keyword: string, isDict?: 1 | 0, isDictCollection?: 1 | 0, addresses: DAddress[] }): MatDialogRef<SearchResultDialogComponent, any> {
    const data: DSearchData = { keyword: arg.keyword };
    if (arg.isDict === 1) {
      data.isDict = 1;
    }
    if (arg.isDictCollection === 1) {
      data.isDictCollection = 1;
    }
    if (arg.addresses !== undefined) {
      data.addresses = arg.addresses;
    }
    const dialogRef = this.dialog.open(SearchResultDialogComponent, {
      data
    });
    return dialogRef;
  }
}
