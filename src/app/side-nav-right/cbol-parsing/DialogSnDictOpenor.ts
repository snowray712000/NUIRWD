import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from 'src/app/side-nav-right/cbol-dict/info-dialog/info-dialog.component';
export class DialogSnDictOpenor {
  /** dialog 在 component 的 建構子傳入, 是個 service */
  constructor(private dialog: MatDialog) {
  }
  /** tp 是 */
  showDialog(sn: number, type?: 'H' | 'G') {
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