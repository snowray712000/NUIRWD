import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from './info-dialog.component';
export class DialogOrigDictOpenor {
  constructor(private dialog: MatDialog) { }
  showDialog(arg: {
    sn: number;
    isOld: boolean;
  }): MatDialogRef<InfoDialogComponent, any> {
    const checkStates = {
      isChinese: true,
      isEng: true,
      isSbdag: true,
    };
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      data: { sn: arg.sn, isOld: arg.isOld, checkStates }
    });
    return dialogRef;
  }
}
