import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from './info-dialog.component';
export class DialogRefOpenor {
  constructor(private dialog: MatDialog) { }
  showDialog(desc: string): MatDialogRef<InfoDialogComponent, any> {
    const checkStates = {
      isChinese: true,
      isEng: true,
      isSbdag: true,
    };
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      data: { desc, checkStates }
    });
    return dialogRef;
  }
}
