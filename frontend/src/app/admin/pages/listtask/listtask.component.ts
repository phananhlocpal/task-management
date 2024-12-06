import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { TaskService, UserService } from '../../../core';
import { Task, User } from '../../../core';

@Component({
  selector: 'app-task-list',
  templateUrl: './listtask.component.html',
  styleUrls: ['./listtask.component.css']
})
export class ListTaskComponent implements OnInit {

  tasks: Task[] = [];
  newTask: Task = { id: 0, title: '', description: '', startDate: '', dueDate: '', inchargeId: null, inchargeName: '', isCompleted: false };
  editingTask: Task | null = null;
  comletedTask: Task | null = null;
  inchargeSuggestions: { id: number, name: string }[] = [];
  filterStatus: string = 'all'; // Filter status: 'all', 'completed', 'pending'

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  // Load tasks from the API
  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.changeDetectorRef.detectChanges(); // Ensure UI is updated
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
      }
    });
  }

  // Filter tasks based on the selected status
  get filteredTasks(): Task[] {
    if (this.filterStatus === 'completed') {
      return this.tasks.filter(task => task.isCompleted);
    } else if (this.filterStatus === 'pending') {
      return this.tasks.filter(task => !task.isCompleted);
    }
    return this.tasks;
  }

  // Change filter status
  changeFilterStatus(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.filterStatus = selectElement.value;
  }

  // Add a new task
  addTask() {
    // Kiểm tra xem inchargeName có được nhập hay không
    if (this.newTask.inchargeName && this.newTask.inchargeName.length > 2) {
      // Tìm kiếm người dùng từ API trước khi thêm task
      this.userService.searchUsersByName(this.newTask.inchargeName).subscribe({
        next: (users) => {
          // Kiểm tra xem người dùng có tồn tại không
          const user = users.find(u => u.name?.toLowerCase() === this.newTask.inchargeName?.toLowerCase());
          if (user) {
            // Nếu người dùng tồn tại, thêm task
            this.newTask.inchargeId = user.id;  // Cập nhật inchargeId từ người dùng tìm thấy
            this.taskService.addTask(this.newTask).subscribe({
              next: (task) => {
                // Cập nhật danh sách task
                this.ngZone.run(() => {
                  this.tasks = [...this.tasks, task];
                  this.newTask = { id: 0, title: '', description: '', startDate: '', dueDate: '', inchargeId: null, inchargeName: '', isCompleted: false };
                });
              },
              error: (err) => {
                console.error('Failed to add task', err);
              }
            });
          } else {
            // Nếu người dùng không tồn tại
            alert('Incharge user not found. Please select an existing user.');
          }
        },
        error: (err) => {
          console.error('Failed to load incharge suggestions', err);
        }
      });
    } else {
      alert('Please enter a valid incharge name.');
    }
  }

  // Edit an existing task
  editTask(task: Task) {
    this.editingTask = { ...task };
  }

  // Update task
  updateTask() {
    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask).subscribe({
        next: (updatedTask) => {
          const index = this.tasks.findIndex(t => t.id === updatedTask.id);
          if (index !== -1) {
            // Update the task list
            this.ngZone.run(() => {
              this.tasks = [...this.tasks.slice(0, index), updatedTask, ...this.tasks.slice(index + 1)];
              this.editingTask = null;
            });
          }
        },
        error: (err) => {
          console.error('Failed to update task', err);
        }
      });
    }
  }

  // Delete task
  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.tasks = this.tasks.filter(task => task.id !== id);
        });
      },
      error: (err) => {
        console.error('Failed to delete task', err);
      }
    });
  }

  // Change the task status to completed
  completeTask(taskId: number) {
    const task = this.tasks.find(task => task.id === taskId);
    if (task) {
      task.isCompleted = true; 
  
      this.taskService.updateTask(task).subscribe({
        next: (updatedTask) => {
          const index = this.tasks.findIndex(t => t.id === updatedTask.id);
          if (index !== -1) {
            // Update the task list
            this.ngZone.run(() => {
              this.tasks = [...this.tasks.slice(0, index), updatedTask, ...this.tasks.slice(index + 1)];
              this.editingTask = null;
            });
          }
        },
        error: (err) => {
          console.error('Failed to update task', err);
        }
      });
    } else {
      console.error('Task not found');
    }
  }

  // Handle incharge name search
  onInchargeSearch() {
    console.log('Incharge name:', this.newTask.inchargeName); // Debug
    if (this.newTask.inchargeName && this.newTask.inchargeName.length > 2) {
      this.userService.searchUsersByName(this.newTask.inchargeName).subscribe({
        next: (users) => {
          console.log('Incharge suggestions:', users); // Debug
          this.inchargeSuggestions = users;
        },
        error: (err) => {
          console.error('Failed to load incharge suggestions', err);
        }
      });
    } else {
      this.inchargeSuggestions = [];
    }
  }

  // Select incharge from suggestions
  selectIncharge(user: { id: number, name: string }) {
    this.newTask.inchargeId = user.id;
    this.newTask.inchargeName = user.name;
    this.inchargeSuggestions = [];
  }
}