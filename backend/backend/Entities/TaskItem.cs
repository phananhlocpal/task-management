using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    [Table("TaskItem")]
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }
        [Required, MaxLength(100)]
        public string Title { get; set; }
        public string? Description { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly DueDate { get; set; }
        public int? InchargeId { get; set; }
        public bool IsCompleted { get; set; }
        [ForeignKey("InchargeId")]
        public User? Incharge { get; set; }
    }
}
