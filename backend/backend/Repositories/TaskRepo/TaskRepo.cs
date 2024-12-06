using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Entities;
using backend.Models;

namespace backend.Repositories.TaskRepo
{
    public class TaskRepo : ITaskRepo
    {
        private readonly TaskManagementDBContext _context;

        public TaskRepo(TaskManagementDBContext context)
        {
            _context = context;
        }

        public async Task<TaskItem> CreateTaskAsync(TaskItem task)
        {
            await _context.TaskItems.AddAsync(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task DeleteTaskByIdAsync(int id)
        {
            var task = await _context.TaskItems.FindAsync(id);
            if (task != null)
            {
                _context.TaskItems.Remove(task);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<TaskItemVM>> GetAllTasksAsync()
        {
            var tasks = await _context.TaskItems
                .Include(t => t.Incharge) 
                .ToListAsync();

            return tasks.Select(t => new TaskItemVM
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                StartDate = t.StartDate,
                DueDate = t.DueDate,
                InchargeName = t.Incharge.Name,
                InchargeId = t.InchargeId,
                IsCompleted = t.IsCompleted
            }).ToList();
        }

        public async Task<TaskItemVM> GetTaskByIdAsync(int id)
        {
            var task = await _context.TaskItems
                .Include(t => t.Incharge)  
                .FirstOrDefaultAsync(t => t.Id == id); 

            if (task == null)
            {
                return null; 
            }

            return new TaskItemVM
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                StartDate = task.StartDate,
                DueDate = task.DueDate,
                InchargeName = task.Incharge.Name,  
                InchargeId = task.InchargeId,
                IsCompleted = task.IsCompleted
            };
        }

        public async Task<TaskItem> UpdateTaskAsync(TaskItem task)
        {
            _context.TaskItems.Update(task);
            await _context.SaveChangesAsync();
            return task;
        }
    }
}
