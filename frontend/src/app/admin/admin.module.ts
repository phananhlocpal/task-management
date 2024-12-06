import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTaskComponent } from './pages/listtask/listtask.component';
import { AdminRoutingModule } from './admin.routing.module';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages';

@NgModule({
  declarations: [ListTaskComponent, HomeComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]
})
export class AdminModule { }
