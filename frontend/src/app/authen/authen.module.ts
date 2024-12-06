import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenRoutingModule } from './authen.routing.module';
import { FormsModule } from '@angular/forms';
import { LoginComponent, SignUpComponent } from './pages';

import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 


@NgModule({
  declarations: [LoginComponent, SignUpComponent],
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
    AuthenRoutingModule,
    FormsModule
  ]
})
export class AuthenModule { }
