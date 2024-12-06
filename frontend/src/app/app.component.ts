import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common'; 

// Import HeaderComponent và FooterComponent
import { HeaderComponent, FooterComponent } from './shared';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent {
  title = 'frontend';
  isAdminRoute: boolean = false;

  constructor(private router: Router) {
    // Kiểm tra đường dẫn và xác định nếu đang ở route admin
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isAdminRoute = this.router.url.includes('/admin'); 
    });
  }
}
