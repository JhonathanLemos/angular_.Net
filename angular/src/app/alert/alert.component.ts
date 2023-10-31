import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  message: string = '';
  showAlert: boolean = false;

  showCustomAlert(message : any) {
    this.message = message;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
      this.message = ""
    }, 5000); 
  }
}
