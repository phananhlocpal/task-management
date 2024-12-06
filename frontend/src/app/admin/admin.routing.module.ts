import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent, ListTaskComponent } from './pages/index';  

const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'tasks', component: ListTaskComponent },  
  { path: '**', redirectTo: '' } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]
})
export class AdminRoutingModule { }
