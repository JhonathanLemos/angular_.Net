import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services-security/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild(AlertComponent) alert !: AlertComponent;

  formulario!: FormGroup;
  routeName !: string;
  mensagem!: string;
  constructor(private service: AuthService, private route: Router) {
    this.formulario = new FormGroup({
      id: new FormControl(0, Validators.required),
      userName: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/)]),
    });
  }

  ngOnInit(): void {
    this.checkRoute();
  }

  validateRoute() {
    return this.routeName == "login" ? true : false
  }
  checkRoute() {
    if (this.route.url == "/login")
      this.routeName = 'login'
    else
      this.routeName = "register"

  }

  register() {
    let login = this.formulario.value
    this.service.register(login).subscribe({
      next: (res) => {

      }, error: (error) => {
        debugger
        this.alert.showCustomAlert(error.error[0].description);
      }
    }
    
    );
  }

  login() {
    let login = this.formulario.value;
    this.service.login(login).subscribe({
      next: (res) => {
        this.route.navigate(['/clientes']);
      },
      error: (error) => {
        this.alert.showCustomAlert('Verifique usuário e senha!');
      }
    });
  }

  navigateToRegister() {
    if (this.validateRoute()) {
      this.route.navigate(['/register']);
    }
  }
}
