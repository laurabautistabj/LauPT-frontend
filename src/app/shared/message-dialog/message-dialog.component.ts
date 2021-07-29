import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  templateUrl: './message-dialog.component.html'
})
export class MessageDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string, title: string}) {
  }
}
