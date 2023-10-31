import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-alert',
  templateUrl: './confirmation-alert.component.html',
  styleUrls: ['./confirmation-alert.component.css']
})
export class ConfirmationAlertComponent {
  mensagem !: '';
  subMensagem !: '';
  cor !: '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ConfirmationAlertComponent>){
    this.mensagem = this.data.mensagem;
    this.subMensagem = this.data.subMensagem;
    this.cor = this.data.cor;
  }
  onConfirm() {
    this.dialogRef.close('deletar')
  }

  onCancel() {
    this.dialogRef.close('cancelar')
  }
}
