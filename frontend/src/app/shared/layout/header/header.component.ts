import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
})
export class HeaderComponent {
  title = 'Task Management';
  userName = 'Guest'; 

  constructor(private router: Router) {
    // Kiểm tra nếu có user trong localStorage
    if (typeof window !== 'undefined' && localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.userName = user?.name || 'Guest';
    }
  }

  // Xử lý đăng xuất
  logOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');

    this.router.navigate(['auth/login']);
  }
}
