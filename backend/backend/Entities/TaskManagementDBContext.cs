using Microsoft.EntityFrameworkCore;

namespace backend.Entities
{
    public class TaskManagementDBContext : DbContext
    {
        public DbSet<TaskItem> TaskItems { get; set; }
        public DbSet<User> Users { get; set; }

        public TaskManagementDBContext(DbContextOptions<TaskManagementDBContext> options) : base(options)
        {
        }
    }
}
