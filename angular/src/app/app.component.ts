import { Component } from '@angular/core';
import { TokenService } from './services-security/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private tokenService: TokenService){}
  title = 'auth-angular';

 
}
