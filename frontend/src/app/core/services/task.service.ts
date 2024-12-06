import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = environment.apiUrl + 'TaskItems';

  constructor(private http: HttpClient) { }

  // Lấy danh sách tất cả task
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Thêm task mới
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // Cập nhật task
  updateTask(task: Task): Observable<Task> {
    console.log(task);
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  }

  // Xóa task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
