import { AfterViewInit, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { TokenService } from '../services-security/token.service';
import { Router } from '@angular/router';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services-security/auth.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent  {
  constructor(private loginService: AuthService) { }

  isAuthenticated(){
    var a =  localStorage.getItem('isAuthenticated')
    return a;
  }
  logout() {
    this.loginService.logout()
  }
}
