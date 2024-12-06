import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core';  

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Lấy thông tin người dùng từ UserService
    this.user = this.userService.getUser();
  }
}
