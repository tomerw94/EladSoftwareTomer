import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface GenericYesNoData {
  title: string;
  description: string;
  confirmText: string;
}

@Component({
  selector: 'app-generic-yes-no',
  templateUrl: './generic-yes-no.component.html',
  styleUrls: ['./generic-yes-no.component.scss']
})
export class GenericYesNoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<GenericYesNoData>,
    @Inject(MAT_DIALOG_DATA) public data: GenericYesNoData) { }

  ngOnInit(): void {
  }

  onResult(val: boolean) {
    this.dialogRef.close(val);
  }

}
