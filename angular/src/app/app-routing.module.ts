import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { ProdutoComponent } from './produto/produto.component';
import { AuthGuard } from './guard/auth.guard';
const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: LoginComponent},
  {path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard] },
  {path: 'clientes/:id', component: ClienteFormComponent, canActivate: [AuthGuard] },
  {path: 'clientes/add', component: ClienteFormComponent, canActivate: [AuthGuard] },
  {path: 'produtos', component: ProdutoComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
