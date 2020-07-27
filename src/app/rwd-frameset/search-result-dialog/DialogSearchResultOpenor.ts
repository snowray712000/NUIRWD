import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SearchResultDialogComponent, DSearchData } from './search-result-dialog.component';
export class DialogSearchResultOpenor {
  constructor(private dialog: MatDialog) { }
  showDialog(keyword: string, isDict?: 1): MatDialogRef<SearchResultDialogComponent, any> {
    const data: DSearchData = { keyword };
    if (isDict !== undefined) {
      data.isDict = 1;
    }
    const dialogRef = this.dialog.open(SearchResultDialogComponent, {
      data
    });
    return dialogRef;
  }
}
