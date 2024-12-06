import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent, SignUpComponent } from './pages';  

const routes: Routes = [
  { path: 'login', component: LoginComponent },  
  { path: 'signup', component: SignUpComponent }, 
  { path: '**', redirectTo: '' } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]
})
export class AuthenRoutingModule { }
