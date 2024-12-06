// src/app/core/core.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { TaskService, UserService } from './services/index';  

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    TaskService,
    UserService
  ], 
  exports: []  
})
export class CoreModule {}
