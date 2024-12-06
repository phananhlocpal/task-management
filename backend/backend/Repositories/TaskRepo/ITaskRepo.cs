using backend.Entities;
using backend.Models;

namespace backend.Repositories.TaskRepo
{
    public interface ITaskRepo
    {
        public Task<TaskItem> CreateTaskAsync(TaskItem task);
        public Task<TaskItemVM> GetTaskByIdAsync(int id);
        public Task<List<TaskItemVM>> GetAllTasksAsync();
        public Task<TaskItem> UpdateTaskAsync(TaskItem task);
        public Task DeleteTaskByIdAsync(int id);
    }
}
