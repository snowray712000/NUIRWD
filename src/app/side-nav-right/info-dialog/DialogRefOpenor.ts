import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from './info-dialog.component';
/** 被取代, 預計拿掉 */
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


