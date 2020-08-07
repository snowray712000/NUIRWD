import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from 'src/app/side-nav-right/info-dialog/info-dialog.component';
/** 快被取代了， 使用 DialogSearchResultOpenor 取代*/
export class DialogSnDictOpenor {
  /** dialog 在 component 的 建構子傳入, 是個 service */
  constructor(private dialog: MatDialog) {
  }
  /** tp 是 */
  showDialog(sn: string, type?: 'H' | 'G') {
    if (sn !== undefined) {
      const checkStates = {
        isChinese: true,
        isEng: true,
        isSbdag: true,
      };
      const isOld = type === 'H';
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        data: { sn, isOld, checkStates }
      });
      return dialogRef;
    }
    return undefined;
  }
}
